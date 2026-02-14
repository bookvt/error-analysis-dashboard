import React, { useState, useMemo, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FileText } from 'lucide-react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';

// Constants & Utils
import { DEFAULT_MAPPING } from '../constants/mappings';
import { getFormattedDate, parseCSVLine } from '../utils/helpers';

// Components
import Header from './dashboard/Header';
import Filters from './dashboard/Filters';
import StatsCards from './dashboard/StatsCards';
import ChartsSection from './dashboard/ChartsSection';

const ErrorDashboard = () => {
  const [rawData, setRawData] = useState([]);
  const [machineMapping, setMachineMapping] = useState(DEFAULT_MAPPING);
  const [fileName, setFileName] = useState('');
  const [mappingFileName, setMappingFileName] = useState('');
  const [targetError, setTargetError] = useState('All');
  const [topMachineCount, setTopMachineCount] = useState(10); 
  const [selectedSerial, setSelectedSerial] = useState(null);
  const [selectedDate, setSelectedDate] = useState('All'); 
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const dashboardRef = useRef(null);
  
  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) {
        alert("Dashboard content not found.");
        return;
    }

    setIsGeneratingPdf(true);

    try {
      const element = dashboardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#0f172a'
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`machine_error_analysis_${targetError}_${getFormattedDate()}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n').map(row => row.trim()).filter(row => row);
      
      if (rows.length < 2) return;

      const headers = parseCSVLine(rows[0]);
      
      const parsedData = rows.slice(1).map(row => {
        const values = parseCSVLine(row);
        const entry = {};
        
        headers.forEach((header, index) => {
            entry[header] = values[index] || '';
        });

        if (entry['Time']) {
            const parts = entry['Time'].split(' ');
            if (parts.length > 0) {
                entry.dateStr = parts[0]; 
            } else {
                entry.dateStr = 'Unknown';
            }
        } else {
            entry.dateStr = 'Unknown';
        }

        return entry;
      });

      setRawData(parsedData);
      setIsDataLoaded(true);
      setSelectedSerial(null);
      setSelectedDate('All'); 
    };

    reader.readAsText(file);
  };

  const handleMappingUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setMappingFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n').map(row => row.trim()).filter(row => row);
      
      const newMapping = { ...DEFAULT_MAPPING };
      
      rows.forEach(row => {
        const parts = row.split(',');
        if (parts.length >= 2) {
            const serial = parts[0].trim();
            const name = parts[1].trim();
            if (serial && name) {
                newMapping[serial] = name;
            }
        }
      });

      setMachineMapping(newMapping);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    setSelectedSerial(null);
  }, [targetError, selectedDate]);

  const uniqueDateOptions = useMemo(() => {
    const dates = new Set();
    rawData.forEach(row => {
        if (row.dateStr && row.dateStr !== 'Unknown' && row.dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            dates.add(row.dateStr);
        }
    });
    return Array.from(dates).sort((a, b) => b.localeCompare(a));
  }, [rawData]);

  const uniqueErrorOptions = useMemo(() => {
    const errorMap = new Map();
    rawData.forEach(row => {
      const code = row['Error Number'];
      const msg = row['Error'];
      if (code && !errorMap.has(code)) {
        errorMap.set(code, msg || 'Unknown Error');
      }
    });

    const options = Array.from(errorMap.entries())
      .map(([code, label]) => ({ code, label: `${code}: ${label}` }))
      .sort((a, b) => {
        const numA = parseInt(a.code, 10);
        const numB = parseInt(b.code, 10);
        return isNaN(numA) || isNaN(numB) ? a.code.localeCompare(b.code) : numA - numB;
      });
      
    options.unshift({ code: 'All', label: 'All Error Codes' });
    return options;
  }, [rawData]);

  const getMachineName = (serial) => {
    return machineMapping[serial] || `Serial ${serial}`;
  };

  const processedData = useMemo(() => {
    if (!rawData.length) return { serialCounts: [], dailyCounts: [], totalErrors: 0, topMachine: null, pieData: [] };

    const filtered = rawData.filter(item => {
      const isTargetError = targetError === 'All' || (item['Error Number'] || '') === targetError;
      const isTargetDate = selectedDate === 'All' || item.dateStr === selectedDate;
      return isTargetError && isTargetDate;
    });

    const serialMap = {};
    filtered.forEach(item => {
      const serial = item['Serial Number'] || 'Unknown';
      serialMap[serial] = (serialMap[serial] || 0) + 1;
    });

    const serialCounts = Object.keys(serialMap)
      .map(serial => ({ 
        serial: serial,
        name: getMachineName(serial),
        count: serialMap[serial] 
      }))
      .sort((a, b) => b.count - a.count);

    const dateMap = {};
    filtered.forEach(item => {
      if (item.dateStr && item.dateStr !== 'Unknown' && item.dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        dateMap[item.dateStr] = (dateMap[item.dateStr] || 0) + 1;
      }
    });

    const dailyCounts = Object.keys(dateMap)
      .map(date => ({ date, count: dateMap[date] }))
      .sort((a, b) => a.date.localeCompare(b.date)); 

    const topMachine = serialCounts.length > 0 ? serialCounts[0] : null;

    const allErrorsFilteredByDate = rawData.filter(item => {
         return selectedDate === 'All' || item.dateStr === selectedDate;
    });

    const totalRecordsInScope = allErrorsFilteredByDate.length;
    const targetCount = filtered.length;
    const otherCount = Math.max(0, totalRecordsInScope - targetCount);

    let pieData = [];
    let pieColors = [];

    if (selectedSerial) {
        const selectedMachineData = serialCounts.find(s => s.serial === selectedSerial);
        const selectedCount = selectedMachineData ? selectedMachineData.count : 0;
        const restOfTargetCount = Math.max(0, targetCount - selectedCount);
        const machineName = getMachineName(selectedSerial);

        pieData = [
            { name: `${machineName}`, value: selectedCount },
            { name: `Other ${targetError}`, value: restOfTargetCount },
            { name: 'Non-Target', value: otherCount }
        ];
        pieColors = ['#ec4899', '#f59e0b', '#334155']; 
    } else {
        pieData = [
            { name: `Error ${targetError}`, value: targetCount },
            { name: 'Other Errors', value: otherCount }
        ];
        pieColors = ['#f59e0b', '#334155'];
    }

    return { 
      filteredData: filtered, 
      serialCounts, 
      dailyCounts, 
      totalErrors: targetCount, 
      topMachine,
      pieData,
      pieColors
    };
  }, [rawData, targetError, selectedSerial, machineMapping, selectedDate]);

  const handleBarClick = (data) => {
    // Handle click from Bar component (direct data)
    if (data && data.serial) {
        setSelectedSerial(prev => prev === data.serial ? null : data.serial);
        return;
    }

    // Fallback: Handle click from BarChart (if event bubbles up)
    if (data && data.activePayload && data.activePayload.length > 0) {
        const clickedSerial = data.activePayload[0].payload.serial;
        setSelectedSerial(prev => prev === clickedSerial ? null : clickedSerial);
    }
  };

  // Helper to find label for selected error
  const selectedErrorLabel = targetError === 'All' ? 'All Error Codes' : (uniqueErrorOptions.find(o => o.code === targetError)?.label || targetError);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3, overflowX: 'hidden' }}>
      <Box sx={{ width: '100%', px: { xs: 1, md: 2 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* Header (Web Only) */}
        <Grid container spacing={3}>
            <Grid item size={{ xs: 12 }} sx={{ width: '100%' }}>
                <Header 
                  isDataLoaded={isDataLoaded}
                  handleDownloadPDF={handleDownloadPDF}
                  isGeneratingPdf={isGeneratingPdf}
                  handleFileUpload={handleFileUpload}
                  handleMappingUpload={handleMappingUpload}
                  getFormattedDate={getFormattedDate}
                />
            </Grid>
        </Grid>

        {/* Filters (Web Only) */}
        <Filters 
          targetError={targetError}
          setTargetError={setTargetError}
          isDataLoaded={isDataLoaded}
          uniqueErrorOptions={uniqueErrorOptions}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          uniqueDateOptions={uniqueDateOptions}
        />

        {/* MAIN DASHBOARD CONTENT (INCLUDED IN PDF) */}
        <div ref={dashboardRef}> 
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {!isDataLoaded ? (
                <Paper 
                    variant="outlined" 
                    sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper', borderRadius: 3, borderStyle: 'dashed' }}
                >
                  <Box sx={{ bgcolor: 'rgba(51, 65, 85, 0.5)', p: 2, borderRadius: '50%', mb: 2 }}>
                    <FileText size={48} className="text-blue-400" />
                  </Box>
                  <Typography variant="h6" color="text.secondary">Upload CSV to start analysis</Typography>
                </Paper>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  
                  {/* PDF Header: Using MUI Box and Typography */}
                  <Grid container spacing={3}>
                      <Grid item size={{ xs: 12 }} sx={{ width: '100%' }}>
                          <Paper variant="outlined" sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h4" fontWeight="bold" color="text.primary">Error Analysis Report</Typography>
                                <Typography variant="body2" color="text.secondary">{getFormattedDate()}</Typography>
                             </Box>
                             <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Box sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)', p: 1.5, borderRadius: 1, border: 1, borderColor: 'divider' }}>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', display: 'block' }}>
                                            Target Error:
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold" sx={{ fontFamily: 'monospace', color: 'secondary.main' }}>
                                            {selectedErrorLabel}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)', p: 1.5, borderRadius: 1, border: 1, borderColor: 'divider' }}>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', display: 'block' }}>
                                            Filter Date:
                                        </Typography>
                                        <Typography variant="body1" fontWeight="bold" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
                                            {selectedDate}
                                        </Typography>
                                    </Box>
                                </Grid>
                             </Grid>
                          </Paper>
                      </Grid>
                  </Grid>
    
                  {/* KPI Cards */}
                  <StatsCards 
                    processedData={processedData} 
                    targetError={targetError} 
                  />
    
                  {/* Charts Row */}
                  <ChartsSection 
                    processedData={processedData}
                    topMachineCount={topMachineCount}
                    setTopMachineCount={setTopMachineCount}
                    handleBarClick={handleBarClick}
                    selectedSerial={selectedSerial}
                    setSelectedSerial={setSelectedSerial}
                    targetError={targetError}
                    getMachineName={getMachineName}
                  />
    
                </Box>
              )}
            </Box>
        </div>
      </Box>
    </Box>
  );
};

export default ErrorDashboard;

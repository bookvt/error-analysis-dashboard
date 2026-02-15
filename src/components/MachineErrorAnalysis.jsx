import React, { useState, useMemo, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FileText } from 'lucide-react';
import { Box, Container, Typography, Paper, Grid, Stack } from '@mui/material';

// Constants & Utils
import { DEFAULT_MAPPING } from '../constants/mappings';
import { getFormattedDate, parseCSVLine } from '../utils/helpers';

// Components
import Header from './dashboard/Header';
import Filters from './dashboard/Filters';
import StatsCards from './dashboard/StatsCards';
import ChartsSection from './dashboard/ChartsSection';

const MachineErrorAnalysis = () => {
  const [rawData, setRawData] = useState([]);
  const [machineMapping, setMachineMapping] = useState(DEFAULT_MAPPING);
  const [fileName, setFileName] = useState('');
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
        backgroundColor: '#0f172a' // Updated to Slate 900
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
            const rawValue = values[index] || '';
            entry[header.trim()] = rawValue.trim();
        });

        // Date & Time Parsing Logic
        let dateStr = 'Unknown';
        let timeStr = '';

        if (entry['Timestamp']) {
            // Handle "YYYY-MM-DD HH:mm:ss"
            const parts = entry['Timestamp'].split(' ');
            if (parts.length >= 2) {
                dateStr = parts[0];
                timeStr = parts[1];
            } else if (parts.length === 1) {
                dateStr = parts[0]; // Assume just date
            }
        } else if (entry['Date']) {
             // Handle explicit Date column
             dateStr = entry['Date'];
             if (entry['Time']) {
                timeStr = entry['Time'];
             }
        } else if (entry['Time']) {
            // Handle legacy format where Date might be in Time column or just Time
            const parts = entry['Time'].split(' ');
            if (parts.length > 1) {
                dateStr = parts[0];
                timeStr = parts[1];
            } else {
                // Try to recognize if it's a date or time
                if (entry['Time'].includes(':')) {
                    timeStr = entry['Time'];
                } else {
                    dateStr = entry['Time'];
                }
            }
        }
        
        // Normalize date format if needed (simple check)
        // If date is D/M/Y or D-M-Y, try to convert to YYYY-MM-DD for consistency
        if (dateStr !== 'Unknown' && !dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Attempt simple conversion for DD/MM/YYYY or DD-MM-YYYY
            const parts = dateStr.split(/[-/]/);
            if (parts.length === 3) {
                // assume DD-MM-YYYY or MM-DD-YYYY? 
                // Let's assume DD-MM-YYYY based on typical non-ISO usage
                // If year is last
                if (parts[2].length === 4) {
                    dateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                }
            }
        }

        entry.dateStr = dateStr;
        
        // Ensure entry['Time'] is populated for Hourly chart if it wasn't before
        if (!entry['Time'] && timeStr) {
            entry['Time'] = timeStr;
        } else if (entry['Time'] && !timeStr) {
             const parts = entry['Time'].split(' ');
             if (parts.length > 1) timeStr = parts[1];
             else timeStr = parts[0];
        }

        // Flexible Column Mapping for Serial/Machine
        // Prioritize 'Serial Number', then 'Serial', 'Machine', 'Machine Name', 'Device ID'
        if (!entry['Serial Number']) {
            entry['Serial Number'] = entry['Serial'] || entry['Machine'] || entry['Machine Name'] || entry['Device ID'] || 'Unknown';
        }

        // Flexible Column Mapping for Error Code
        if (!entry['Error Number']) {
             entry['Error Number'] = entry['Error Code'] || entry['Error'] || entry['Code'] || 'Unknown';
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

    // Line Chart Data
    // Filter by BOTH error (targetError) AND machine (selectedSerial if active)
    const lineChartRawData = rawData.filter(item => {
        const isTargetError = targetError === 'All' || (item['Error Number'] || '') === targetError;
        const isTargetMachine = !selectedSerial || (item['Serial Number'] || 'Unknown') === selectedSerial;
        // Note: We intentionally DO NOT filter by selectedDate for the Line Chart 
        // because the Line Chart purpose is to show the trend over time (Active Days).
        return isTargetError && isTargetMachine;
    });

    const lineChartDateMap = {};
    lineChartRawData.forEach(item => {
        if (item.dateStr && item.dateStr !== 'Unknown' && item.dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            lineChartDateMap[item.dateStr] = (lineChartDateMap[item.dateStr] || 0) + 1;
        }
    });

    const lineChartData = Object.keys(lineChartDateMap)
        .map(date => ({ date, count: lineChartDateMap[date] }))
        .sort((a, b) => a.date.localeCompare(b.date));

    // NEW CHARTS DATA PROCESSING

    // 1. Hourly Distribution (0-23 hours)
    const hourlyMap = Array(24).fill(0);
    filtered.forEach(item => {
        if (item['Time']) {
            const timePart = item['Time'].split(' ')[1]; // Get "HH:MM:SS" or "HH:MM"
            if (timePart) {
                const hour = parseInt(timePart.split(':')[0], 10);
                if (!isNaN(hour) && hour >= 0 && hour < 24) {
                    hourlyMap[hour]++;
                }
            }
        }
    });
    const hourlyDistribution = hourlyMap.map((count, hour) => ({ 
        hour: `${hour.toString().padStart(2, '0')}:00`, 
        count 
    }));

    // 2. Heatmap Data (Machine × Date matrix)
    const heatmapMatrix = {};
    const allDates = new Set();
    const allMachines = new Set();
    
    rawData.forEach(item => {
        if (item.dateStr && item.dateStr !== 'Unknown' && item.dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            allDates.add(item.dateStr);
        }
        const serial = item['Serial Number'] || 'Unknown';
        allMachines.add(serial);
    });

    const sortedDates = Array.from(allDates).sort();
    const sortedMachines = Array.from(allMachines).sort();

    filtered.forEach(item => {
        const serial = item['Serial Number'] || 'Unknown';
        const date = item.dateStr;
        if (date && date !== 'Unknown' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const key = `${serial}|${date}`;
            heatmapMatrix[key] = (heatmapMatrix[key] || 0) + 1;
        }
    });

    const heatmapData = sortedMachines.map(serial => {
        const machineName = getMachineName(serial);
        const dataPoints = sortedDates.map(date => ({
            date,
            machine: machineName,
            serial,
            value: heatmapMatrix[`${serial}|${date}`] || 0
        }));
        return { serial, machineName, dataPoints };
    });

    // 2.1 Pivoted Data for Stacked Bar Chart (Machine x Date)
    // Structure: [{ date: '2024-01-01', 'Machine A': 5, 'Machine B': 2 }, ...]
    const machineDailyData = sortedDates.map(date => {
        const entry = { date };
        sortedMachines.forEach(serial => {
            const machineName = getMachineName(serial);
            entry[machineName] = heatmapMatrix[`${serial}|${date}`] || 0;
        });
        return entry;
    });
    
    // Get list of all machine names for the stacks
    const allMachineNames = sortedMachines.map(serial => getMachineName(serial));

    // 3. Multi-Error Trend Data (Top 5 errors over time)
    const errorCodeMap = {};
    rawData.forEach(item => {
        const errorCode = item['Error Number'];
        if (errorCode) {
            errorCodeMap[errorCode] = (errorCodeMap[errorCode] || 0) + 1;
        }
    });

    const top5Errors = Object.entries(errorCodeMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([code]) => code);

    const multiErrorTrendMap = {};
    rawData.forEach(item => {
        const errorCode = item['Error Number'];
        const date = item.dateStr;
        if (top5Errors.includes(errorCode) && date && date !== 'Unknown' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            if (!multiErrorTrendMap[date]) {
                multiErrorTrendMap[date] = {};
            }
            multiErrorTrendMap[date][errorCode] = (multiErrorTrendMap[date][errorCode] || 0) + 1;
        }
    });

    const allDatesForTrend = new Set();
    rawData.forEach(item => {
        if (item.dateStr && item.dateStr !== 'Unknown' && item.dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            allDatesForTrend.add(item.dateStr);
        }
    });

    const multiErrorTrendData = Array.from(allDatesForTrend)
        .sort()
        .map(date => {
            const dataPoint = { date };
            top5Errors.forEach(errorCode => {
                dataPoint[errorCode] = (multiErrorTrendMap[date] && multiErrorTrendMap[date][errorCode]) || 0;
            });
            return dataPoint;
        });

    return { 
      filteredData: filtered, 
      serialCounts, 
      dailyCounts, 
      totalErrors: targetCount, 
      topMachine,
      pieData,
      pieColors,
      lineChartData,
      hourlyDistribution,
      heatmapData,
      machineDailyData,
      allMachineNames,
      multiErrorTrendData,
      top5Errors
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
  const selectedErrorLabel = targetError === 'All' 
    ? 'All Error Codes' 
    : (uniqueErrorOptions.find(o => String(o.code).trim() === String(targetError).trim())?.label || targetError);

  return (
    <Box sx={{ width: '100%', px: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
      
      {/* Header (Web Only) */}
      <Grid container spacing={3}>
          <Grid item size={{ xs: 12 }} sx={{ width: '100%' }}>
              <Header 
                isDataLoaded={isDataLoaded}
                handleDownloadPDF={handleDownloadPDF}
                isGeneratingPdf={isGeneratingPdf}
                handleFileUpload={handleFileUpload}
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {!isDataLoaded ? (
              <Paper 
                  variant="outlined" 
                  sx={{ 
                      py: 12, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      bgcolor: 'rgba(30, 41, 59, 0.2)', 
                      borderRadius: 3, 
                      borderStyle: 'dashed', 
                      borderColor: 'rgba(255, 255, 255, 0.1)' 
                  }}
              >
                <Box sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', p: 3, borderRadius: '50%', mb: 2 }}>
                  <FileText size={48} className="text-blue-500" />
                </Box>
                <Typography variant="h6" color="text.secondary" fontWeight="medium">Upload CSV to start analysis</Typography>
                <Box sx={{ 
                  mt: 2, 
                  bgcolor: 'rgba(251, 191, 36, 0.1)', 
                  color: '#fbbf24', 
                  px: 2, 
                  py: 1, 
                  borderRadius: 2, 
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                  fontSize: '0.875rem',
                  fontWeight: 'medium'
                }}>
                  Note: No data is collected. All processing is done locally in your browser.
                </Box>
              </Paper>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                
                {/* Report Header Grid */}
                <Grid container spacing={3}>
                    <Grid item size={{ xs: 12 }} sx={{ width: '100%' }}>
                        <Paper 
                          elevation={0}
                          sx={{ 
                              p: 4, 
                              bgcolor: 'rgba(30, 41, 59, 0.4)', // slate-800/40
                              backdropFilter: 'blur(12px)',
                              borderRadius: 3,
                              border: '1px solid',
                              borderColor: 'rgba(255, 255, 255, 0.1)'
                          }}
                        >
                           <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} mb={3}>
                              <div>
                                  <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: '-0.5px' }} color="white">Error Analysis Report</Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Generated on {getFormattedDate()}</Typography>
                              </div>
                              <Box sx={{ px: 2, py: 0.5, bgcolor: 'rgba(16, 185, 129, 0.1)', borderRadius: 2, border: '1px solid', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                                  <Typography variant="caption" fontWeight="bold" sx={{ color: '#34d399' }}>LIVE DATA</Typography>
                              </Box>
                           </Stack>
                           
                           <Grid container spacing={3}>
                              <Grid item size={{ xs: 12, md: 6 }} sx={{ width: '100%' }}>
                                  <Box sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)', p: 2, borderRadius: 2, border: '1px solid', borderColor: 'rgba(255, 255, 255, 0.05)', width: '100%' }}>
                                      <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', display: 'block', mb: 0.5, letterSpacing: '0.5px' }}>
                                          Target Error
                                      </Typography>
                                      <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'monospace', color: 'secondary.main', wordBreak: 'break-all', lineHeight: 1.2 }}>
                                          {selectedErrorLabel}
                                      </Typography>
                                  </Box>
                              </Grid>
                              <Grid item size={{ xs: 12, md: 6 }} sx={{ width: '100%' }}>
                                  <Box sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)', p: 2, borderRadius: 2, border: '1px solid', borderColor: 'rgba(255, 255, 255, 0.05)', width: '100%' }}>
                                      <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', display: 'block', mb: 0.5, letterSpacing: '0.5px' }}>
                                          Filter Date
                                      </Typography>
                                      <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'monospace', color: 'primary.main', lineHeight: 1.2 }}>
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
                  selectedErrorLabel={selectedErrorLabel}
                />
  
              </Box>
            )}
          </Box>
      </div>
    </Box>
  );
};

export default MachineErrorAnalysis;

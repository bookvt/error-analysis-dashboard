import React, { useRef, useState } from 'react';
import { Activity, Download, Loader2, Upload, FileImage, FileText, ShieldCheck } from 'lucide-react';
import { Box, Button, Typography, Paper, Stack, Menu, MenuItem } from '@mui/material';

const Header = ({ 
  isDataLoaded, 
  handleExport, 
  handleFileUpload,
  isGeneratingPdf 
}) => {
  const fileInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openExportMenu = Boolean(anchorEl);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseExportMenu = () => {
    setAnchorEl(null);
  };

  const onExportSelect = (format) => {
    handleCloseExportMenu();
    handleExport(format);
  };

  return (
    <Paper 
        elevation={0}
        sx={{ 
            p: 3, 
            bgcolor: 'rgba(30, 41, 59, 0.4)', // slate-800/40
            backdropFilter: 'blur(12px)',
            borderRadius: 3, 
            display: 'flex', 
            flexDirection: { xs: 'column', xl: 'row' },
            alignItems: { xl: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            border: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        <Typography variant="h4" component="h1" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, background: 'linear-gradient(to right, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <Activity size={32} className="text-blue-400" style={{ stroke: '#60a5fa' }} />
          Machine Error Analysis Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.5, color: 'text.secondary', fontWeight: 'medium' }}>
            Upload Error Log & Machine Mapping to visualize insights 
            <Box component="span" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mt: 1.5, 
                fontSize: '0.85em', 
                color: '#fbbf24', 
                fontWeight: 'bold',
                bgcolor: 'rgba(251, 191, 36, 0.1)',
                py: 0.5,
                px: 1.5,
                borderRadius: 2,
                width: 'fit-content',
                border: '1px solid rgba(251, 191, 36, 0.2)'
            }}>
               <ShieldCheck size={14} />
               Note: No data is collected. All processing is done locally in your browser.
            </Box>
        </Typography>
      </Box>
      
      <Stack direction="row" spacing={2} flexWrap="wrap">
         {isDataLoaded && (
            <>
                <Button
                    variant="contained"
                    onClick={handleExportClick}
                    disabled={isGeneratingPdf}
                    startIcon={isGeneratingPdf ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                    sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.05)', 
                        color: 'white',
                        border: '1px solid',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(4px)',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        py: 1,
                        px: 3,
                        borderRadius: 2,
                        '&:hover': { 
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            borderColor: 'rgba(255, 255, 255, 0.2)'
                        } 
                    }}
                >
                    {isGeneratingPdf ? 'Exporting...' : 'Export'}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={openExportMenu}
                    onClose={handleCloseExportMenu}
                    slotProps={{
                        paper: {
                            sx: {
                                bgcolor: '#1e293b',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.1)',
                                mt: 1
                            }
                        }
                    }}
                >
                    <MenuItem onClick={() => onExportSelect('png')} sx={{ gap: 1.5 }}>
                        <FileImage size={18} className="text-blue-400" /> Export as PNG
                    </MenuItem>
                    <MenuItem onClick={() => onExportSelect('jpg')} sx={{ gap: 1.5 }}>
                        <FileImage size={18} className="text-orange-400" /> Export as JPG
                    </MenuItem>
                    <MenuItem onClick={() => onExportSelect('pdf')} sx={{ gap: 1.5 }}>
                        <FileText size={18} className="text-red-400" /> Export as PDF
                    </MenuItem>
                </Menu>
            </>
         )}
         
         <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            ref={fileInputRef}
         />
         <Button
            variant="contained"
            onClick={handleUploadClick}
            startIcon={<Upload size={20} />}
            sx={{
                background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                textTransform: 'none',
                fontWeight: 'bold',
                py: 1,
                px: 3,
                borderRadius: 2,
                '&:hover': {
                    background: 'linear-gradient(to right, #2563eb, #0891b2)',
                    boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
                }
            }}
         >
            Upload CSV
         </Button>
      </Stack>
    </Paper>
  );
};

export default Header;

import React, { useState } from 'react';
import { Box, Tabs, Tab, Container, Typography, Button } from '@mui/material';
import { LayoutDashboard, Scale, LogOut } from 'lucide-react';

// Components
import MachineErrorAnalysis from './MachineErrorAnalysis';
import LineBalancing from './LineBalancing';

const ErrorDashboard = ({ onLogout }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4, overflowX: 'hidden' }}>
      
      {/* Top Navigation Bar */}
      <Box sx={{ 
        bgcolor: 'rgba(15, 23, 42, 0.6)', 
        backdropFilter: 'blur(12px)', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <Container maxWidth="xl">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
                <Tabs 
                    value={currentTab} 
                    onChange={handleTabChange} 
                    aria-label="dashboard tabs"
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#3b82f6',
                            height: 3,
                            borderRadius: '3px 3px 0 0'
                        },
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            color: '#94a3b8',
                            minHeight: 64,
                            gap: 1.5,
                            '&.Mui-selected': {
                                color: '#3b82f6',
                            },
                            '&:hover': {
                                color: '#e2e8f0',
                                bgcolor: 'rgba(255, 255, 255, 0.02)'
                            }
                        }
                    }}
                >
                    <Tab 
                        icon={<LayoutDashboard size={18} />} 
                        iconPosition="start" 
                        label="Machine Error Analysis" 
                    />
                    <Tab 
                        icon={<Scale size={18} />} 
                        iconPosition="start" 
                        label="Line Balancing" 
                    />
                </Tabs>
                
                {/* We can place global actions here if needed, like User Profile or Settings */}
                <Button
                    variant="outlined"
                    onClick={onLogout}
                    startIcon={<LogOut size={16} />}
                    sx={{
                        color: '#ef4444',
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        py: 0.5,
                        px: 2,
                        borderRadius: 2,
                        minHeight: 36,
                        '&:hover': {
                            borderColor: '#ef4444',
                            bgcolor: 'rgba(239, 68, 68, 0.05)'
                        }
                    }}
                >
                    Sign Out
                </Button>
            </Box>
        </Container>
      </Box>

      {/* Tab Content */}
      <Box sx={{ py: 3 }}>
        {currentTab === 0 && <MachineErrorAnalysis onLogout={onLogout} />}
        {currentTab === 1 && <LineBalancing />}
      </Box>

    </Box>
  );
};

export default ErrorDashboard;

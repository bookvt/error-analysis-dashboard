import React from 'react';
import { AlertTriangle, Activity, Calendar } from 'lucide-react';
import { Card, CardContent, Grid, Typography, Box, Stack } from '@mui/material';

const StatsCards = ({ processedData, targetError }) => {
  const cards = [
    {
      title: "Total Occurrences",
      value: processedData.totalErrors,
      subtext: `Error Code ${targetError}`,
      icon: <AlertTriangle size={24} className="text-red-400" />,
      color: 'rgba(239, 68, 68, 0.1)', // red-500/10
      borderColor: 'rgba(239, 68, 68, 0.5)', // red-500/50
      glowColor: 'rgba(239, 68, 68, 0.2)'
    },
    {
      title: "Top Impacted Machine",
      value: processedData.topMachine ? processedData.topMachine.name : '-',
      subtext: processedData.topMachine ? `${processedData.topMachine.count} incidents` : 'No Data',
      icon: <Activity size={24} className="text-amber-400" />,
      color: 'rgba(245, 158, 11, 0.1)', // amber-500/10
      borderColor: 'rgba(245, 158, 11, 0.5)', // amber-500/50
      glowColor: 'rgba(245, 158, 11, 0.2)'
    },
    {
      title: "Active Days (In Scope)",
      value: `${processedData.dailyCounts.length} Day${processedData.dailyCounts.length !== 1 ? 's' : ''}`,
      subtext: null,
      icon: <Calendar size={24} className="text-blue-400" />,
      color: 'rgba(59, 130, 246, 0.1)', // blue-500/10
      borderColor: 'rgba(59, 130, 246, 0.5)', // blue-500/50
      glowColor: 'rgba(59, 130, 246, 0.2)'
    }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item size={{ xs: 12, md: 4 }} sx={{ width: '100%' }} key={index}>
          <Card 
            sx={{ 
                height: '100%',
                bgcolor: 'rgba(30, 41, 59, 0.4)', // slate-800/40
                backdropFilter: 'blur(12px)',
                border: '1px solid',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 24px -10px ${card.glowColor}`,
                    borderColor: card.borderColor
                }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, mb: 0.5, color: 'white' }}>
                    {card.value}
                  </Typography>
                  {card.subtext && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                      {card.subtext}
                    </Typography>
                  )}
                </Box>
                <Box 
                    sx={{ 
                        p: 1.5, 
                        borderRadius: 2,
                        bgcolor: card.color,
                        boxShadow: `0 0 15px ${card.glowColor}`,
                        border: '1px solid',
                        borderColor: card.borderColor
                    }}
                >
                  {card.icon}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsCards;

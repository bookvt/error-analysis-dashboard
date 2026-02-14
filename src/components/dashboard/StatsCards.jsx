import React from 'react';
import { AlertTriangle, Activity, Calendar } from 'lucide-react';
import { Card, CardContent, Grid, Typography, Box, Stack } from '@mui/material';

const StatsCards = ({ processedData, targetError }) => {
  const cards = [
    {
      title: "Total Occurrences",
      value: processedData.totalErrors,
      subtext: `Error Code ${targetError}`,
      icon: <AlertTriangle size={24} className="text-red-500" />,
      color: 'error.main', // red-500
      borderColor: '#ef4444' // red-500
    },
    {
      title: "Top Impacted Machine",
      value: processedData.topMachine ? processedData.topMachine.name : '-',
      subtext: processedData.topMachine ? `${processedData.topMachine.count} incidents` : 'No Data',
      icon: <Activity size={24} className="text-amber-500" />,
      color: 'warning.main', // amber-500
      borderColor: '#f59e0b' // amber-500
    },
    {
      title: "Active Days (In Scope)",
      value: `${processedData.dailyCounts.length} Day${processedData.dailyCounts.length !== 1 ? 's' : ''}`,
      subtext: null,
      icon: <Calendar size={24} className="text-blue-500" />,
      color: 'info.main', // blue-500
      borderColor: '#3b82f6' // blue-500
    }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item size={{ xs: 12, md: 4 }} sx={{ width: '100%' }} key={index}>
          <Card 
            sx={{ 
                height: '100%',
                borderLeft: 4, 
                borderLeftColor: card.borderColor,
                position: 'relative',
                overflow: 'visible'
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="medium">
                    {card.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: 'text.primary' }}>
                    {card.value}
                  </Typography>
                  {card.subtext && (
                    <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: card.borderColor, fontWeight: 'medium' }}>
                      {card.subtext}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ p: 1, bgcolor: 'rgba(51, 65, 85, 0.5)', borderRadius: 2 }}>
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

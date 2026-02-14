import React from 'react';
import { AlertTriangle, Calendar } from 'lucide-react';
import { Grid, Paper, Typography, Box, Select, MenuItem, FormControl } from '@mui/material';
import SearchableDropdown from '../common/SearchableDropdown';

const Filters = ({ 
  targetError, 
  setTargetError, 
  isDataLoaded, 
  uniqueErrorOptions, 
  selectedDate, 
  setSelectedDate, 
  uniqueDateOptions 
}) => {
  return (
    <Grid container spacing={3} sx={{ width: '100%'}}>
        <Grid item size={{ xs: 12, md: 6 }} sx={{ width: '100%' }}>
            <Paper sx={{ height: '100%', p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper', borderRadius: 3, border: 1, borderColor: 'divider' }}>
                 <Box sx={{ p: 1, bgcolor: 'rgba(51, 65, 85, 0.5)', borderRadius: 2, display: 'flex' }}>
                    <AlertTriangle size={20} className="text-slate-300"/>
                 </Box>
                 <Box sx={{ flex: 1 }}>
                     <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                        Select Error Code
                     </Typography>
                     <SearchableDropdown 
                        options={uniqueErrorOptions}
                        value={targetError}
                        onChange={setTargetError}
                        disabled={!isDataLoaded}
                        placeholder={!isDataLoaded ? "Waiting for CSV..." : "Search Error Code..."}
                     />
                 </Box>
            </Paper>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }} sx={{ width: '100%' }}>
            <Paper sx={{ height: '100%', p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper', borderRadius: 3, border: 1, borderColor: 'divider' }}>
                 <Box sx={{ p: 1, bgcolor: 'rgba(51, 65, 85, 0.5)', borderRadius: 2, display: 'flex' }}>
                    <Calendar size={20} className="text-slate-300"/>
                 </Box>
                 <Box sx={{ flex: 1 }}>
                     <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                        Select Date
                     </Typography>
                     <FormControl fullWidth size="small" variant="standard">
                       <Select
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          disabled={!isDataLoaded}
                          disableUnderline
                          sx={{ 
                            color: 'white', 
                            fontSize: '1.125rem', 
                            fontWeight: 'bold',
                            '& .MuiSelect-select': { padding: 0 }
                          }}
                       >
                          <MenuItem value="All">All Dates</MenuItem>
                          {uniqueDateOptions.map((date) => (
                              <MenuItem key={date} value={date}>{date}</MenuItem>
                          ))}
                       </Select>
                     </FormControl>
                 </Box>
            </Paper>
        </Grid>
    </Grid>
  );
};

export default Filters;

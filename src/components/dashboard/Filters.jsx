import React from 'react';
import { Search, Calendar, Filter } from 'lucide-react';
import { Box, Paper, Typography, TextField, MenuItem, Autocomplete, InputAdornment, Grid } from '@mui/material';

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
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        bgcolor: 'rgba(30, 41, 59, 0.4)', // slate-800/40
        backdropFilter: 'blur(12px)',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }}
    >
        <Grid container spacing={3} alignItems="center">
            <Grid item size={{ xs: 12, md: 3 }} sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary', mb: { xs: 1, md: 0 } }}>
                    <Filter size={20} className="text-blue-400" />
                    <Typography fontWeight="medium" sx={{ color: 'white' }}>Filter Data</Typography>
                </Box>
            </Grid>

            {/* Error Code Filter */}
            <Grid item size={{ xs: 12, md: 4.5 }} sx={{ width: '100%' }}>
                <Autocomplete
                    id="error-code-select"
                    options={uniqueErrorOptions}
                    getOptionLabel={(option) => {
                        if (typeof option === 'string') return option;
                        return option.label || option.code || '';
                    }}
                    value={uniqueErrorOptions.find(o => String(o.code).trim() === String(targetError).trim()) || null}
                    onChange={(_, newValue) => {
                        if (newValue) {
                            setTargetError(newValue.code);
                        } else {
                            setTargetError('All');
                        }
                    }}
                    disabled={!isDataLoaded}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Search Error Code..."
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <>
                                        <InputAdornment position="start">
                                            <Search size={18} className="text-slate-400" />
                                        </InputAdornment>
                                        {params.InputProps.startAdornment}
                                    </>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'rgba(15, 23, 42, 0.5)', // slate-900/50
                                    color: 'white',
                                    borderRadius: 1.5,
                                    '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                                    '&:hover fieldset': { borderColor: 'rgba(148, 163, 184, 0.4)' },
                                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                                },
                                '& .MuiInputBase-input::placeholder': { color: '#94a3b8', opacity: 1 },
                                '& .MuiSvgIcon-root': { color: '#94a3b8' }
                            }}
                        />
                    )}
                />
            </Grid>

            {/* Date Filter */}
            <Grid item size={{ xs: 12, md: 4.5 }} sx={{ width: '100%' }}>
                 <TextField
                    select
                    fullWidth
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    disabled={!isDataLoaded}
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Calendar size={18} className="text-slate-400" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(15, 23, 42, 0.5)', // slate-900/50
                            color: 'white',
                            borderRadius: 1.5,
                            '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                            '&:hover fieldset': { borderColor: 'rgba(148, 163, 184, 0.4)' },
                            '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                        },
                        '& .MuiSvgIcon-root': { color: '#94a3b8' }
                    }}
                >
                    <MenuItem value="All">All Dates</MenuItem>
                    {uniqueDateOptions.map((date) => (
                        <MenuItem key={date} value={date}>{date}</MenuItem>
                    ))}
                </TextField>
            </Grid>
        </Grid>
    </Paper>
  );
};

export default Filters;

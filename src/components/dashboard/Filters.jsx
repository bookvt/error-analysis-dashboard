import React from 'react';
import { Search, Calendar, Filter, X, CheckSquare } from 'lucide-react';
import { Box, Paper, Typography, TextField, MenuItem, Autocomplete, InputAdornment, Grid, Checkbox, ListItemText, Button, Divider } from '@mui/material';

const Filters = ({ 
  targetError, 
  setTargetError, 
  isDataLoaded, 
  uniqueErrorOptions,
  selectedDate,
  setSelectedDate,
  uniqueDateOptions
}) => {
  const isAllSelected = uniqueDateOptions.length > 0 && selectedDate.length === uniqueDateOptions.length;

  const handleDateChange = (event) => {
      const {
        target: { value },
      } = event;
      
      // On Autofill we get a stringified value.
      const newSelected = typeof value === 'string' ? value.split(',') : value;
      setSelectedDate(newSelected);
  };

  const handleSelectAll = () => {
      if (isAllSelected) {
          setSelectedDate([]);
      } else {
          setSelectedDate(uniqueDateOptions);
      }
  };

  const handleClearAll = () => {
      setSelectedDate([]);
  };

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
                        onChange={handleDateChange}
                        disabled={!isDataLoaded}
                        variant="outlined"
                        SelectProps={{
                            multiple: true,
                            renderValue: (selected) => {
                                if (selected.length === 0) return "All Dates";
                                if (selected.length === uniqueDateOptions.length) return "All Dates Selected";
                                if (selected.length === 1) return selected[0];
                                return `${selected.length} Dates Selected`;
                            },
                            MenuProps: {
                                PaperProps: {
                                    style: {
                                        maxHeight: 400,
                                        width: 250,
                                        marginTop: 8
                                    },
                                },
                            }
                        }}
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
                        <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                             <Button 
                                size="small" 
                                fullWidth 
                                variant={isAllSelected ? "contained" : "outlined"} 
                                color={isAllSelected ? "error" : "primary"}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent menu close
                                    handleSelectAll();
                                }}
                                sx={{ textTransform: 'none' }}
                             >
                                {isAllSelected ? "Deselect All" : "Select All"}
                             </Button>
                             <Button 
                                size="small" 
                                fullWidth 
                                variant="outlined" 
                                color="inherit"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClearAll();
                                }}
                                sx={{ textTransform: 'none', color: 'text.secondary', borderColor: 'rgba(148, 163, 184, 0.3)' }}
                             >
                                Clear
                             </Button>
                        </Box>
                        <Divider sx={{ my: 1, borderColor: 'rgba(148, 163, 184, 0.1)' }} />
                        
                        {uniqueDateOptions.map((date) => (
                            <MenuItem key={date} value={date}>
                                <Checkbox checked={selectedDate.indexOf(date) > -1} size="small" sx={{ color: 'rgba(148, 163, 184, 0.5)' }} />
                                <ListItemText primary={date} />
                            </MenuItem>
                        ))}
                    </TextField>
            </Grid>
        </Grid>
    </Paper>
  );
};

export default Filters;

import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const SearchableDropdown = ({ options, value, onChange, disabled, placeholder = "Select..." }) => {
  const selectedOption = options.find(opt => opt.code === value) || null;

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label || ''}
      value={selectedOption}
      onChange={(_, newValue) => {
        onChange(newValue ? newValue.code : '');
      }}
      disabled={disabled}
      renderInput={(params) => (
        <TextField 
          {...params} 
          placeholder={placeholder} 
          variant="outlined" 
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(51, 65, 85, 0.5)', // slate-700/50
                color: 'white',
                '& fieldset': {
                    borderColor: '#475569', // slate-600
                },
                '&:hover fieldset': {
                    borderColor: '#94a3b8', // slate-400
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6', // blue-500
                },
            },
            '& .MuiInputBase-input': {
                color: 'white',
            },
            '& .MuiSvgIcon-root': {
                color: '#94a3b8', // slate-400
            }
          }}
        />
      )}
      renderOption={(props, option) => (
         <li {...props} className={`${props.className} !bg-slate-800 hover:!bg-slate-700 !text-slate-200 !border-b !border-slate-700/50 last:!border-0`}>
             <span className="font-bold text-xs bg-slate-900 px-1.5 py-0.5 rounded mr-2 text-slate-400">
               {option.code}
             </span>
             {option.label.replace(`${option.code}: `, '')}
         </li>
      )}
      PaperComponent={({ children }) => (
        <div className="bg-slate-800 border border-slate-600 rounded-lg shadow-xl mt-1 overflow-hidden">
            {children}
        </div>
      )}
      sx={{ width: '100%' }}
    />
  );
};

export default SearchableDropdown;

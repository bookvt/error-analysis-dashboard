import React, { useState, useMemo } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Button, 
    TextField, 
    IconButton, 
    Grid, 
    Stack, 
    Divider,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tooltip
} from '@mui/material';
import { 
    Plus, 
    Trash2, 
    Settings, 
    Save, 
    BarChart3, 
    Clock, 
    Users, 
    ChevronDown,
    Activity
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip, 
    Legend, 
    ResponsiveContainer, 
    ReferenceLine,
    Cell
} from 'recharts';

// Generates a random color for each new task to keep the chart colorful
const getRandomColor = () => {
    const colors = [
        '#60a5fa', '#34d399', '#f472b6', '#a78bfa', '#fbbf24', 
        '#f87171', '#22d3ee', '#818cf8', '#e879f9', '#4ade80'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

const CustomBarLabel = (props) => {
    const { x, y, width, height, name } = props;
    // Hide label if bar is too short or narrow
    if (height < 20 || width < 20) return null;
    
    return (
        <text 
            x={x + width / 2} 
            y={y + height / 2} 
            fill="white" 
            textAnchor="middle" 
            dominantBaseline="middle"
            style={{ 
                fontSize: 11, 
                fontWeight: 'bold', 
                textShadow: '0px 0px 4px rgba(0,0,0,0.9)',
                pointerEvents: 'none' // Prevent blocking tooltip
            }}
        >
            {name}
        </text>
    );
};

const LineBalancing = () => {
    // State
    const [targetTime, setTargetTime] = useState(60); // Default 60 seconds
    const [targetUnit, setTargetUnit] = useState('sec'); // 'sec' or 'min'
    
    // Initial data structure for stations
    const [stations, setStations] = useState([
        {
            id: 1,
            name: 'Station 1',
            tasks: [
                { id: 101, name: 'Task A', time: 30, unit: 'sec', color: '#60a5fa' },
                { id: 102, name: 'Task B', time: 15, unit: 'sec', color: '#34d399' }
            ]
        }
    ]);

    // Helpers
    const handleAddStation = () => {
        const newId = stations.length > 0 ? Math.max(...stations.map(s => s.id)) + 1 : 1;
        setStations([...stations, {
            id: newId,
            name: `Station ${newId}`,
            tasks: []
        }]);
    };

    const handleRemoveStation = (id) => {
        setStations(stations.filter(s => s.id !== id));
    };

    const handleUpdateStationName = (id, newName) => {
        setStations(stations.map(s => s.id === id ? { ...s, name: newName } : s));
    };

    const handleAddTask = (stationId) => {
        setStations(stations.map(s => {
            if (s.id === stationId) {
                const newTaskId = s.tasks.length > 0 ? Math.max(...s.tasks.map(t => t.id)) + 1 : 1;
                return {
                    ...s,
                    tasks: [...s.tasks, {
                        id: newTaskId,
                        name: `Task ${newTaskId}`,
                        time: 10,
                        unit: 'sec',
                        color: getRandomColor()
                    }]
                };
            }
            return s;
        }));
    };

    const handleRemoveTask = (stationId, taskId) => {
        setStations(stations.map(s => {
            if (s.id === stationId) {
                return { ...s, tasks: s.tasks.filter(t => t.id !== taskId) };
            }
            return s;
        }));
    };

    const handleUpdateTask = (stationId, taskId, field, value) => {
        setStations(stations.map(s => {
            if (s.id === stationId) {
                return {
                    ...s,
                    tasks: s.tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t)
                };
            }
            return s;
        }));
    };

    // Calculate Chart Data
    const chartData = useMemo(() => {
        return stations.map(station => {
            const dataPoint = { name: station.name };
            let totalTime = 0;

            station.tasks.forEach(task => {
                // Convert task time to strictly matched target unit for display consistency
                // If target is min, show task in min. If target is sec, show in sec.
                let displayTime = parseFloat(task.time) || 0;
                
                // Normalization logic:
                // We want to verify against the Target Line.
                // Best approach: Convert EVERYTHING to the TARGET UNIT for the chart.
                
                if (task.unit === 'min' && targetUnit === 'sec') {
                    displayTime *= 60;
                } else if (task.unit === 'sec' && targetUnit === 'min') {
                    displayTime /= 60;
                }
                
                dataPoint[task.id] = displayTime;
                // Store extra metadata for tooltip
                dataPoint[`${task.id}_meta`] = { 
                    name: task.name, 
                    originalTime: task.time, 
                    originalUnit: task.unit 
                };
                
                totalTime += displayTime;
            });
            
            dataPoint.totalTime = totalTime;
            return dataPoint;
        });
    }, [stations, targetUnit]);

    // Collect all unique tasks to map bars (this ignores individual colors if we strictly use task IDs, 
    // so we will iterate through all possible tasks across all stations to build the stack)
    // However, Recharts needs consistent keys.
    // Since tasks are dynamic per station, we can't easily perform a standard "Stack per Task Name" if names overlap or differ.
    // Trick: We'll render a Bar for every single Task ID found in the current dataset. 
    // Since Task IDs are unique per station (but maybe not globally if simple increment), 
    // let's ensure we use a composite key or just iterate carefully.
    
    // Better approach for dynamic stacks:
    // We need to render <Bar dataKey="task_unique_id" stackId="a" ... />
    // The previous chartData map used `task.id`. If multiple stations have "task 1", they might conflict if we want them distinct or same color.
    // Requirement says "Sub tasks". Usually specific to that station.
    // We will generate a list of all bars we need to render.
    
    const allTaskBars = useMemo(() => {
        const bars = [];
        stations.forEach(station => {
            station.tasks.forEach(task => {
                 // We use task.id, but since multiple stations might have "Task 1" (id 101 vs 101), 
                 // we must assume IDs might collide if we did global counter incorrectly?
                 // Current logic: handleAddTask uses max ID within station. So ID 1 exists in Station 1 and Station 2.
                 // This is bad for Recharts dataKeys if we want them separate.
                 // FIX: We will use a composite key in dataPoint: `${station.id}_${task.id}`
                 
                 // WAIT: Recharts expects the same dataKey to be present across data points for comparison? 
                 // No, for a stacked bar of "Just this station's tasks", 
                 // we essentially want to stack unique blocks. 
                 // Since Station A's tasks are NOT Station B's tasks, they don't need to align directly 
                 // unless we really want to compare "Walking Time" across all stations.
                 // Requirement: "Each station has sub tasks".
                 
                 // If we simply want to stack them, we can add them to the `bars` array.
                 // But Recharts requires defining the `<Bar />` components statically or mapping them.
                 // If we have 100 tasks, we'd need 100 Bar components? That's performance heavy.
                 
                 // ALTERNATIVE: Use only a few "Slots" (Task 1, Task 2...) if user strictly orders them?
                 // No, user might delete Task 2 and keep Task 3.
                 
                 // Let's use the unique key approach for now.
                 // We will simply collect ALL unique composite IDs `${station.id}_${task.id}` 
                 // and render a Bar for each. It's the most robust way for arbitrary tasks.
                 
                 bars.push({
                     dataKey: `${station.id}_${task.id}`,
                     color: task.color,
                     name: task.name
                 });
            });
        });
        return bars;
    }, [stations]);
    
    // Re-map chartData to use composite keys
    const robustChartData = useMemo(() => {
         return stations.map(station => {
            const dataPoint = { name: station.name };
            let totalTime = 0;
            
            station.tasks.forEach(task => {
                let displayTime = parseFloat(task.time) || 0;
                
                if (task.unit === 'min' && targetUnit === 'sec') {
                    displayTime *= 60;
                } else if (task.unit === 'sec' && targetUnit === 'min') {
                    displayTime /= 60;
                }
                
                const key = `${station.id}_${task.id}`;
                dataPoint[key] = displayTime;
                dataPoint[`${key}_meta`] = { 
                    name: task.name, 
                    val: displayTime
                };
                totalTime += displayTime;
            });
            
            dataPoint.total = totalTime;
            return dataPoint;
         });
    }, [stations, targetUnit]);

// ... inside LineBalancing component ...

    return (
        <Box sx={{ width: '100%', px: { xs: 2, md: 4 }, pb: 4 }}>
            
            {/* Control Header */}
            <Paper 
                elevation={0}
                sx={{ 
                    p: 3, 
                    mb: 4,
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    bgcolor: 'rgba(30, 41, 59, 0.4)', 
                    backdropFilter: 'blur(12px)',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    gap: 3
                }}
            >
                <Box>
                    <Typography variant="h5" fontWeight="bold" color="white" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Activity className="text-blue-400" />
                        Line Balancing Analysis
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                         Manage stations, tasks, and optimize cycle time.
                    </Typography>
                </Box>
                
                <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', p: 1, borderRadius: 2 }}>
                         <Clock size={20} className="text-orange-400" />
                         <TextField 
                            label="Target Cycle Time"
                            type="number"
                            size="small"
                            value={targetTime}
                            onChange={(e) => setTargetTime(parseFloat(e.target.value) || 0)}
                            sx={{ width: 100 }}
                            InputProps={{ sx: { color: 'white' } }}
                            InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                         />
                         <Select
                            value={targetUnit}
                            onChange={(e) => setTargetUnit(e.target.value)}
                            size="small"
                            sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.3)', minWidth: 80 }}
                         >
                             <MenuItem value="sec">Sec</MenuItem>
                             <MenuItem value="min">Min</MenuItem>
                         </Select>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        onClick={handleAddStation}
                        sx={{
                            background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            px: 3
                        }}
                    >
                        Add Station / Person
                    </Button>
                </Stack>
            </Paper>

            <Grid container spacing={4}>
                {/* LEFT: Station Manager (Scrollable List) */}
                <Grid item size={{ xs: 12, md: 5 }}>
                    <Typography variant="h6" fontWeight="bold" color="white" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Users size={20} className="text-purple-400" />
                        Stations & Tasks
                    </Typography>
                    <Box sx={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', pr: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {stations.map((station) => (
                            <Accordion 
                                key={station.id} 
                                defaultExpanded 
                                sx={{ 
                                    bgcolor: 'rgba(30, 41, 59, 0.6)', 
                                    color: 'white',
                                    borderRadius: '12px !important',
                                    '&:before': { display: 'none' },
                                    border: '1px solid rgba(255, 255, 255, 0.05)'
                                }}
                            >
                                <AccordionSummary expandIcon={<ChevronDown color="white" />} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2, pr: 2 }}>
                                        <TextField 
                                            value={station.name}
                                            onChange={(e) => handleUpdateStationName(station.id, e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            variant="outlined"
                                            size="small"
                                            inputProps={{ 
                                                style: { fontWeight: 'bold', fontSize: '1rem', color: '#e2e8f0' } 
                                            }}
                                            sx={{ 
                                                flexGrow: 1, 
                                                bgcolor: 'rgba(0, 0, 0, 0.2)', // Dark semi-transparent
                                                borderRadius: 1,
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(255, 255, 255, 0.1)'
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(255, 255, 255, 0.3)'
                                                },
                                                '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#60a5fa' // Blue focus
                                                }
                                            }}
                                        />
                                        <Typography variant="caption" sx={{ color: 'text.secondary', bgcolor: 'rgba(0,0,0,0.2)', px: 1, borderRadius: 1 }}>
                                            {station.tasks.reduce((acc, t) => {
                                                // Quick sum for display
                                                let tVal = parseFloat(t.time) || 0;
                                                if(t.unit !== targetUnit) {
                                                    tVal = t.unit === 'min' ? tVal * 60 : tVal / 60;
                                                }
                                                return acc + tVal;
                                            }, 0).toFixed(1)} {targetUnit}
                                        </Typography>
                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleRemoveStation(station.id); }} sx={{ color: '#ef4444' }}>
                                            <Trash2 size={16} />
                                        </IconButton>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 2 }}>
                                    <Stack spacing={2}>
                                        {station.tasks.map((task) => (
                                            <Paper key={task.id} elevation={0} sx={{ p: 1.5, bgcolor: 'rgba(0, 0, 0, 0.2)', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: task.color }} />
                                                <TextField 
                                                    value={task.name}
                                                    onChange={(e) => handleUpdateTask(station.id, task.id, 'name', e.target.value)}
                                                    size="small"
                                                    variant="outlined"
                                                    inputProps={{ 
                                                        style: { fontSize: '0.9rem', color: '#e2e8f0', padding: '6px 10px' } 
                                                    }}
                                                    sx={{ 
                                                        flexGrow: 1, 
                                                        bgcolor: 'rgba(0, 0, 0, 0.2)', 
                                                        borderRadius: 1,
                                                        '& .MuiOutlinedInput-notchedOutline': { 
                                                            borderColor: 'rgba(255, 255, 255, 0.1)' 
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'rgba(255, 255, 255, 0.3)'
                                                        },
                                                        '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#60a5fa'
                                                        }
                                                    }}
                                                />
                                                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                                                <TextField 
                                                    type="number"
                                                    value={task.time}
                                                    onChange={(e) => handleUpdateTask(station.id, task.id, 'time', e.target.value)}
                                                    size="small"
                                                    variant="outlined"
                                                    inputProps={{ 
                                                        style: { fontSize: '0.9rem', textAlign: 'right', color: '#e2e8f0', padding: '6px 10px' } 
                                                    }}
                                                    sx={{ 
                                                        width: 80, 
                                                        bgcolor: 'rgba(0, 0, 0, 0.2)', 
                                                        borderRadius: 1,
                                                        '& .MuiOutlinedInput-notchedOutline': { 
                                                            borderColor: 'rgba(255, 255, 255, 0.1)' 
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'rgba(255, 255, 255, 0.3)'
                                                        },
                                                        '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#60a5fa'
                                                        }
                                                    }}
                                                />
                                                <Select
                                                    value={task.unit}
                                                    onChange={(e) => handleUpdateTask(station.id, task.id, 'unit', e.target.value)}
                                                    variant="standard"
                                                    disableUnderline
                                                    sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
                                                >
                                                    <MenuItem value="sec">s</MenuItem>
                                                    <MenuItem value="min">m</MenuItem>
                                                </Select>
                                                <IconButton size="small" onClick={() => handleRemoveTask(station.id, task.id)} sx={{ color: 'text.disabled', '&:hover': { color: '#ef4444' } }}>
                                                    <Trash2 size={14} />
                                                </IconButton>
                                            </Paper>
                                        ))}
                                        <Button 
                                            startIcon={<Plus size={16} />} 
                                            fullWidth 
                                            variant="outlined" 
                                            size="small"
                                            onClick={() => handleAddTask(station.id)}
                                            sx={{ 
                                                borderStyle: 'dashed', 
                                                borderColor: 'rgba(255, 255, 255, 0.2)', 
                                                color: 'text.secondary',
                                                '&:hover': { borderColor: 'rgba(255, 255, 255, 0.4)', color: 'white' }
                                            }}
                                        >
                                            Add Task
                                        </Button>
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                        {stations.length === 0 && (
                            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 3 }}>
                                No stations added. Click "Add Station" to start.
                            </Box>
                        )}
                    </Box>
                </Grid>

                {/* RIGHT: Visual Chart */}
                <Grid item size={{ xs: 12, md: 7 }}>
                    <Typography variant="h6" fontWeight="bold" color="white" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BarChart3 size={20} className="text-green-400" />
                        Cycle Time Visualization ({targetUnit})
                    </Typography>
                    <Paper 
                        elevation={0}
                        sx={{ 
                            p: 3, 
                            bgcolor: 'rgba(30, 41, 59, 0.4)', 
                            backdropFilter: 'blur(12px)',
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            height: 500
                        }}
                    >
                        <ResponsiveContainer width="100%" height="100%">

                            <BarChart data={robustChartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#94a3b8" 
                                    tick={{ fill: '#94a3b8', fontSize: 12, dy: 10 }} 
                                    interval={0}
                                    angle={-45}
                                    textAnchor="end"
                                />
                                <YAxis 
                                    stroke="#94a3b8" 
                                    tick={{ fill: '#94a3b8' }} 
                                    label={{ value: `Time (${targetUnit})`, angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                                />
                                <RechartsTooltip 
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <Box sx={{ bgcolor: '#1e293b', p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                                                    <Typography variant="subtitle2" color="white" mb={1}>{data.name}</Typography>
                                                    <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                                                    {payload.map((entry, idx) => {
                                                        const key = entry.dataKey;
                                                        const meta = data[`${key}_meta`];
                                                        if (!meta) return null;
                                                        return (
                                                            <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, mb: 0.5, color: entry.color }}>
                                                                <Typography variant="caption" fontWeight="bold">{meta.name}</Typography>
                                                                <Typography variant="caption">{entry.value.toFixed(2)} {targetUnit}</Typography>
                                                            </Box>
                                                        );
                                                    })}
                                                    <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, color: 'white' }}>
                                                        <Typography variant="caption" fontWeight="bold">Total</Typography>
                                                        <Typography variant="caption" fontWeight="bold">{data.total.toFixed(2)} {targetUnit}</Typography>
                                                    </Box>
                                                </Box>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <ReferenceLine y={targetTime} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Target', fill: '#ef4444', position: 'insideTopLeft' }} />
                                
                                {allTaskBars.map((barDef) => (
                                    <Bar 
                                        key={barDef.dataKey}
                                        dataKey={barDef.dataKey}
                                        stackId="a"
                                        fill={barDef.color}
                                        isAnimationActive={false}
                                        name={barDef.name}
                                        label={<CustomBarLabel name={barDef.name} />}
                                    />
                                ))}

                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LineBalancing;

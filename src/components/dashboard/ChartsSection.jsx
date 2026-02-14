import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Label,
  PieChart, Pie, Cell, Legend,
  LineChart, Line
} from 'recharts';
import { ListFilter, RotateCcw, TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { Card, CardContent, Grid, Typography, Box, Select, MenuItem, IconButton, Tooltip } from '@mui/material';

const ChartsSection = ({ 
  processedData, 
  topMachineCount, 
  setTopMachineCount, 
  handleBarClick, 
  selectedSerial, 
  setSelectedSerial,
  targetError,
  getMachineName,
  selectedErrorLabel
}) => {
  return (
    <Grid container spacing={3}>
      
      {/* Bar Chart */}
      <Grid item size={{ xs: 12, lg: 8 }} sx={{ width: '100%' }}>
        <Card 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'rgba(30, 41, 59, 0.4)', // slate-800/40
                backdropFilter: 'blur(12px)',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
        >
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'white' }}>
                      <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}>
                        <BarChart3 size={20} />
                      </Box>
                      Top Machines by Error Count
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 5.5, display: 'block' }}>
                      Click a bar to see its proportion in the Pie Chart
                  </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(15, 23, 42, 0.5)', px: 1.5, py: 0.5, borderRadius: 2, border: '1px solid', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <ListFilter size={16} className="text-slate-400"/>
                  <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase' }}>Show:</Typography>
                  <Select
                      value={topMachineCount}
                      onChange={(e) => setTopMachineCount(Number(e.target.value))}
                      variant="standard"
                      disableUnderline
                      sx={{ 
                        color: 'white', 
                        fontSize: '0.875rem', 
                        fontWeight: 'bold',
                        '& .MuiSelect-select': { padding: 0 }
                      }}
                  >
                      <MenuItem value={5}>Top 5</MenuItem>
                      <MenuItem value={10}>Top 10</MenuItem>
                      <MenuItem value={15}>Top 15</MenuItem>
                      <MenuItem value={20}>Top 20</MenuItem>
                      <MenuItem value={50}>Top 50</MenuItem>
                      <MenuItem value={1000} >All</MenuItem>
                  </Select>
              </Box>
            </Box>

            <Box sx={{ flex: 1, minHeight: 400 }}> 
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={processedData.serialCounts.slice(0, topMachineCount)} 
                  layout="vertical" 
                  margin={{ left: 20, right: 30, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false}>
                    <Label value="Count" offset={-10} position="insideBottom" fill="#64748b" style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                  </XAxis>
                  <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" fontSize={12} fontWeight={500} tickLine={false} axisLine={false}>
                      <Label value="Machine" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }} fill="#64748b" />
                  </YAxis>
                  <RechartsTooltip 
                    cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                    contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        borderRadius: '12px', 
                        border: '1px solid rgba(255, 255, 255, 0.1)', 
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        padding: '12px'
                    }}
                    itemStyle={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 500 }}
                  />
                  <Bar 
                      dataKey="count" 
                      radius={[0, 4, 4, 0]} 
                      barSize={20} 
                      isAnimationActive={true}
                      onClick={handleBarClick}
                      cursor="pointer"
                  >
                     {processedData.serialCounts.slice(0, topMachineCount).map((entry, index) => (
                       <Cell 
                         key={`cell-${index}`} 
                         fill={entry.serial === selectedSerial ? '#ec4899' : '#3b82f6'} 
                         stroke={entry.serial === selectedSerial ? 'rgba(255,255,255,0.5)' : 'none'}
                         strokeWidth={2}
                         cursor="pointer"
                         style={{ transition: 'all 0.3s ease' }}
                       />
                     ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Pie Chart */}
      <Grid item size={{ xs: 12, lg: 4 }} sx={{ width: '100%' }}>
        <Card 
            sx={{ 
                height: '100%',
                bgcolor: 'rgba(30, 41, 59, 0.4)', // slate-800/40
                backdropFilter: 'blur(12px)',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
        >
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, color: 'white' }}>
                          <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: selectedSerial ? 'rgba(236, 72, 153, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: selectedSerial ? '#f472b6' : '#fbbf24' }}>
                            <PieChartIcon size={20} />
                          </Box>
                          Error Proportion
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 200, ml: 5.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {selectedSerial 
                           ? `${getMachineName(selectedSerial)} vs Others` 
                           : `Comparing Code ${targetError} vs All Other Errors`}
                      </Typography>
                  </Box>
                  {selectedSerial && (
                      <Tooltip title="Reset Selection">
                          <IconButton 
                              onClick={() => setSelectedSerial(null)}
                              size="small"
                              sx={{ 
                                  bgcolor: 'rgba(255, 255, 255, 0.05)', 
                                  color: 'white',
                                  border: '1px solid',
                                  borderColor: 'rgba(255, 255, 255, 0.1)',
                                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } 
                              }}
                          >
                              <RotateCcw size={16} />
                          </IconButton>
                      </Tooltip>
                  )}
                </Box>
                
                <Box sx={{ flex: 1, minHeight: 300, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={processedData.pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        label={({ percent, value }) => percent > 0 ? `${(percent * 100).toFixed(1)}%` : null}
                        labelLine={{ stroke: '#64748b', strokeWidth: 1 }}
                      >
                        {processedData.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={processedData.pieColors[index % processedData.pieColors.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                         contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                            borderRadius: '12px', 
                            border: '1px solid rgba(255, 255, 255, 0.1)', 
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            padding: '12px'
                         }}
                         itemStyle={{ color: '#e2e8f0', fontWeight: 500 }}
                      />
                      <Legend 
                         verticalAlign="bottom" 
                         height={36} 
                         wrapperStyle={{ color: '#cbd5e1', fontSize: '12px', paddingTop: '20px', fontWeight: 500 }}
                         iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
      </Grid>

      {/* Line Chart */}
      <Grid item size={{ xs: 12 }} sx={{ width: '100%' }}>
        <Card 
            sx={{ 
                height: '100%',
                bgcolor: 'rgba(30, 41, 59, 0.4)', // slate-800/40
                backdropFilter: 'blur(12px)',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'white' }}>
                      <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
                        <TrendingUp size={20} />
                      </Box>
                      Error Trend Over Time
                  </Typography>
                  <Box sx={{ mt: 2, ml: 5.5, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)', px: 1.5, py: 0.5, borderRadius: 1.5, border: '1px solid', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mr: 1, textTransform: 'uppercase', fontWeight: 'bold' }}>Error Code:</Typography>
                          <Typography variant="body2" component="span" fontWeight="bold" sx={{ color: '#34d399' }}>
                              {selectedErrorLabel}
                          </Typography>
                      </Box>
                      <Box sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)', px: 1.5, py: 0.5, borderRadius: 1.5, border: '1px solid', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mr: 1, textTransform: 'uppercase', fontWeight: 'bold' }}>Machine:</Typography>
                          <Typography variant="body2" component="span" fontWeight="bold" sx={{ color: '#60a5fa' }}>
                              {selectedSerial ? getMachineName(selectedSerial) : 'All Machines'}
                          </Typography>
                      </Box>
                  </Box>
                </Box>

                <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={processedData.lineChartData}
                            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                stroke="#94a3b8" 
                                fontSize={12} 
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: '#94a3b8' }}
                                dy={10}
                            />
                            <YAxis 
                                stroke="#94a3b8" 
                                fontSize={12} 
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: '#94a3b8' }}
                                dx={-10}
                            >
                                <Label value="Error Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }} fill="#64748b" />
                            </YAxis>
                            <RechartsTooltip
                                contentStyle={{ 
                                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                                    borderRadius: '12px', 
                                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    padding: '12px'
                                }}
                                itemStyle={{ color: '#e2e8f0', fontWeight: 500 }}
                                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="count" 
                                stroke="#34d399" // emerald-400
                                strokeWidth={3}
                                dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#34d399' }}
                                animationDuration={1000}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ChartsSection;

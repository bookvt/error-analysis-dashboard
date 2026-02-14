import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Label,
  PieChart, Pie, Cell, Legend,
  LineChart, Line
} from 'recharts';
import { ListFilter, RotateCcw, TrendingUp } from 'lucide-react';
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
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box component="span" sx={{ width: 4, height: 24, bgcolor: 'primary.main', borderRadius: 1 }} />
                      Top Machines by Error Count
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 2, display: 'block', mt: 0.5 }}>
                      Click a bar to see its proportion in the Pie Chart
                  </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(51, 65, 85, 0.5)', px: 1.5, py: 0.5, borderRadius: 2, border: 1, borderColor: 'divider' }}>
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
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12}>
                    <Label value="Count" offset={-10} position="insideBottom" fill="#94a3b8" />
                  </XAxis>
                  <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" fontSize={12} fontWeight={500}>
                      <Label value="Machine" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="#94a3b8" />
                  </YAxis>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{fill: '#334155', opacity: 0.4}}
                  />
                  <Bar 
                      dataKey="count" 
                      radius={[0, 4, 4, 0]} 
                      barSize={24} 
                      isAnimationActive={true}
                      onClick={handleBarClick}
                      cursor="pointer"
                  >
                     {processedData.serialCounts.slice(0, topMachineCount).map((entry, index) => (
                       <Cell 
                         key={`cell-${index}`} 
                         fill={entry.serial === selectedSerial ? '#ec4899' : '#3b82f6'} 
                         stroke={entry.serial === selectedSerial ? '#fff' : 'none'}
                         strokeWidth={2}
                         cursor="pointer"
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
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Box component="span" sx={{ width: 4, height: 24, borderRadius: 1, bgcolor: selectedSerial ? 'secondary.main' : 'warning.main', transition: 'background-color 0.3s' }} />
                          Error Proportion
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                              sx={{ bgcolor: 'rgba(51, 65, 85, 0.5)', '&:hover': { bgcolor: 'rgba(51, 65, 85, 0.7)' } }}
                          >
                              <RotateCcw size={16} className="text-slate-300" />
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
                        labelLine={true}
                      >
                        {processedData.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={processedData.pieColors[index % processedData.pieColors.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                         contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', color: '#fff' }}
                         itemStyle={{ color: '#fff' }}
                      />
                      <Legend 
                         verticalAlign="bottom" 
                         height={36} 
                         wrapperStyle={{ color: '#cbd5e1', fontSize: '11px', paddingTop: '20px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
      </Grid>

      {/* Line Chart */}
      <Grid item size={{ xs: 12 }} sx={{ width: '100%' }}>
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box component="span" sx={{ width: 4, height: 24, bgcolor: 'success.main', borderRadius: 1 }} />
                      <TrendingUp size={20} className="text-green-500"/>
                      Error Trend Over Time
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Box sx={{ bgcolor: 'rgba(51, 65, 85, 0.5)', px: 1.5, py: 0.5, borderRadius: 1, border: 1, borderColor: 'divider' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>Error Code:</Typography>
                          <Typography variant="body2" component="span" fontWeight="bold" color="secondary.main">
                              {selectedErrorLabel}
                          </Typography>
                      </Box>
                      <Box sx={{ bgcolor: 'rgba(51, 65, 85, 0.5)', px: 1.5, py: 0.5, borderRadius: 1, border: 1, borderColor: 'divider' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>Machine:</Typography>
                          <Typography variant="body2" component="span" fontWeight="bold" color="primary.main">
                              {selectedSerial ? getMachineName(selectedSerial) : 'All Machines'}
                          </Typography>
                      </Box>
                  </Box>
                </Box>

                <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={processedData.lineChartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                stroke="#94a3b8" 
                                fontSize={12} 
                                tick={{ fill: '#94a3b8' }}
                            />
                            <YAxis 
                                stroke="#94a3b8" 
                                fontSize={12} 
                                tick={{ fill: '#94a3b8' }}
                            >
                                <Label value="Error Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="#94a3b8" />
                            </YAxis>
                            <RechartsTooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="count" 
                                stroke="#10b981" // emerald-500
                                strokeWidth={3}
                                dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
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

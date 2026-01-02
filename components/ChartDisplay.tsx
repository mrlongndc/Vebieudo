
import React, { useMemo } from 'react';
import { DataPoint, ChartSettings } from '../types';

interface ChartDisplayProps {
  data: DataPoint[];
  settings: ChartSettings;
}

export const ChartDisplay: React.FC<ChartDisplayProps> = ({ data, settings }) => {
  // Increased right margin to 400 to ensure X-axis name is fully visible
  const margin = { top: 180, right: 400, bottom: 300, left: 240 };
  const width = 2400;
  const height = 1500;
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const validData = useMemo(() => {
    return data.filter(d => d.label.trim() !== '' || (typeof d.value1 === 'number' && d.value1 > 0));
  }, [data]);

  const maxVal = useMemo(() => {
    let m = 10;
    validData.forEach(d => {
      if (typeof d.value1 === 'number') m = Math.max(m, d.value1);
      if (settings.chartType === 'double' && typeof d.value2 === 'number') m = Math.max(m, d.value2);
    });
    return Math.ceil(m * 1.1); // Add 10% headroom
  }, [validData, settings.chartType]);

  const yTicks = useMemo(() => {
    const ticks = [];
    const count = 5;
    const step = maxVal / count;
    for (let i = 0; i <= count; i++) {
      ticks.push(Math.round(i * step));
    }
    return ticks;
  }, [maxVal]);

  const getY = (val: number | '') => {
    if (typeof val !== 'number') return chartHeight;
    return chartHeight - (val / maxVal) * chartHeight;
  };

  const getX = (index: number) => {
    const sectionWidth = chartWidth / (validData.length || 1);
    return index * sectionWidth + sectionWidth / 2;
  };

  const barWidth = useMemo(() => {
    if (validData.length === 0) return 120; // 40 * 3
    const sectionWidth = chartWidth / validData.length;
    return sectionWidth * 0.6;
  }, [validData, chartWidth]);

  // Helper to determine if a color is light (specifically white) to choose pattern contrast
  const isWhite = (color: string) => color.toLowerCase() === '#ffffff';

  // Border color for all bars
  const strokeColor = "#475569";
  const strokeWidth = "4";

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title */}
      <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-10 text-center">{settings.title}</h2>

      <div className="relative overflow-visible w-full">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto drop-shadow-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Define Patterns */}
          <defs>
            {/* White patterns (for colored bars) */}
            <pattern id="stripe-45" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
              <rect width="40" height="40" fill="transparent" />
              <line x1="0" y1="0" x2="0" y2="40" stroke="white" strokeWidth="15" opacity="0.4" />
            </pattern>
            <pattern id="stripe-135" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(-45)">
              <rect width="40" height="40" fill="transparent" />
              <line x1="0" y1="0" x2="0" y2="40" stroke="white" strokeWidth="15" opacity="0.4" />
            </pattern>
            <pattern id="dots" patternUnits="userSpaceOnUse" width="30" height="30">
              <rect width="30" height="30" fill="transparent" />
              <circle cx="15" cy="15" r="7" fill="white" opacity="0.4" />
            </pattern>
            <pattern id="grid" patternUnits="userSpaceOnUse" width="40" height="40">
              <rect width="40" height="40" fill="transparent" />
              <line x1="0" y1="0" x2="40" y2="0" stroke="white" strokeWidth="8" opacity="0.4" />
              <line x1="0" y1="0" x2="0" y2="40" stroke="white" strokeWidth="8" opacity="0.4" />
            </pattern>

            {/* Dark patterns (for white bars) */}
            <pattern id="stripe-45-dark" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
              <rect width="40" height="40" fill="transparent" />
              <line x1="0" y1="0" x2="0" y2="40" stroke="#475569" strokeWidth="15" opacity="0.2" />
            </pattern>
            <pattern id="stripe-135-dark" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(-45)">
              <rect width="40" height="40" fill="transparent" />
              <line x1="0" y1="0" x2="0" y2="40" stroke="#475569" strokeWidth="15" opacity="0.2" />
            </pattern>
            <pattern id="dots-dark" patternUnits="userSpaceOnUse" width="30" height="30">
              <rect width="30" height="30" fill="transparent" />
              <circle cx="15" cy="15" r="7" fill="#475569" opacity="0.2" />
            </pattern>
            <pattern id="grid-dark" patternUnits="userSpaceOnUse" width="40" height="40">
              <rect width="40" height="40" fill="transparent" />
              <line x1="0" y1="0" x2="40" y2="0" stroke="#475569" strokeWidth="8" opacity="0.2" />
              <line x1="0" y1="0" x2="0" y2="40" stroke="#475569" strokeWidth="8" opacity="0.2" />
            </pattern>
            
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
            </marker>
          </defs>

          {/* Grid lines */}
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {yTicks.map((tick, i) => (
              <g key={i} transform={`translate(0, ${getY(tick)})`}>
                <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#f1f5f9" strokeWidth="3" />
                <text x="-30" y="15" textAnchor="end" className="fill-slate-500 font-medium" style={{ fontSize: '36px' }}>{tick}</text>
              </g>
            ))}
          </g>

          {/* Axes */}
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Y Axis */}
            <line x1="0" y1={chartHeight} x2="0" y2="-60" stroke="#475569" strokeWidth="6" markerEnd="url(#arrow)" />
            <text 
              x="-45" 
              y="-100" 
              className="font-semibold fill-slate-700 italic" 
              textAnchor="middle"
              style={{ fontSize: '42px' }}
            >
              {settings.yAxisName}
            </text>

            {/* X Axis */}
            <line x1="0" y1={chartHeight} x2={chartWidth + 90} y2={chartHeight} stroke="#475569" strokeWidth="6" markerEnd="url(#arrow)" />
            <text 
              x={chartWidth + 120} 
              y={chartHeight + 15} 
              className="font-semibold fill-slate-700 italic" 
              textAnchor="start"
              style={{ fontSize: '42px' }}
            >
              {settings.xAxisName}
            </text>

            {/* Bars */}
            {validData.map((d, i) => {
              const xCenter = getX(i);
              
              if (settings.chartType === 'single') {
                const h = typeof d.value1 === 'number' ? (d.value1 / maxVal) * chartHeight : 0;
                const patternId = isWhite(settings.color1) ? `${settings.pattern1}-dark` : settings.pattern1;

                return (
                  <g key={d.id}>
                    <rect 
                      x={xCenter - barWidth / 2} 
                      y={chartHeight - h} 
                      width={barWidth} 
                      height={h} 
                      fill={settings.color1}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      rx="12"
                    />
                    {settings.pattern1 !== 'none' && (
                      <rect 
                        x={xCenter - barWidth / 2} 
                        y={chartHeight - h} 
                        width={barWidth} 
                        height={h} 
                        fill={`url(#${patternId})`}
                        rx="12"
                        pointerEvents="none"
                      />
                    )}
                    {settings.showLabels && typeof d.value1 === 'number' && (
                      <text 
                        x={xCenter} 
                        y={chartHeight - h - 24} 
                        textAnchor="middle" 
                        className="font-bold fill-slate-600"
                        style={{ fontSize: '36px' }}
                      >
                        {d.value1}
                      </text>
                    )}
                    <text 
                      x={xCenter} 
                      y={chartHeight + 75} 
                      textAnchor="middle" 
                      className="font-semibold fill-slate-600"
                      style={{ fontSize: '36px' }}
                    >
                      {d.label}
                    </text>
                  </g>
                );
              } else {
                // Double bar
                const h1 = typeof d.value1 === 'number' ? (d.value1 / maxVal) * chartHeight : 0;
                const h2 = typeof d.value2 === 'number' ? (d.value2 / maxVal) * chartHeight : 0;
                const halfBar = barWidth / 2;
                const gap = 6;
                const p1Id = isWhite(settings.color1) ? `${settings.pattern1}-dark` : settings.pattern1;
                const p2Id = isWhite(settings.color2) ? `${settings.pattern2}-dark` : settings.pattern2;

                return (
                  <g key={d.id}>
                    {/* Bar 1 */}
                    <rect 
                      x={xCenter - halfBar - gap} 
                      y={chartHeight - h1} 
                      width={halfBar} 
                      height={h1} 
                      fill={settings.color1}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      rx="6"
                    />
                    {settings.pattern1 !== 'none' && (
                      <rect 
                        x={xCenter - halfBar - gap} 
                        y={chartHeight - h1} 
                        width={halfBar} 
                        height={h1} 
                        fill={`url(#${p1Id})`}
                        rx="6"
                        pointerEvents="none"
                      />
                    )}
                    {settings.showLabels && typeof d.value1 === 'number' && (
                      <text x={xCenter - halfBar/2 - gap} y={chartHeight - h1 - 24} textAnchor="middle" className="font-bold fill-slate-500" style={{ fontSize: '30px' }}>{d.value1}</text>
                    )}

                    {/* Bar 2 */}
                    <rect 
                      x={xCenter + gap} 
                      y={chartHeight - h2} 
                      width={halfBar} 
                      height={h2} 
                      fill={settings.color2}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      rx="6"
                    />
                    {settings.pattern2 !== 'none' && (
                      <rect 
                        x={xCenter + gap} 
                        y={chartHeight - h2} 
                        width={halfBar} 
                        height={h2} 
                        fill={`url(#${p2Id})`}
                        rx="6"
                        pointerEvents="none"
                      />
                    )}
                    {settings.showLabels && typeof d.value2 === 'number' && (
                      <text x={xCenter + halfBar/2 + gap} y={chartHeight - h2 - 24} textAnchor="middle" className="font-bold fill-slate-500" style={{ fontSize: '30px' }}>{d.value2}</text>
                    )}

                    <text 
                      x={xCenter} 
                      y={chartHeight + 75} 
                      textAnchor="middle" 
                      className="font-semibold fill-slate-600"
                      style={{ fontSize: '36px' }}
                    >
                      {d.label}
                    </text>
                  </g>
                );
              }
            })}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-12 flex flex-wrap justify-center gap-16 px-10 py-6 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-md shadow-sm relative overflow-hidden border border-slate-500" style={{ backgroundColor: settings.color1 }}>
            {settings.pattern1 !== 'none' && (
               <div className="absolute inset-0" style={{ 
                 backgroundImage: settings.pattern1 === 'stripe-45' ? `linear-gradient(45deg, ${isWhite(settings.color1) ? 'rgba(100,100,100,.2)' : 'rgba(255,255,255,.3)'} 25%, transparent 25%, transparent 50%, ${isWhite(settings.color1) ? 'rgba(100,100,100,.2)' : 'rgba(255,255,255,.3)'} 50%, ${isWhite(settings.color1) ? 'rgba(100,100,100,.2)' : 'rgba(255,255,255,.3)'} 75%, transparent 75%, transparent)` :
                                  settings.pattern1 === 'stripe-135' ? `linear-gradient(-45deg, ${isWhite(settings.color1) ? 'rgba(100,100,100,.2)' : 'rgba(255,255,255,.3)'} 25%, transparent 25%, transparent 50%, ${isWhite(settings.color1) ? 'rgba(100,100,100,.2)' : 'rgba(255,255,255,.3)'} 50%, ${isWhite(settings.color1) ? 'rgba(100,100,100,.2)' : 'rgba(255,255,255,.3)'} 75%, transparent 75%, transparent)` :
                                  settings.pattern1 === 'dots' ? `radial-gradient(${isWhite(settings.color1) ? 'rgba(100,100,100,.3)' : 'rgba(255,255,255,.4)'} 20%, transparent 20%)` :
                                  `linear-gradient(${isWhite(settings.color1) ? 'rgba(100,100,100,.2)' : 'rgba(255,255,255,.3)'} 1px, transparent 1px), linear-gradient(90deg, ${isWhite(settings.color1) ? 'rgba(100,100,100,.2)' : 'rgba(255,255,255,.3)'} 1px, transparent 1px)`,
                 backgroundSize: '10px 10px'
               }}></div>
            )}
          </div>
          <span className="text-xl font-medium text-slate-700">Giá trị 1</span>
        </div>
        {settings.chartType === 'double' && (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-md shadow-sm relative overflow-hidden border border-slate-500" style={{ backgroundColor: settings.color2 }}>
              {settings.pattern2 !== 'none' && (
                <div className="absolute inset-0" style={{ 
                  backgroundImage: settings.pattern2 === 'stripe-45' ? `linear-gradient(45deg, ${isWhite(settings.color2) ? 'rgba(100,100,100,.2)' : 'rgba(255,255,255,.3)'} 25%, transparent 25%, transparent 50%, ${isWhite(settings.color2) ? 'rgba(100,100,100,.2)' : 'rgba(255,255,255,.3)'} 50%, ${isWhite(settings.color2) ? 'rgba(100,100,100,.2)' : 'rgba(255,255,255,.3)'} 75%, transparent 75%, transparent)` :
                                   settings.pattern2 === 'stripe-135' ? `linear-gradient(-45deg, ${isWhite(settings.color2) ? 'rgba(100,100,100,.2)' : 'rgba(255,255,255,.3)'} 25%, transparent 25%, transparent 50%, ${isWhite(settings.color2) ? 'rgba(100,100,100,.2)' : 'rgba(255,255,255,.3)'} 50%, ${isWhite(settings.color2) ? 'rgba(100,100,100,.2)' : 'rgba(255,255,255,.3)'} 75%, transparent 75%, transparent)` :
                                   settings.pattern2 === 'dots' ? `radial-gradient(${isWhite(settings.color2) ? 'rgba(100,100,100,.3)' : 'rgba(255,255,255,.4)'} 20%, transparent 20%)` :
                                   `linear-gradient(${isWhite(settings.color2) ? 'rgba(100,100,100,.2)' : 'rgba(255,255,255,.3)'} 1px, transparent 1px), linear-gradient(90deg, ${isWhite(settings.color2) ? 'rgba(100,100,100,.2)' : 'rgba(255,255,255,.3)'} 1px, transparent 1px)`,
                  backgroundSize: '10px 10px'
                }}></div>
              )}
            </div>
            <span className="text-xl font-medium text-slate-700">Giá trị 2</span>
          </div>
        )}
      </div>
    </div>
  );
};

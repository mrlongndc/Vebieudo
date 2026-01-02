
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChartDisplay } from './components/ChartDisplay';
import { DataPoint, ChartSettings, ChartType } from './types';
import { COLORS } from './constants';
import { toPng } from 'html-to-image';

const App: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([
    { id: '1', label: 'Lớp 6', value1: 45, value2: 40 },
    { id: '2', label: 'Lớp 7', value1: 38, value2: 42 },
    { id: '3', label: 'Lớp 8', value1: 50, value2: 48 },
  ]);

  const [settings, setSettings] = useState<ChartSettings>({
    title: 'Biểu đồ số lượng học sinh',
    xAxisName: 'Khối lớp',
    yAxisName: 'Số học sinh',
    chartType: 'double',
    color1: COLORS[0],
    color2: COLORS[1],
    pattern1: 'none',
    pattern2: 'stripe-45',
    showLabels: true,
  });

  const handleDownload = useCallback(() => {
    const node = document.getElementById('chart-container');
    if (!node) return;

    toPng(node, { 
      backgroundColor: '#ffffff',
      quality: 1,
      pixelRatio: 2
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `EduChart-${new Date().getTime()}.png`;
        link.href = dataUrl;
        link.click();
        alert('Tải biểu đồ thành công!');
      })
      .catch((err) => {
        console.error('Download failed', err);
        alert('Đã xảy ra lỗi khi tải ảnh.');
      });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      {/* Sidebar - Control Panel */}
      <aside className="w-full lg:w-96 bg-white border-r border-slate-200 overflow-y-auto h-screen sticky top-0 shadow-sm z-10">
        <Sidebar 
          data={data} 
          setData={setData} 
          settings={settings} 
          setSettings={setSettings} 
          onDownload={handleDownload}
        />
      </aside>

      {/* Main Content - Visualization Area */}
      <main className="flex-1 p-4 lg:p-8 flex flex-col items-center justify-start">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 border border-slate-100 min-h-[600px] flex flex-col overflow-hidden">
          <div id="chart-container" className="flex-1 flex flex-col bg-white overflow-auto p-4">
             <ChartDisplay data={data} settings={settings} />
          </div>
        </div>
        
        <div className="mt-8 text-center text-slate-400 text-sm">
           <p>© 2025 Thầy Nguyễn Thanh Long - Công cụ Toán học thông minh</p>
        </div>
      </main>
    </div>
  );
};

export default App;

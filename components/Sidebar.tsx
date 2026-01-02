
import React from 'react';
import { DataPoint, ChartSettings, PatternType } from '../types';
import { COLORS, PATTERN_OPTIONS } from '../constants';

interface SidebarProps {
  data: DataPoint[];
  setData: React.Dispatch<React.SetStateAction<DataPoint[]>>;
  settings: ChartSettings;
  setSettings: React.Dispatch<React.SetStateAction<ChartSettings>>;
  onDownload: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ data, setData, settings, setSettings, onDownload }) => {
  const updateData = (index: number, field: keyof DataPoint, value: string | number) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    setData(newData);
  };

  const addRow = () => {
    if (data.length < 5) {
      setData([...data, { id: Date.now().toString(), label: '', value1: '', value2: '' }]);
    }
  };

  const removeRow = (index: number) => {
    if (data.length > 1) {
      setData(data.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl">
          📊
        </div>
        <h1 className="text-xl font-bold text-slate-800">EduChart THCS</h1>
      </div>

      {/* Basic Settings */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Thiết lập cơ bản</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề biểu đồ</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Nhập tiêu đề..."
              value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tên trục X</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Trục hoành..."
                value={settings.xAxisName}
                onChange={(e) => setSettings({ ...settings, xAxisName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tên trục Y</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Trục tung..."
                value={settings.yAxisName}
                onChange={(e) => setSettings({ ...settings, yAxisName: e.target.value })}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Data Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Dữ liệu (Tối đa 5)</h2>
          <button 
            onClick={addRow} 
            disabled={data.length >= 5}
            className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 disabled:opacity-50"
          >
            + Thêm dòng
          </button>
        </div>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 relative group">
              <button 
                onClick={() => removeRow(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full border border-red-200 hidden group-hover:flex items-center justify-center text-xs"
              >
                ✕
              </button>
              <div className="grid grid-cols-1 gap-2">
                <input 
                  type="text" 
                  placeholder="Tên cột..."
                  className="w-full px-2 py-1 text-sm border border-slate-300 rounded"
                  value={item.label}
                  onChange={(e) => updateData(index, 'label', e.target.value)}
                />
                <div className={`grid gap-2 ${settings.chartType === 'double' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  <input 
                    type="number" 
                    placeholder="Giá trị 1"
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded"
                    value={item.value1}
                    onChange={(e) => updateData(index, 'value1', e.target.value === '' ? '' : Number(e.target.value))}
                  />
                  {settings.chartType === 'double' && (
                    <input 
                      type="number" 
                      placeholder="Giá trị 2"
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded"
                      value={item.value2}
                      onChange={(e) => updateData(index, 'value2', e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Style & Config */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Tùy chọn hiển thị</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">Kiểu biểu đồ:</span>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="radio" 
                checked={settings.chartType === 'single'} 
                onChange={() => setSettings({...settings, chartType: 'single'})} 
              /> Cột đơn
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="radio" 
                checked={settings.chartType === 'double'} 
                onChange={() => setSettings({...settings, chartType: 'double'})} 
              /> Cột kép
            </label>
          </div>

          <div className="space-y-5">
            {/* Series 1 */}
            <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50">
              <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">Dãy cột 1</span>
              <div className="flex justify-between items-center mb-3">
                <div className="flex flex-wrap gap-1.5">
                  {COLORS.map(c => (
                    <button 
                      key={c} 
                      className={`w-6 h-6 rounded-full border-2 transition-transform active:scale-90 ${settings.color1 === c ? 'border-slate-800' : 'border-slate-200'}`}
                      style={{backgroundColor: c}}
                      onClick={() => setSettings({...settings, color1: c})}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PATTERN_OPTIONS.map(p => (
                  <button
                    key={p.id}
                    title={p.label}
                    onClick={() => setSettings({...settings, pattern1: p.id as PatternType})}
                    className={`px-2 py-1 text-xs border rounded transition-all flex items-center gap-1 ${settings.pattern1 === p.id ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                  >
                    <span>{p.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Series 2 */}
            {settings.chartType === 'double' && (
              <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">Dãy cột 2</span>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {COLORS.map(c => (
                      <button 
                        key={c} 
                        className={`w-6 h-6 rounded-full border-2 transition-transform active:scale-90 ${settings.color2 === c ? 'border-slate-800' : 'border-slate-200'}`}
                        style={{backgroundColor: c}}
                        onClick={() => setSettings({...settings, color2: c})}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PATTERN_OPTIONS.map(p => (
                    <button
                      key={p.id}
                      title={p.label}
                      onClick={() => setSettings({...settings, pattern2: p.id as PatternType})}
                      className={`px-2 py-1 text-xs border rounded transition-all flex items-center gap-1 ${settings.pattern2 === p.id ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}
                    >
                      <span>{p.icon}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded text-blue-600 border-slate-300"
              checked={settings.showLabels} 
              onChange={(e) => setSettings({...settings, showLabels: e.target.checked})} 
            /> Hiển thị nhãn giá trị trên cột
          </label>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="pt-4 sticky bottom-0 bg-white">
        <button 
          onClick={onDownload}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>📥</span> Tải biểu đồ (PNG)
        </button>
      </div>
    </div>
  );
};

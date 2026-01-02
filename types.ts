
export interface DataPoint {
  id: string;
  label: string;
  value1: number | '';
  value2: number | '';
}

export type ChartType = 'single' | 'double';
export type PatternType = 'none' | 'stripe-45' | 'stripe-135' | 'dots' | 'grid';

export interface ChartSettings {
  title: string;
  xAxisName: string;
  yAxisName: string;
  chartType: ChartType;
  color1: string;
  color2: string;
  pattern1: PatternType;
  pattern2: PatternType;
  showLabels: boolean;
}

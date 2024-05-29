import React from 'react';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Chart, registerables} from 'chart.js'; 
import { Line } from 'react-chartjs-2';

Chart.register(...registerables, ChartDataLabels);

export default function LineChartComponent({ data, ...props }) {
  return (
    <Line
      data={data}
      {...props}
    />
  )
};
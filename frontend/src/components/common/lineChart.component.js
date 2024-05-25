import React from 'react';
import { Line } from '@ant-design/charts';

export default function LineChart({ data, xField, yField }) {

  return (
    <Line 
      data={data}
      height={600}
      xField={xField}
      yField={yField}
      point={{
        size: 5,
        shape: 'circle'
      }} 
      tooltip={false}
      
    />
  );
};
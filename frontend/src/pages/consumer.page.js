import React from 'react';
import MainLayout from '../layouts/main.layout';

const consumerContent = <div>
  <h2>Consumer Page</h2>
</div>

export default function ConsumerPage() {
  return (
    <MainLayout pageContent={consumerContent} />
  )
}
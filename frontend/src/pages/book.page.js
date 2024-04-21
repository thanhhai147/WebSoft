import React from 'react';
import MainLayout from '../layouts/main.layout';

const bookContent = <div>
  <h2>Book Page</h2>
</div>

export default function BookPage() {
  return (
    <MainLayout pageContent={bookContent} />
  )
}
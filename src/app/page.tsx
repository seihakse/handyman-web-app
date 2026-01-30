// src/app/page.tsx
import { Suspense } from 'react';
import HomePage from './pages/Home/page';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}
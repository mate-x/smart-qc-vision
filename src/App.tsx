import { Routes, Route, Navigate } from 'react-router-dom';
import { TabBar } from './components/layout/TabBar';
import { GpuWarningBanner } from './components/layout/GpuWarningBanner';
import { useActiveModel } from './hooks/useActiveModel';
import Tab1Realtime from './pages/Tab1Realtime';
import Tab2History from './pages/Tab2History';
import Tab3Model from './pages/Tab3Model';

export default function App() {
  useActiveModel();

  return (
    <>
      <TabBar />
      <GpuWarningBanner />
      <main style={{ flex: 1, padding: '24px' }}>
        <Routes>
          <Route path="/" element={<Tab1Realtime />} />
          <Route path="/history" element={<Tab2History />} />
          <Route path="/models" element={<Tab3Model />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

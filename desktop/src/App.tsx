import { useState } from 'react'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'

export type Page = 'dashboard' | 'devices' | 'display' | 'performance' | 'settings' | 'about';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  return (
    <MainLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'settings' && <Settings />}
      {/* Placeholder for other pages */}
      {['devices', 'display', 'performance', 'about'].includes(currentPage) && (
        <div className="flex h-full items-center justify-center text-muted animate-fade-in">
          <h2 className="text-xl font-medium capitalize">{currentPage} Page (Coming Soon)</h2>
        </div>
      )}
    </MainLayout>
  )
}

export default App

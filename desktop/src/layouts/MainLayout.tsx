import React from 'react';
import TitleBar from '../components/TitleBar';
import Sidebar from '../components/Sidebar';
import { Page } from '../App';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export default function MainLayout({ children, currentPage, setCurrentPage }: MainLayoutProps) {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="p-8 relative z-10 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

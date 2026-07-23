import React from 'react';
import { LayoutDashboard, MonitorSmartphone, Monitor, Activity, Settings, Info } from 'lucide-react';
import { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'devices', label: 'Devices', icon: MonitorSmartphone },
  { id: 'display', label: 'Display', icon: Monitor },
  { id: 'performance', label: 'Performance', icon: Activity },
];

const bottomItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'about', label: 'About', icon: Info },
];

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const NavItem = ({ item }: { item: any }) => {
    const isActive = currentPage === item.id;
    const Icon = item.icon;
    
    return (
      <button
        onClick={() => setCurrentPage(item.id as Page)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-all duration-200 ${
          isActive 
            ? 'bg-primary text-white shadow-soft font-medium' 
            : 'text-muted hover:bg-white/5 hover:text-text'
        }`}
      >
        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-sm">{item.label}</span>
      </button>
    );
  };

  return (
    <aside className="w-64 h-full bg-panel border-r border-border flex flex-col pt-6 pb-4 px-3 relative z-40">
      <nav className="flex-1">
        <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-4 px-4">Menu</div>
        {navItems.map(item => <NavItem key={item.id} item={item} />)}
      </nav>
      
      <div className="pt-4 border-t border-border">
        {bottomItems.map(item => <NavItem key={item.id} item={item} />)}
      </div>
    </aside>
  );
}

import { Minus, Square, X } from 'lucide-react';

export default function TitleBar() {
  const handleMinimize = () => (window as any).ipcRenderer?.minimize();
  const handleMaximize = () => (window as any).ipcRenderer?.maximize();
  const handleClose = () => (window as any).ipcRenderer?.close();

  return (
    <div className="h-10 w-full bg-panel border-b border-border flex items-center justify-between drag-region relative z-50">
      <div className="flex items-center gap-3 px-4">
        {/* App Logo Placeholder */}
        <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center border border-primary/30 text-primary">
          <div className="w-2 h-2 rounded-sm bg-primary animate-pulse-slow"></div>
        </div>
        <span className="text-xs font-medium tracking-wide text-text/80">Horizon Link</span>
      </div>
      
      <div className="flex h-full no-drag-region">
        <button 
          onClick={handleMinimize}
          className="h-full px-4 hover:bg-white/10 text-muted hover:text-text transition-colors flex items-center justify-center"
        >
          <Minus size={14} />
        </button>
        <button 
          onClick={handleMaximize}
          className="h-full px-4 hover:bg-white/10 text-muted hover:text-text transition-colors flex items-center justify-center"
        >
          <Square size={12} />
        </button>
        <button 
          onClick={handleClose}
          className="h-full px-4 hover:bg-danger hover:text-white text-muted transition-colors flex items-center justify-center"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

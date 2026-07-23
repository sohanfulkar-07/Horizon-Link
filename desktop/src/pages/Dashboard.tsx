import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Activity, Battery, Monitor, Signal, Wifi, Usb, Bluetooth } from 'lucide-react';

export default function Dashboard() {
  const [isSharing, setIsSharing] = useState(false);

  return (
    <div className="animate-fade-in flex flex-col gap-6 max-w-6xl mx-auto">
      
      {/* Header section with main controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text tracking-tight">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Manage your active display sessions and devices.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary"
            disabled={!isSharing}
            onClick={() => setIsSharing(false)}
          >
            Stop Sharing
          </Button>
          <Button 
            variant={isSharing ? 'danger' : 'primary'}
            onClick={() => setIsSharing(!isSharing)}
            className="w-40"
          >
            {isSharing ? 'Live - Stop' : 'Start Sharing'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Metrics & Status */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          
          {/* Main Status Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-card to-background border-border/60">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Monitor size={120} />
            </div>
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className={`w-4 h-4 rounded-full ${isSharing ? 'bg-success shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-muted'}`} />
                {isSharing && <div className="absolute inset-0 bg-success rounded-full animate-ping opacity-20" />}
              </div>
              <h2 className="text-xl font-medium">{isSharing ? 'Connected & Streaming' : 'Ready to Connect'}</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-muted text-xs uppercase tracking-wider">Resolution</span>
                <span className="font-semibold text-lg">1920 × 1080</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted text-xs uppercase tracking-wider">Target FPS</span>
                <span className="font-semibold text-lg text-primary">60 FPS</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted text-xs uppercase tracking-wider">Latency</span>
                <span className="font-semibold text-lg text-success">~12ms</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted text-xs uppercase tracking-wider">Type</span>
                <div className="flex items-center gap-1.5 font-semibold text-lg">
                  <Wifi size={18} className="text-primary" />
                  <span>Wi-Fi</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Live Preview Placeholder */}
          <Card title="Live Preview" className="flex-1 min-h-[300px] flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center bg-black/20 rounded-lg border border-dashed border-border/50 m-2 mt-0">
              {isSharing ? (
                <div className="text-center animate-fade-in">
                  <Activity size={48} className="mx-auto text-primary mb-4 animate-pulse-slow" />
                  <p className="text-text font-medium">Capturing Screen 1</p>
                  <p className="text-muted text-sm mt-1">Preview is disabled to save resources.</p>
                </div>
              ) : (
                <div className="text-center text-muted">
                  <Monitor size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Not currently streaming</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Devices & Activity */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          {/* Active Device Card */}
          <Card title="Active Device">
            <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/5">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Monitor size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">iPad Pro (11-inch)</h4>
                <p className="text-xs text-success flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  Connected
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted text-sm">
                  <Battery size={16} />
                  <span>Battery</span>
                </div>
                <span className="font-medium text-sm">84%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted text-sm">
                  <Signal size={16} />
                  <span>Signal Strength</span>
                </div>
                <span className="font-medium text-sm text-success">Excellent</span>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card title="Recent Activity" className="flex-1">
            <div className="flex flex-col gap-4 relative before:absolute before:inset-y-2 before:left-2.5 before:w-px before:bg-border">
              {[
                { time: '10:42 AM', title: 'Device connected', desc: 'iPad Pro joined via Wi-Fi' },
                { time: '09:15 AM', title: 'Session ended', desc: 'Duration: 1h 24m' },
                { time: '07:51 AM', title: 'Session started', desc: 'Display 1 shared to iPad Pro' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4 relative z-10">
                  <div className="w-5 h-5 rounded-full bg-card border-2 border-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-medium">{activity.title}</h5>
                    <p className="text-xs text-muted mt-0.5">{activity.desc}</p>
                    <span className="text-[10px] text-muted/70 mt-1 block">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}

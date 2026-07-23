import React, { useState } from 'react';
import Card from '../components/Card';
import Switch from '../components/Switch';
import Select from '../components/Select';
import Button from '../components/Button';

export default function Settings() {
  const [autoReconnect, setAutoReconnect] = useState(true);
  const [hwAccel, setHwAccel] = useState(true);
  
  return (
    <div className="animate-fade-in flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-text tracking-tight">Settings</h1>
        <p className="text-muted text-sm mt-1">Configure your Horizon Link experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Stream Settings */}
        <Card title="Stream Quality">
          <div className="flex flex-col gap-5">
            <Select 
              label="Resolution" 
              options={[
                { value: '1080p', label: '1920 × 1080 (1080p)' },
                { value: '1440p', label: '2560 × 1440 (1440p)' },
                { value: '4k', label: '3840 × 2160 (4K)' },
              ]}
              defaultValue="1080p"
            />
            
            <Select 
              label="Target Framerate" 
              options={[
                { value: '30', label: '30 FPS' },
                { value: '60', label: '60 FPS (Recommended)' },
                { value: '120', label: '120 FPS' },
              ]}
              defaultValue="60"
            />

            <Select 
              label="Image Quality" 
              options={[
                { value: 'low', label: 'Low (Faster)' },
                { value: 'balanced', label: 'Balanced' },
                { value: 'high', label: 'High (Best Quality)' },
              ]}
              defaultValue="balanced"
            />
          </div>
        </Card>

        {/* System Settings */}
        <Card title="System Preferences">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Auto Reconnect</h4>
                <p className="text-xs text-muted mt-1">Automatically reconnect to known devices</p>
              </div>
              <Switch checked={autoReconnect} onChange={setAutoReconnect} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Hardware Acceleration</h4>
                <p className="text-xs text-muted mt-1">Use GPU for encoding (Requires restart)</p>
              </div>
              <Switch checked={hwAccel} onChange={setHwAccel} />
            </div>

            <Select 
              label="App Theme" 
              options={[
                { value: 'system', label: 'System Default' },
                { value: 'dark', label: 'Dark Mode' },
                { value: 'light', label: 'Light Mode' },
              ]}
              defaultValue="dark"
            />
          </div>
        </Card>

      </div>

      <div className="flex justify-end pt-4 border-t border-border mt-2">
        <div className="flex gap-3">
          <Button variant="secondary">Reset Defaults</Button>
          <Button variant="primary">Save Changes</Button>
        </div>
      </div>

    </div>
  );
}

import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from './AuthContext';

interface SettingsContextType {
  settings: Record<string, any>;
  hasChanges: boolean;
  updateLocalSetting: (key: string, value: any) => void;
  saveChanges: () => Promise<void>;
  isSaving: boolean;
}

const SettingsContext = React.createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const initialData = (window as any).__INITIAL_DATA__;
  const convexSettings = useQuery(api.settings.get);
  const updateSetting = useMutation(api.settings.update);
  
  const [settings, setSettings] = React.useState<Record<string, any>>(initialData?.settings || {});
  
  React.useEffect(() => {
    if (convexSettings) {
      setSettings(convexSettings);
    }
  }, [convexSettings]);

  const [localChanges, setLocalChanges] = React.useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = React.useState(false);

  const updateLocalSetting = (key: string, value: any) => {
    setLocalChanges(prev => ({ ...prev, [key]: value }));
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      for (const [key, value] of Object.entries(localChanges)) {
        await updateSetting({ key, value, token: token || undefined });
      }
      // Revalidate server-side cache
      try {
        await fetch('/api/revalidate', { method: 'POST' });
      } catch (e) {
        console.warn("Failed to revalidate server cache", e);
      }
      setLocalChanges({});
    } catch (error) {
      console.error("Failed to save settings", error);
    } finally {
      setIsSaving(false);
    }
  };

  const mergedSettings = React.useMemo(() => {
    return { ...settings, ...localChanges };
  }, [settings, localChanges]);

  const hasChanges = Object.keys(localChanges).length > 0;

  return (
    <SettingsContext.Provider value={{ 
      settings: mergedSettings, 
      hasChanges, 
      updateLocalSetting, 
      saveChanges,
      isSaving 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
}

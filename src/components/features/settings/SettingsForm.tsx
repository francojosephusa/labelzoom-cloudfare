'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../shared/Button';
import Card from '../../shared/Card';

interface UserSettings {
  font_size: number;
  theme: 'light' | 'dark';
  preferred_language: string;
  accessibility_features: {
    high_contrast?: boolean;
    text_to_speech?: boolean;
  };
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
];

export default function SettingsForm() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings>({
    font_size: 16,
    theme: 'light',
    preferred_language: 'en',
    accessibility_features: {
      high_contrast: false,
      text_to_speech: false,
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch user settings from the database
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/user/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <Card>
        <h2 className="text-2xl font-bold mb-6">Settings</h2>

        <div className="space-y-6">
          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size
            </label>
            <input
              type="range"
              min="12"
              max="24"
              value={settings.font_size}
              onChange={(e) =>
                setSettings({ ...settings, font_size: Number(e.target.value) })
              }
              className="w-full"
            />
            <div className="text-sm text-gray-500 mt-1">
              {settings.font_size}px
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  theme: e.target.value as 'light' | 'dark',
                })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Language
            </label>
            <select
              value={settings.preferred_language}
              onChange={(e) =>
                setSettings({ ...settings, preferred_language: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Accessibility Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accessibility Features
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.accessibility_features.high_contrast}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      accessibility_features: {
                        ...settings.accessibility_features,
                        high_contrast: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-gray-300 text-blue-500 mr-2"
                />
                High Contrast Mode
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.accessibility_features.text_to_speech}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      accessibility_features: {
                        ...settings.accessibility_features,
                        text_to_speech: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-gray-300 text-blue-500 mr-2"
                />
                Text to Speech
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </Card>
    </form>
  );
} 
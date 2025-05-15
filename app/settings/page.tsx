import { auth } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'
import { Button } from '../components/ui/Button'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function SettingsPage() {
  const { userId } = auth()

  if (!userId) {
    return null
  }

  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', userId)
    .single()

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Appearance</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={`p-4 border rounded-lg text-center ${
                      settings?.theme === 'light'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    className={`p-4 border rounded-lg text-center ${
                      settings?.theme === 'dark'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <select
                  defaultValue={settings?.font_size}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Accessibility</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">
                    High Contrast
                  </h3>
                  <p className="text-sm text-gray-500">
                    Increase contrast for better readability
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={settings?.high_contrast}
                  className={`${
                    settings?.high_contrast ? 'bg-primary-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      settings?.high_contrast ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
} 
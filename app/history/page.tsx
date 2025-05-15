import { auth } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'
import { format } from 'date-fns'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function HistoryPage() {
  const { userId } = auth()

  if (!userId) {
    return null
  }

  const { data: scans } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Scan History</h1>

        <div className="space-y-6">
          {scans?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No scans yet</p>
            </div>
          ) : (
            scans?.map((scan) => (
              <div
                key={scan.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {format(new Date(scan.created_at), 'PPP')}
                      </p>
                      <div className="mt-2">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                          {scan.detected_text}
                        </pre>
                      </div>
                    </div>
                    <button
                      className={`ml-4 text-gray-400 hover:text-gray-500 ${
                        scan.is_favorite ? 'text-yellow-400 hover:text-yellow-500' : ''
                      }`}
                    >
                      <svg
                        className="h-6 w-6"
                        fill={scan.is_favorite ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  </div>
                  {scan.image_url && (
                    <div className="mt-4">
                      <img
                        src={scan.image_url}
                        alt="Scanned label"
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 px-6 py-4">
                  <div className="flex justify-end space-x-3">
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      Share
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-900">
                      Download
                    </button>
                    <button className="text-sm text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 
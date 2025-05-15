'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../shared/Card';
import Button from '../../shared/Button';

interface Scan {
  id: string;
  image_url: string;
  text_content: string;
  language: string;
  created_at: string;
}

export default function HistoryList() {
  const router = useRouter();
  const [scans, setScans] = useState<Scan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const response = await fetch('/api/scans');
      if (response.ok) {
        const data = await response.json();
        setScans(data);
      }
    } catch (error) {
      console.error('Error fetching scans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (scanId: string) => {
    try {
      const response = await fetch(`/api/scans/${scanId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setScans(scans.filter(scan => scan.id !== scanId));
        if (selectedScan?.id === scanId) {
          setSelectedScan(null);
        }
      }
    } catch (error) {
      console.error('Error deleting scan:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Scan History</h2>

      {scans.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-gray-500">No scans found. Start scanning labels to build your history!</p>
          <Button
            onClick={() => router.push('/')}
            className="mt-4"
          >
            Start Scanning
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Scans List */}
          <div className="space-y-4">
            {scans.map((scan) => (
              <Card
                key={scan.id}
                className={`cursor-pointer transition-colors ${
                  selectedScan?.id === scan.id
                    ? 'border-2 border-blue-500'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedScan(scan)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500">
                      {formatDate(scan.created_at)}
                    </p>
                    <p className="mt-1 text-sm line-clamp-2">
                      {scan.text_content}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(scan.id);
                    }}
                    className="ml-2 text-gray-400 hover:text-red-500"
                  >
                    🗑️
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Selected Scan Details */}
          <div className="hidden md:block">
            {selectedScan ? (
              <Card className="sticky top-4">
                <img
                  src={selectedScan.image_url}
                  alt="Scanned label"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <p className="text-sm text-gray-500 mb-2">
                  {formatDate(selectedScan.created_at)}
                </p>
                <p className="whitespace-pre-wrap">
                  {selectedScan.text_content}
                </p>
              </Card>
            ) : (
              <Card className="sticky top-4 text-center py-8 text-gray-500">
                Select a scan to view details
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
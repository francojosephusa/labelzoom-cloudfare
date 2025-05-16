import { useState } from 'react';
import { Popover } from '@headlessui/react';
import { InformationCircleIcon, ShieldExclamationIcon, BeakerIcon, CheckBadgeIcon, ScaleIcon } from '@heroicons/react/24/outline';

interface Definition {
  definition: string;
  category: string;
  examples: string[];
  safetyInfo?: string;
  relatedTerms?: string[];
  source: string;
  cached: boolean;
}

interface DefinitionLookupProps {
  text: string;
}

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category.toLowerCase()) {
    case 'ingredient':
      return <BeakerIcon className="h-5 w-5 text-blue-500" />;
    case 'certification':
      return <CheckBadgeIcon className="h-5 w-5 text-green-500" />;
    case 'warning':
      return <ShieldExclamationIcon className="h-5 w-5 text-red-500" />;
    case 'measurement':
      return <ScaleIcon className="h-5 w-5 text-purple-500" />;
    default:
      return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
  }
};

export function DefinitionLookup({ text }: DefinitionLookupProps) {
  const [definition, setDefinition] = useState<Definition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupDefinition = async (term: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/definitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ term }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch definition');
      }

      const data = await response.json();
      setDefinition(data.definition);
    } catch (err) {
      setError('Failed to load definition');
      console.error('Definition lookup error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Split text into words and wrap each in a popover
  const words = text.split(/(\s+)/);

  return (
    <span className="inline">
      {words.map((word, index) => {
        // Skip wrapping whitespace
        if (word.trim() === '') {
          return word;
        }

        return (
          <Popover key={index} className="inline-block relative">
            <Popover.Button className="inline-block text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
              {word}
            </Popover.Button>

            <Popover.Panel className="absolute z-10 w-96 px-4 mt-2 transform -translate-x-1/2 left-1/2">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative bg-white p-4">
                  {loading ? (
                    <p className="text-gray-500">Loading definition...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : definition ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CategoryIcon category={definition.category} />
                        <h3 className="text-sm font-medium text-gray-900">
                          {word} <span className="text-xs text-gray-500">({definition.category})</span>
                        </h3>
                      </div>
                      
                      <p className="text-sm text-gray-600">{definition.definition}</p>
                      
                      {definition.examples && definition.examples.length > 0 && (
                        <div className="text-sm">
                          <p className="font-medium text-gray-700">Common Uses:</p>
                          <ul className="list-disc list-inside text-gray-600 pl-2">
                            {definition.examples.map((example, i) => (
                              <li key={i}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {definition.safetyInfo && (
                        <div className="text-sm bg-yellow-50 p-2 rounded">
                          <p className="font-medium text-yellow-800">Safety Information:</p>
                          <p className="text-yellow-700">{definition.safetyInfo}</p>
                        </div>
                      )}

                      {definition.relatedTerms && definition.relatedTerms.length > 0 && (
                        <div className="text-sm">
                          <p className="font-medium text-gray-700">Related Terms:</p>
                          <p className="text-gray-600">
                            {definition.relatedTerms.join(', ')}
                          </p>
                        </div>
                      )}

                      <div className="text-xs text-gray-400 mt-2">
                        Source: {definition.source} {definition.cached && '(cached)'}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => lookupDefinition(word)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Click to look up definition
                    </button>
                  )}
                </div>
              </div>
            </Popover.Panel>
          </Popover>
        );
      })}
    </span>
  );
} 
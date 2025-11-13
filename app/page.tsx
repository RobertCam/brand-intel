'use client';

import { useState } from 'react';
import { BrandSnapshot, SalesStarterKit } from '@/types';

export default function Home() {
  const [brand, setBrand] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brandSnapshot, setBrandSnapshot] = useState<BrandSnapshot | null>(
    null
  );
  const [salesStarterKit, setSalesStarterKit] =
    useState<SalesStarterKit | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim()) {
      setError('Please enter a brand name');
      return;
    }

    setLoading(true);
    setError(null);
    setBrandSnapshot(null);
    setSalesStarterKit(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brand: brand.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate intelligence');
      }

      const data = await response.json();
      setBrandSnapshot(data.brandSnapshot);
      setSalesStarterKit(data.salesStarterKit);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Brand Intelligence
          </h1>
          <p className="text-lg text-gray-600">
            Generate instant Brand Visibility Snapshots and Sales Starter Kits
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Enter brand name or URL"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Analyzing brand...</p>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {brandSnapshot && salesStarterKit && (
          <div className="space-y-6">
            {/* Brand Visibility Snapshot Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Brand Visibility Snapshot
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    What They Do
                  </h3>
                  <p className="text-gray-600">{brandSnapshot.whatTheyDo}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Category
                  </h3>
                  <p className="text-gray-600">{brandSnapshot.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Primary Offerings
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {brandSnapshot.primaryOfferings.map((offering, idx) => (
                      <li key={idx}>{offering}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Target Segments
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {brandSnapshot.targetSegments.map((segment, idx) => (
                      <li key={idx}>{segment}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Brand Voice
                  </h3>
                  <p className="text-gray-600">{brandSnapshot.brandVoice}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Visibility Opportunities
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {brandSnapshot.visibilityOpportunities.map(
                      (opportunity, idx) => (
                        <li key={idx}>{opportunity}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sales Starter Kit Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Sales Starter Kit
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Primary Buyer Roles
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {salesStarterKit.buyerRoles.map((role, idx) => (
                      <li key={idx}>{role}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Key Pain Points
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {salesStarterKit.painPoints.map((pain, idx) => (
                      <li key={idx}>{pain}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Recommended Value Angles
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {salesStarterKit.valueAngles.map((angle, idx) => (
                      <li key={idx}>{angle}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Cold Email Opener
                  </h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                    {salesStarterKit.coldEmailOpener}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    LinkedIn DM Message
                  </h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                    {salesStarterKit.linkedInDMMessage}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Discovery Questions
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {salesStarterKit.discoveryQuestions.map((question, idx) => (
                      <li key={idx}>{question}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Thought-Leadership Talking Point
                  </h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                    {salesStarterKit.thoughtLeadershipPoint}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


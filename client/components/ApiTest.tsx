import { useState } from 'react';

export default function ApiTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'test message',
          sessionId: null,
          userId: null,
        }),
      });

      const text = await response.text();
      
      setResult(`Status: ${response.status}\nResponse: ${text}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-bold mb-2">API Test (Debug Mode)</h3>
      <button
        onClick={testApi}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
      >
        {loading ? 'Testing...' : 'Test Chat API'}
      </button>
      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
        {result || 'Click to test API'}
      </pre>
    </div>
  );
}

import { useState } from 'react';
import { supabase } from '../lib/supabase';

const SupabaseTest = () => {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState(null);

  const testConnection = async () => {
    setStatus('testing');
    setMessage('Testing connection...');

    try {
      // Test 1: Check if Supabase client is initialized
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      // Test 2: Try to query the table
      const { data, error, count } = await supabase
        .from('rsvp_responses')
        .select('*', { count: 'exact' });

      if (error) {
        throw error;
      }

      // Success!
      setStatus('success');
      setMessage('✅ Connection Successful!');
      setDetails({
        rowCount: count || 0,
        tableExists: true,
        sampleData: data?.slice(0, 3) || [],
      });

      console.log('✅ Supabase connected successfully!');
      console.log('Row count:', count);
      console.log('Sample data:', data);

    } catch (error) {
      setStatus('error');
      setMessage(`❌ Connection Failed: ${error.message}`);
      setDetails(error);

      console.error('❌ Supabase connection failed:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md border-2 border-matcha-light">
        <h3 className="font-heading text-xl font-semibold text-matcha-dark mb-4">
          🧪 Supabase Test
        </h3>

        <button
          onClick={testConnection}
          disabled={status === 'testing'}
          className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all ${
            status === 'testing'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-matcha-primary to-matcha-light hover:shadow-lg'
          }`}
        >
          {status === 'testing' ? 'Testing...' : 'Test Connection'}
        </button>

        {message && (
          <div
            className={`mt-4 p-4 rounded-lg text-sm ${
              status === 'success'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : status === 'error'
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-blue-100 text-blue-800 border border-blue-300'
            }`}
          >
            <p className="font-semibold">{message}</p>

            {status === 'success' && details && (
              <div className="mt-2 text-xs space-y-1">
                <p>• Table: rsvp_responses ✅</p>
                <p>• Total rows: {details.rowCount}</p>
                <p>• Database: Connected ✅</p>
              </div>
            )}

            {status === 'error' && (
              <div className="mt-2 text-xs">
                <p className="font-mono bg-red-50 p-2 rounded mt-1">
                  Check console for details (F12)
                </p>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-4 text-center">
          This component is for testing only
        </p>
      </div>
    </div>
  );
};

export default SupabaseTest;

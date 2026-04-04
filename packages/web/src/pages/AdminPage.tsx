import React, { useState } from 'react';
import useAdminOnlyApi from '../hooks/useAdminOnlyApi';

const AdminPage: React.FC = () => {
  const { getFeedbacksForAdmin } = useAdminOnlyApi();
  const [message, setMessage] = useState<string>('');

  return (
    <div className="px-4 py-6 lg:px-8">
      {/* eslint-disable-next-line @shopify/jsx-no-hardcoded-content */}
      <div className="mb-6 text-center text-xl font-semibold">AdminOnly</div>
      <div className="flex justify-center">
        {/* eslint-disable-next-line @shopify/jsx-no-hardcoded-content */}
        <button
          className="bg-aws-smile rounded px-4 py-2 font-semibold text-white hover:opacity-90"
          onClick={async () => {
            const response = await getFeedbacksForAdmin();
            console.log('Response:', response);
            setMessage(response.message);
          }}>
          Test Invoke
        </button>
      </div>
      <div className="ml-4 p-4 text-center text-lg font-medium">{message}</div>
    </div>
  );
};

export default AdminPage;

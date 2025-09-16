import React, { useState } from 'react';

function LoginTest() {
  const [result, setResult] = useState('');

  const testLogin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'Naresh@mytechz.in',
          password: 'admin123',
          role: 'admin'
        })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={testLogin}>Test Admin Login</button>
      <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '10px' }}>
        {result}
      </pre>
    </div>
  );
}

export default LoginTest;
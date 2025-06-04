import { useState } from 'react';

export default function Auth({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    const url = `/auth/${isLogin ? 'login' : 'register'}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      onAuth(data.token);
    } else {
      alert(data.message || 'Authentication failed');
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-2">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 rounded mb-2 w-full"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 rounded mb-2 w-full"
      />
      <button onClick={submit} className="bg-blue-600 text-white p-2 rounded w-full mb-2">
        {isLogin ? 'Login' : 'Sign Up'}
      </button>
      <button onClick={() => setIsLogin(!isLogin)} className="underline text-sm">
        {isLogin ? 'Need an account?' : 'Have an account? Login'}
      </button>
    </div>
  );
}

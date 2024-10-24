import { useState } from 'react';
import { useRouter } from 'next/router';
import { loginAdmin } from '../../lib/auth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const admin = await loginAdmin(email, password);
      
      if (admin && admin.id) {
        localStorage.setItem('admin', admin.id);
        console.log('Redirigiendo a /admin/dashboard');
        router.push('/admin/dashboard'); // o router.replace('/admin/dashboard');
      } else {
        setErrorMessage('Invalid login response');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Iniciar Sesión - Admin</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

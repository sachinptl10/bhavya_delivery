import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Logged in successfully!');
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full p-8" animate={false}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[var(--color-primary)]">Welcome back</h2>
            <p className="text-gray-500 mt-2">Sign in to manage your shipments.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="Email Address"
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              label="Password"
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="primary" className="w-full py-3" isLoading={loading}>
              Sign In
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/signup" className="text-[var(--color-accent)] hover:underline font-medium">Sign up</Link>
          </p>
        </Card>
      </div>
    </PageTransition>
  );
};

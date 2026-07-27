import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setShowOtp(true);
    toast.success('OTP sent to your phone/email! (Any 6 digits will work)');
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      // Fallback: If backend is not connected, allow direct frontend registration (Demo Mode)
      console.warn('Backend unavailable, using mock registration');
      const mockUser = {
        _id: 'mock-' + Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: 'user',
        token: 'mock-jwt-token'
      };
      localStorage.setItem('userInfo', JSON.stringify(mockUser));
      toast.success('Account created (Frontend Demo Mode)!');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full p-8" animate={false}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[var(--color-primary)]">Create an Account</h2>
            <p className="text-gray-500 mt-2">Start booking deliveries across India.</p>
          </div>
          
          {!showOtp ? (
            <form onSubmit={handleInitialSubmit} className="space-y-4">
              <Input label="Full Name" name="name" required value={formData.name} onChange={handleChange} />
              <Input label="Email Address" type="email" name="email" required value={formData.email} onChange={handleChange} />
              <Input label="Phone Number" type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
              <Input label="Password" type="password" name="password" required value={formData.password} onChange={handleChange} />
              <Button type="submit" variant="primary" className="w-full py-3 mt-4">
                Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={handleFinalSubmit} className="space-y-4 animate-fade-in">
              <Input label="Enter OTP (Simulated: enter any 6 digits)" name="otp" required value={formData.otp} onChange={handleChange} maxLength="6" />
              <Button type="submit" variant="primary" className="w-full py-3 mt-4" isLoading={loading}>
                Verify & Create Account
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setShowOtp(false)}>
                Back
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-[var(--color-accent)] hover:underline font-medium">Log in</Link>
          </p>
        </Card>
      </div>
    </PageTransition>
  );
};

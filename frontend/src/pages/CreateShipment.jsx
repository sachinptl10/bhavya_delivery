import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const CreateShipment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reorderData = location.state?.reorderData;
  const preSelectedTier = location.state?.tier || 'Standard';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    sender: reorderData ? reorderData.sender : { name: '', phone: '', address: '', pincode: '', city: '', state: '' },
    receiver: reorderData ? reorderData.receiver : { name: '', phone: '', address: '', pincode: '', city: '', state: '' },
    weight: reorderData ? reorderData.weight : '',
    tier: preSelectedTier
  });

  const savedAddresses = [
    { name: 'John Doe', phone: '9876543210', address: '42, Sunrise Apartments, SV Road', pincode: '400001', city: 'Mumbai', state: 'Maharashtra' },
    { name: 'Tech Solutions', phone: '9123456789', address: 'Plot 15, Tech Park, Phase 1', pincode: '560001', city: 'Bangalore', state: 'Karnataka' },
  ];
  
  const [priceQuote, setPriceQuote] = useState(null);
  const [zone, setZone] = useState('');
  const [orderData, setOrderData] = useState(null);
  
  const handleSenderChange = (e) => setFormData({ ...formData, sender: { ...formData.sender, [e.target.name]: e.target.value } });
  const handleReceiverChange = (e) => setFormData({ ...formData, receiver: { ...formData.receiver, [e.target.name]: e.target.value } });
  const handleTierChange = (e) => setFormData({ ...formData, tier: e.target.value });

  const calculateQuote = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let determinedZone = 'national';
      if (formData.sender.pincode.substring(0,2) === formData.receiver.pincode.substring(0,2)) determinedZone = 'regional';
      if (formData.sender.pincode === formData.receiver.pincode) determinedZone = 'local';
      
      setZone(determinedZone);
      
      const base = 50;
      const weightCharge = parseFloat(formData.weight) * 20;
      let mult = 1;
      if (determinedZone === 'regional') mult = 1.5;
      if (determinedZone === 'national') mult = 2.5;
      
      setPriceQuote((base + weightCharge) * mult);
      setStep(2);
    } catch (error) {
      toast.error('Failed to calculate quote');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        ...formData,
        zone
      });
      setOrderData(data);
      setStep(3);
    } catch (error) {
      toast.error('Failed to create order. Please log in first.');
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      const { data } = await api.post('/payments/create', { orderId: orderData._id });

      if (data.mock) {
        // Dev-only mock flow — the server rejects this in production
        await api.post('/payments/verify', { orderId: orderData._id });
        toast.success('Payment successful!');
        navigate(`/track/${orderData.trackingId}`);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Failed to load payment gateway');

      const razorpay = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Bhavya Express',
        description: `Shipment ${orderData.trackingId}`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              orderId: orderData._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful!');
            navigate(`/track/${orderData.trackingId}`);
          } catch {
            toast.error('Payment verification failed');
            setPaymentLoading(false);
          }
        },
        modal: { ondismiss: () => setPaymentLoading(false) },
      });
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
      setPaymentLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="bg-[var(--color-bg)] min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-4">Book a Delivery</h1>
            <div className="flex justify-center items-center gap-4 text-sm font-medium">
              <span className={step >= 1 ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]'}>1. Details</span>
              <span className="text-[var(--color-border)]">→</span>
              <span className={step >= 2 ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]'}>2. Quote</span>
              <span className="text-[var(--color-border)]">→</span>
              <span className={step >= 3 ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]'}>3. Payment</span>
            </div>
          </div>

          <Card className="p-8">
            {step === 1 && (
              <form onSubmit={calculateQuote} className="animate-fade-in space-y-8">
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-[var(--color-border)] pb-2 mb-4">
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">Pickup Address</h3>
                    <div className="flex flex-wrap gap-2">
                      {savedAddresses.map((addr, idx) => (
                        <button 
                          key={idx} 
                          type="button" 
                          onClick={() => setFormData({ ...formData, sender: addr })}
                          className="text-xs bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          {idx === 0 ? 'Home' : 'Office'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Name" name="name" required value={formData.sender.name} onChange={handleSenderChange} />
                    <Input label="Phone" name="phone" required value={formData.sender.phone} onChange={handleSenderChange} />
                    <Input label="Full Address" name="address" required className="col-span-1 md:col-span-2" value={formData.sender.address} onChange={handleSenderChange} />
                    <Input label="Pincode" name="pincode" required value={formData.sender.pincode} onChange={handleSenderChange} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-2">
                      <Input label="City" name="city" required value={formData.sender.city} onChange={handleSenderChange} />
                      <Input label="State" name="state" required value={formData.sender.state} onChange={handleSenderChange} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-[var(--color-border)] pb-2 mb-4">
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">Drop Address</h3>
                    <div className="flex flex-wrap gap-2">
                      {savedAddresses.map((addr, idx) => (
                        <button 
                          key={idx} 
                          type="button" 
                          onClick={() => setFormData({ ...formData, receiver: addr })}
                          className="text-xs bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          {idx === 0 ? 'Home' : 'Office'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Name" name="name" required value={formData.receiver.name} onChange={handleReceiverChange} />
                    <Input label="Phone" name="phone" required value={formData.receiver.phone} onChange={handleReceiverChange} />
                    <Input label="Full Address" name="address" required className="col-span-1 md:col-span-2" value={formData.receiver.address} onChange={handleReceiverChange} />
                    <Input label="Pincode" name="pincode" required value={formData.receiver.pincode} onChange={handleReceiverChange} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-2">
                      <Input label="City" name="city" required value={formData.receiver.city} onChange={handleReceiverChange} />
                      <Input label="State" name="state" required value={formData.receiver.state} onChange={handleReceiverChange} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)] border-b border-[var(--color-border)] pb-2">Parcel Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Package Weight (kg)</label>
                  <Input 
                    type="number" name="weight" 
                    value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} 
                    placeholder="e.g. 1.5" required min="0.1" step="0.1"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Delivery Service Tier</label>
                  <select 
                    className="w-full rounded-xl border bg-[var(--color-bg)] text-[var(--color-text)] border-[var(--color-border)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200"
                    name="tier"
                    value={formData.tier}
                    onChange={handleTierChange}
                  >
                    <option value="Standard">Standard Delivery</option>
                    <option value="Local Delivery">Local Delivery</option>
                    <option value="Regional Transport">Regional Transport</option>
                    <option value="National Logistics">National Logistics</option>
                  </select>
                </div>
              </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" variant="primary" className="px-8" isLoading={loading}>Get Quote</Button>
                </div>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className="animate-fade-in text-center py-8 space-y-6">
                <div className="w-24 h-24 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-[var(--color-accent)]">₹{priceQuote}</span>
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text)]">Estimated Price</h3>
                <p className="text-[var(--color-muted)] max-w-md mx-auto">
                  Based on a weight of {formData.weight} kg and {zone} distance tier.
                </p>
                <div className="flex justify-center gap-4 pt-8">
                  <Button variant="outline" onClick={() => setStep(1)}>Back to Edit</Button>
                  <Button variant="primary" onClick={handleCreateOrder} isLoading={loading}>Confirm & Proceed</Button>
                </div>
              </div>
            )}

            {step === 3 && orderData && (
              <div className="animate-fade-in text-center py-8 space-y-6">
                <h3 className="text-2xl font-bold text-[var(--color-primary)]">Order Created!</h3>
                <p className="text-[var(--color-muted)]">Your tracking ID is <span className="font-bold text-[var(--color-text)]">{orderData.trackingId}</span></p>
                
                <div className="bg-[var(--color-bg)] p-6 rounded-lg max-w-sm mx-auto text-left my-8 border border-[var(--color-border)]">
                  <div className="flex justify-between mb-2">
                    <span className="text-[var(--color-muted)]">Amount Due</span>
                    <span className="font-bold text-[var(--color-text)]">₹{orderData.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted)]">Payment Method</span>
                    <span className="font-medium text-[var(--color-text)]">Online Checkout</span>
                  </div>
                </div>

                <Button variant="primary" className="w-full max-w-sm py-4 text-lg" onClick={handlePayment} isLoading={paymentLoading}>
                  {paymentLoading ? 'Processing Payment...' : `Pay ₹${orderData.price}`}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

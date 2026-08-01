import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Search } from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { StatusTimeline } from '../components/StatusTimeline';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const Track = () => {
  const { trackingId: urlTrackingId } = useParams();
  const navigate = useNavigate();
  
  const [trackingId, setTrackingId] = useState(urlTrackingId || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (urlTrackingId) {
      handleTrack(urlTrackingId);
    }
  }, [urlTrackingId]);

  const handleTrack = async (idToTrack) => {
    if (!idToTrack) return;
    
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await api.get(`/orders/track/${idToTrack}`);
      setOrder(data);
    } catch {
      toast.error('Order not found. Please check your Tracking ID.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/track/${trackingId.trim()}`);
    }
  };

  return (
    <PageTransition>
      <div className="bg-[var(--color-bg)] min-h-[calc(100vh-64px)] py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] mb-3 sm:mb-4">Track Your Shipment</h1>
            <p className="text-[var(--color-muted)] text-sm sm:text-base">Enter your Bhavya Express Tracking ID to get real-time updates.</p>
          </div>

          <Card className="p-6 mb-8 max-w-2xl mx-auto">
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <Input 
                  placeholder="e.g. BHV1000001" 
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full text-base sm:text-lg py-2.5 sm:py-3"
                />
              </div>
              <Button type="submit" variant="primary" className="py-2.5 sm:py-3 px-6 sm:px-8 text-base sm:text-lg flex items-center justify-center gap-2" isLoading={loading}>
                <Search className="w-5 h-5" /> Track
              </Button>
            </form>
          </Card>

          {loading ? (
            <Card className="p-6 sm:p-8">
              <Skeleton className="h-8 w-1/2 md:w-1/3 mb-8" />
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Skeleton className="h-16 w-full md:w-1/4" />
                <Skeleton className="h-16 w-full md:w-1/4" />
                <Skeleton className="h-16 w-full md:w-1/4" />
                <Skeleton className="h-16 w-full md:w-1/4" />
              </div>
            </Card>
          ) : order ? (
            <Card className="p-8 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-text)]">Order #{order.trackingId}</h2>
                  <p className="text-gray-500 mt-1">
                    From <span className="font-medium text-gray-700">{order.sender.city}</span> to <span className="font-medium text-gray-700">{order.receiver.city}</span>
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-left md:text-right">
                  <p className="text-sm text-gray-500">Current Status</p>
                  <p className="text-lg font-bold text-[var(--color-primary)]">{order.status}</p>
                </div>
              </div>

              <StatusTimeline currentStatus={order.status} statusHistory={order.statusHistory} />

              <div className="mt-12 bg-gray-50 p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Origin</h3>
                  <p className="text-sm text-gray-600">{order.sender.city}, {order.sender.state}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Destination</h3>
                  <p className="text-sm text-gray-600">{order.receiver.city}, {order.receiver.state}</p>
                </div>
              </div>
            </Card>
          ) : searched && !loading && (
            <div className="text-center py-12 animate-fade-in">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700">No order found</h3>
              <p className="text-gray-500 mt-2">Please double check your tracking ID and try again.</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

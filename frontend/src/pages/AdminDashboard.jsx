import React, { useState, useEffect } from 'react';
import { PageTransition } from '../components/PageTransition';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, revenue: 0, activeDeliveries: 0 });
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchData = async (currentPage = 1) => {
    try {
      const [statsRes, ordersRes, tiersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get(`/admin/orders?page=${currentPage}&limit=20`),
        api.get('/pricing-tiers') // public route we created
      ]);

      animateValue('totalOrders', 0, statsRes.data.totalOrders, 1000);
      animateValue('revenue', 0, statsRes.data.revenue, 1000);
      animateValue('activeDeliveries', 0, statsRes.data.activeDeliveries, 1000);
      setRevenueTrend(statsRes.data.revenueTrend || []);

      setOrders(ordersRes.data.orders);
      setPages(ordersRes.data.pages);
      setTiers(tiersRes.data);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const animateValue = (key, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setStats(prev => ({ ...prev, [key]: Math.floor(progress * (end - start) + start) }));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setStats(prev => ({ ...prev, [key]: end })); 
      }
    };
    window.requestAnimationFrame(step);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success('Status updated successfully');
    } catch {
      toast.error('Failed to update status');
      fetchData(); 
    }
  };

  const handleTierUpdate = async (tierId, updates) => {
    try {
      const res = await api.put(`/pricing-tiers/${tierId}`, updates);
      toast.success('Tier updated successfully');
      // If popularity was changed, refetch to sync all tiers
      if (updates.isPopular !== undefined) {
        fetchData(page);
      } else {
        setTiers(tiers.map(t => t._id === tierId ? res.data : t));
      }
    } catch {
      toast.error('Failed to update tier');
    }
  };

  return (
    <PageTransition>
      <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-8">Admin Dashboard</h1>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-3/4" />
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6">
                  <h3 className="text-gray-500 font-medium mb-2">Total Orders</h3>
                  <div className="text-4xl font-bold text-[var(--color-text)]">{stats.totalOrders}</div>
                </Card>
                <Card className="p-6">
                  <h3 className="text-gray-500 font-medium mb-2">Total Revenue</h3>
                  <div className="text-4xl font-bold text-green-600">₹{stats.revenue.toLocaleString()}</div>
                </Card>
                <Card className="p-6">
                  <h3 className="text-gray-500 font-medium mb-2">Active Deliveries</h3>
                  <div className="text-4xl font-bold text-[var(--color-accent)]">{stats.activeDeliveries}</div>
                </Card>
              </div>

              <div className="mb-8">
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-6">Revenue Trend (Last 7 Days)</h3>
                  <div className="h-72">
                    {revenueTrend.some(d => d.revenue > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueTrend}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                          <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                          />
                          <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        No paid orders in the last 7 days
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <Card className="overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-sm">
                        <th className="p-4 font-medium">Tracking ID</th>
                        <th className="p-4 font-medium">Customer</th>
                        <th className="p-4 font-medium">Route</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 font-medium">{order.trackingId}</td>
                          <td className="p-4 text-sm">
                            {order.user?.name || 'Guest'}<br/>
                            <span className="text-gray-400 text-xs">{order.user?.email}</span>
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {order.sender.city} → {order.receiver.city}
                          </td>
                          <td className="p-4">
                            <Badge variant={order.status === 'Delivered' ? 'success' : order.status === 'Booked' ? 'primary' : 'warning'}>
                              {order.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <select 
                              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] py-1 pl-2 pr-8"
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            >
                              <option value="Booked">Booked</option>
                              <option value="Picked Up">Picked Up</option>
                              <option value="In Transit">In Transit</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {pages > 1 && (
                  <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <Button
                      variant="outline"
                      disabled={page <= 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-500">Page {page} of {pages}</span>
                    <Button
                      variant="outline"
                      disabled={page >= pages}
                      onClick={() => setPage(p => Math.min(pages, p + 1))}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </Card>

              {/* Pricing Tiers Management */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-6">Manage Pricing Tiers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {tiers.map((tier) => (
                    <Card key={tier._id} className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-lg">{tier.name}</h4>
                        <Badge variant={tier.isPopular ? 'primary' : 'secondary'}>
                          {tier.isPopular ? 'Most Popular' : 'Standard'}
                        </Badge>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-500 block mb-1">Base Price (₹)</label>
                          <Input 
                            type="number" 
                            defaultValue={tier.basePrice} 
                            onBlur={(e) => {
                              if (Number(e.target.value) !== tier.basePrice) {
                                handleTierUpdate(tier._id, { ...tier, basePrice: Number(e.target.value) });
                              }
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-500 block mb-1">Delivery Time</label>
                          <Input 
                            type="text" 
                            defaultValue={tier.deliveryTime} 
                            onBlur={(e) => {
                              if (e.target.value !== tier.deliveryTime) {
                                handleTierUpdate(tier._id, { ...tier, deliveryTime: e.target.value });
                              }
                            }}
                          />
                        </div>
                        <div className="pt-2">
                          <Button 
                            variant={tier.isPopular ? "outline" : "secondary"} 
                            className="w-full"
                            onClick={() => handleTierUpdate(tier._id, { ...tier, isPopular: !tier.isPopular })}
                          >
                            {tier.isPopular ? 'Remove Popular Badge' : 'Set as Most Popular'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

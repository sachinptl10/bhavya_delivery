import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { Package, TrendingUp, CheckCircle, IndianRupee } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import api from '../utils/api';

export const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return <Badge variant="success">{status}</Badge>;
      case 'Booked': return <Badge variant="primary">{status}</Badge>;
      default: return <Badge variant="warning">{status}</Badge>;
    }
  };

  return (
    <PageTransition>
      <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-primary)]">My Shipments</h1>
            <Link to="/create-shipment" className="bg-[var(--color-accent)] text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">
              Book New Delivery
            </Link>
          </div>

          {!loading && orders.length > 0 && (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
                <Card className="p-6 border-l-4 border-l-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Shipments</p>
                      <h3 className="text-3xl font-bold text-gray-800">{orders.length}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <Package className="w-6 h-6" />
                    </div>
                  </div>
                </Card>
                <Card className="p-6 border-l-4 border-l-emerald-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Delivered</p>
                      <h3 className="text-3xl font-bold text-gray-800">
                        {orders.filter(o => o.status === 'Delivered').length}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  </div>
                </Card>
                <Card className="p-6 border-l-4 border-l-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">Total Spent</p>
                      <h3 className="text-3xl font-bold text-gray-800">
                        ₹{orders.reduce((acc, curr) => acc + (curr.price || 0), 0).toLocaleString()}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                      <IndianRupee className="w-6 h-6" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-6">Shipment Status</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, color: '#10b981' },
                            { name: 'In Transit', value: orders.filter(o => o.status === 'In Transit').length, color: '#3b82f6' },
                            { name: 'Picked Up', value: orders.filter(o => o.status === 'Picked Up').length, color: '#f59e0b' },
                            { name: 'Booked', value: orders.filter(o => o.status === 'Booked').length, color: '#6366f1' },
                          ].filter(d => d.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {([
                            { name: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, color: '#10b981' },
                            { name: 'In Transit', value: orders.filter(o => o.status === 'In Transit').length, color: '#3b82f6' },
                            { name: 'Picked Up', value: orders.filter(o => o.status === 'Picked Up').length, color: '#f59e0b' },
                            { name: 'Booked', value: orders.filter(o => o.status === 'Booked').length, color: '#6366f1' },
                          ].filter(d => d.value > 0)).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-6">Recent Volume</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.values(orders.reduce((acc, order) => {
                          const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          acc[date] = acc[date] || { name: date, shipments: 0 };
                          acc[date].shipments += 1;
                          return acc;
                        }, {})).slice(-7)} // Last 7 days of activity
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                        <RechartsTooltip cursor={{ fill: '#f3f4f6' }} />
                        <Bar dataKey="shipments" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Orders</h2>
            </>
          )}

          {loading ? (
            <div className="grid gap-6">
              {[1,2,3].map(i => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-6 w-1/4 mb-4" />
                  <Skeleton className="h-4 w-1/2" />
                </Card>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <Package className="w-10 h-10 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No shipments yet</h3>
              <p className="text-gray-500 mb-6">You haven't booked any deliveries with Bhavya Express.</p>
              <Link to="/create-shipment" className="text-[var(--color-accent)] font-medium hover:underline">
                Book your first delivery →
              </Link>
            </Card>
          ) : (
            <div className="grid gap-6 animate-fade-in">
              {orders.map((order) => (
                <Card key={order._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-bold">#{order.trackingId}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-500">
                      From <span className="font-medium text-gray-700">{order.sender.city}</span> to <span className="font-medium text-gray-700">{order.receiver.city}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Booked on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-4">
                    <div className="text-left md:text-right mr-4">
                      <p className="font-bold">₹{order.price}</p>
                      <p className="text-xs text-gray-500">{order.weight} kg • {order.zone}</p>
                    </div>
                    <Link to="/create-shipment" state={{ reorderData: order }} className="text-gray-600 font-medium hover:underline border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all dark:border-[var(--color-border)] dark:text-gray-300 dark:hover:bg-[var(--color-border)]">
                      Reorder
                    </Link>
                    <Link to={`/track/${order.trackingId}`} className="text-[var(--color-primary)] font-medium hover:underline border border-[var(--color-primary)] px-4 py-2 rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-all">
                      Track
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

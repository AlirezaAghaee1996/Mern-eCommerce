import React, { useEffect, useState } from 'react';
import { Users, UserCheck, MessageCircle, Star, ShoppingCart, DollarSign, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { useSelector } from 'react-redux';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [charts, setCharts] = useState({});
  const { token } = useSelector((state) => state.auth);

  const fetchData = async () => {
    const headers = { authorization: `Bearer ${token}` };
    const endpoints = {
      totalUsers: 'report/users/total',
      newActive: 'report/users/new-vs-active',
      salesByCategory: 'report/products/sales-by-category',
      statusCounts: 'report/orders/status-counts',
      revenueSummary: 'report/orders/revenue-summary',
      abandonedRate: 'report/carts/abandoned-rate',
      commentsStats: 'report/interactions/comments-stats',
      ratingsStats: 'report/interactions/ratings-stats',
      discountPerf: 'report/marketing/discount-performance',
      shippingRegion: 'report/logistics/shipping-by-region',
      dataGrowth: 'report/system/data-growth'
    };

    try {
      const results = await Promise.all(
        Object.entries(endpoints).map(async ([key, url]) => {
          const res = await fetch(`${import.meta.env.VITE_BASE_URL}${url}`, { headers });
          const json = await res.json();
          return [key, json.data];
        })
      );
      const dataMap = Object.fromEntries(results);
      setStats({
        totalUsers: dataMap.totalUsers.total,
        newUsers: dataMap.newActive.newUsers,
        activeUsers: dataMap.newActive.activeUsers,
        gross: dataMap.revenueSummary.gross,
        net: dataMap.revenueSummary.net,
        abandonedRate: Number(dataMap.abandonedRate.rate).toFixed(1),
        totalComments: dataMap.commentsStats.total,
        approvedComments: dataMap.commentsStats.approved,
        avgRating: Number(dataMap.ratingsStats.avgRate).toFixed(2),
        totalRatings: dataMap.ratingsStats.totalCount
      });
      setCharts({
        salesByCategory: dataMap.salesByCategory,
        statusCounts: dataMap.statusCounts,
        discountPerf: dataMap.discountPerf,
        shippingRegion: dataMap.shippingRegion,
        dataGrowth: dataMap.dataGrowth
      });
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // summary card definitions including all relevant stats
  const summaryCards = [
    { icon: Users, metric: stats.totalUsers, label: 'Total Users', bg: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
    { icon: UserCheck, metric: stats.newUsers, label: 'New Users', bg: 'bg-gradient-to-r from-blue-400 to-blue-600' },
    { icon: Users, metric: stats.activeUsers, label: 'Active Users', bg: 'bg-gradient-to-r from-green-400 to-green-600' },
    { icon: ShoppingCart, metric: `${stats.abandonedRate}%`, label: 'Abandoned Carts', bg: 'bg-gradient-to-r from-teal-400 to-teal-600' },
    { icon: DollarSign, metric: `$${stats.gross}`, label: 'Gross Revenue', bg: 'bg-gradient-to-r from-yellow-400 to-yellow-600' },
    { icon: Activity, metric: `$${stats.net}`, label: 'Net Revenue', bg: 'bg-gradient-to-r from-red-400 to-red-600' },
    { icon: MessageCircle, metric: stats.totalComments, label: 'Comments Total', bg: 'bg-gradient-to-r from-purple-400 to-purple-600' },
    { icon: UserCheck, metric: stats.approvedComments, label: 'Approved Comments', bg: 'bg-gradient-to-r from-pink-400 to-pink-600' },
    { icon: Star, metric: stats.avgRating, label: 'Avg Rating', bg: 'bg-gradient-to-r from-orange-400 to-orange-600' },
    { icon: Star, metric: stats.totalRatings, label: 'Total Ratings', bg: 'bg-gradient-to-r from-yellow-600 to-yellow-800' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-12">
      <h1 className="text-4xl font-extrabold text-gray-900">Admin Analytics Dashboard</h1>

      {/* Summary Cards Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
      >
        {summaryCards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              className={`${item.bg} text-white rounded-2xl shadow-2xl p-6 flex items-center space-x-4`}
              variants={cardVariants}
            >
              <Icon className="w-8 h-8" />
              <div>
                <p className="text-4xl font-bold">{item.metric}</p>
                <p className="uppercase tracking-wide text-xs">{item.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Chart Rows */}
      <div className="space-y-12">
        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales by Category */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Sales by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.salesByCategory} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalRevenue" name="Revenue" fill={COLORS[0]} />
                <Bar dataKey="totalQuantity" name="Quantity" fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Order Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={charts.statusCounts} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label>
                  {charts.statusCounts?.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Discount Usage */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Discount Usage</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={charts.discountPerf}>  
                <XAxis dataKey="code" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="uses" fill={COLORS[2]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Shipping by Region */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping by Region</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={charts.shippingRegion}>  
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS[3]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Data Growth */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Data Growth Overview</h2>
            <ul className="space-y-2">
              {charts.dataGrowth && Object.entries(charts.dataGrowth).map(([key, val]) => (
                <li key={key} className="flex justify-between">
                  <span className="capitalize">{key}</span>
                  <span className="font-medium">{val}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

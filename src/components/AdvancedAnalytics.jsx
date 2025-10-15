import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Users, DollarSign, Briefcase, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Area, AreaChart } from 'recharts'

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export const AdvancedAnalytics = ({ employees }) => {
  // Calculate department distribution
  const departmentData = employees.reduce((acc, emp) => {
    const dept = emp.department || 'Unknown'
    acc[dept] = (acc[dept] || 0) + 1
    return acc
  }, {})

  const pieData = Object.entries(departmentData).map(([name, value]) => ({
    name,
    value,
  }))

  // Calculate salary trends
  const salaryRanges = {
    '0-40K': 0,
    '40-60K': 0,
    '60-80K': 0,
    '80-100K': 0,
    '100K+': 0,
  }

  employees.forEach(emp => {
    const salary = emp.salary || 0
    if (salary < 40000) salaryRanges['0-40K']++
    else if (salary < 60000) salaryRanges['40-60K']++
    else if (salary < 80000) salaryRanges['60-80K']++
    else if (salary < 100000) salaryRanges['80-100K']++
    else salaryRanges['100K+']++
  })

  const salaryData = Object.entries(salaryRanges).map(([range, count]) => ({
    range,
    count,
  }))

  // Calculate experience distribution
  const experienceData = employees.reduce((acc, emp) => {
    const exp = emp.experience || 0
    const bracket = Math.floor(exp / 5) * 5
    const label = `${bracket}-${bracket + 4}y`
    acc[label] = (acc[label] || 0) + 1
    return acc
  }, {})

  const expData = Object.entries(experienceData).map(([years, count]) => ({
    years,
    count,
  }))

  // Calculate statistics
  const avgSalary = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0) / employees.length
  const avgExperience = employees.reduce((sum, emp) => sum + (emp.experience || 0), 0) / employees.length
  const totalDepartments = Object.keys(departmentData).length

  // Calculate month-wise hiring (simulated)
  const monthlyHiring = [
    { month: 'Jan', hires: Math.floor(Math.random() * 10) + 5 },
    { month: 'Feb', hires: Math.floor(Math.random() * 10) + 5 },
    { month: 'Mar', hires: Math.floor(Math.random() * 10) + 5 },
    { month: 'Apr', hires: Math.floor(Math.random() * 10) + 5 },
    { month: 'May', hires: Math.floor(Math.random() * 10) + 5 },
    { month: 'Jun', hires: Math.floor(Math.random() * 10) + 5 },
  ]

  const StatCard = ({ icon: Icon, label, value, trend, trendValue }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden"
    >
      <Card className="glass border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
              {trend && (
                <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  <span>{trendValue}</span>
                </div>
              )}
            </div>
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* Advanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Employees"
          value={employees.length}
          trend="up"
          trendValue="+12% this month"
        />
        <StatCard
          icon={DollarSign}
          label="Avg Salary"
          value={`₹${Math.floor(avgSalary / 1000)}K`}
          trend="up"
          trendValue="+8% from last year"
        />
        <StatCard
          icon={Briefcase}
          label="Departments"
          value={totalDepartments}
          trend="up"
          trendValue="+2 new departments"
        />
        <StatCard
          icon={Award}
          label="Avg Experience"
          value={`${avgExperience.toFixed(1)} years`}
          trend="up"
          trendValue="+0.5 years"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Salary Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle>Salary Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={salaryData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Hiring Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle>Monthly Hiring Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyHiring}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hires" stroke="#ec4899" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Experience Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle>Experience Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={expData}>
                  <defs>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="years" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorExp)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

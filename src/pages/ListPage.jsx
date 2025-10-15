import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut,
  Search,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Map,
  Table as TableIcon,
  User,
  TrendingUp,
  Users,
  GitCompare,
  Activity,
  LayoutDashboard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LoadingSpinner } from '@/components/ui/loading'
import { SkeletonCard, SkeletonTable } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'
import { fetchEmployeeData } from '@/services/api'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { AdvancedAnalytics } from '@/components/AdvancedAnalytics'
import { EmployeeComparison } from '@/components/EmployeeComparison'
import { AdvancedFilters } from '@/components/AdvancedFilters'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const ITEMS_PER_PAGE = 10

const ListPage = () => {
  const [employees, setEmployees] = useState([])
  const [displayedEmployees, setDisplayedEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [viewMode, setViewMode] = useState('table') // table, chart, map, analytics
  const [showComparison, setShowComparison] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadEmployeeData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [searchTerm, employees, sortConfig])

  const loadEmployeeData = async () => {
    try {
      setIsLoading(true)
      const cachedData = localStorage.getItem('employeeData')
      
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData)
        const isRecent = Date.now() - timestamp < 5 * 60 * 1000 // 5 minutes
        
        if (isRecent) {
          setEmployees(data)
          setIsLoading(false)
          toast.success('Data loaded from cache')
          return
        }
      }

      const data = await fetchEmployeeData()
      setEmployees(data)
      localStorage.setItem('employeeData', JSON.stringify({
        data,
        timestamp: Date.now(),
      }))
      toast.success('Employee data loaded successfully!')
    } catch (error) {
      console.error('Failed to fetch employee data:', error)
      toast.error('Failed to load data. Using dummy data.')
      // Use dummy data as fallback
      const dummyData = generateDummyData()
      setEmployees(dummyData)
    } finally {
      setIsLoading(false)
    }
  }

  const generateDummyData = () => {
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'David Brown', 'Emma Davis', 'Chris Wilson', 'Lisa Anderson', 'Tom Taylor', 'Anna Martin', 'James Garcia', 'Maria Rodriguez', 'Robert Lee', 'Linda Martinez', 'Michael White']
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad']
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations']
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: names[i % names.length] + ' ' + (i + 1),
      email: `employee${i + 1}@company.com`,
      salary: Math.floor(Math.random() * 100000) + 30000,
      city: cities[Math.floor(Math.random() * cities.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      experience: Math.floor(Math.random() * 15) + 1,
      joinDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
    }))
  }

  const filterAndSortData = () => {
    let filtered = [...employees]

    if (searchTerm) {
      filtered = filtered.filter((emp) =>
        Object.values(emp).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    setFilteredEmployees(filtered)
    setDisplayedEmployees(filtered)
    setCurrentPage(1)
  }

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
    toast.success(`Sorted by ${key}`)
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully!')
    navigate('/')
  }

  const handleRowClick = (employee) => {
    navigate(`/employee/${employee.id}`, { state: { employee } })
  }

  const handleFilterChange = (filtered) => {
    setDisplayedEmployees(filtered)
    setCurrentPage(1)
    toast.success(`Showing ${filtered.length} employees`)
  }

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
    
    // Confetti for analytics view
    if (mode === 'analytics') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.4 }
      })
    }
  }

  const totalPages = Math.ceil(displayedEmployees.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentEmployees = displayedEmployees.slice(startIndex, endIndex)

  const chartData = displayedEmployees.slice(0, 10).map((emp) => ({
    name: emp.name?.substring(0, 15) || 'Unknown',
    salary: emp.salary || 0,
  }))

  const cityCoordinates = {
    Mumbai: [19.0760, 72.8777],
    Delhi: [28.7041, 77.1025],
    Bangalore: [12.9716, 77.5946],
    Hyderabad: [17.3850, 78.4867],
    Chennai: [13.0827, 80.2707],
    Kolkata: [22.5726, 88.3639],
    Pune: [18.5204, 73.8567],
    Ahmedabad: [23.0225, 72.5714],
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass border-b border-white/20 sticky top-0 z-50 backdrop-blur-xl"
      >
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full gradient-primary flex items-center justify-center"
            >
              <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-base sm:text-xl font-bold">Employee Dashboard</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden xs:block">Welcome, {user?.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Badge variant="success" className="hidden md:flex text-xs">
              {employees.length} Employees
            </Badge>
            <ThemeToggle />
            <Button variant="ghost" onClick={handleLogout} className="hover:bg-destructive/10 text-xs sm:text-sm px-2 sm:px-4">
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass border-white/20 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => handleViewModeChange('analytics')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Employees</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{employees.length}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline w-3 h-3 mr-1" />
                  Active workforce
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass border-white/20 hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Average Salary</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">
                  {formatCurrency(
                    employees.reduce((sum, emp) => sum + (emp.salary || 0), 0) / employees.length
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Per employee</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass border-white/20 hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Departments</CardTitle>
                <BarChart3 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">
                  {new Set(employees.map(emp => emp.department)).size}
                </div>
                <p className="text-xs text-muted-foreground">Active departments</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                  <CardTitle className="text-base sm:text-lg">Employee Directory</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Manage and view all employee information
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleViewModeChange('table')}
                    className="text-xs flex-1 xs:flex-none"
                  >
                    <TableIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Table</span>
                  </Button>
                  <Button
                    variant={viewMode === 'chart' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleViewModeChange('chart')}
                    className="text-xs flex-1 xs:flex-none"
                  >
                    <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Chart</span>
                  </Button>
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleViewModeChange('map')}
                    className="text-xs flex-1 xs:flex-none"
                  >
                    <Map className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Map</span>
                  </Button>
                  <Button
                    variant={viewMode === 'analytics' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleViewModeChange('analytics')}
                    className="text-xs flex-1 xs:flex-none"
                  >
                    <LayoutDashboard className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Analytics</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComparison(true)}
                    className="text-xs w-full xs:w-auto"
                  >
                    <GitCompare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Compare
                  </Button>
                </div>
              </div>

              {viewMode === 'table' && (
                <div className="space-y-4 mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <AdvancedFilters 
                    employees={filteredEmployees} 
                    onFilterChange={handleFilterChange}
                  />
                </div>
              )}
            </CardHeader>

            <CardContent>
              <AnimatePresence mode="wait">
                {viewMode === 'table' && (
                  <motion.div
                    key="table"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="overflow-x-auto -mx-3 sm:mx-0">
                      <table className="w-full min-w-full">
                        <thead>
                          <tr className="border-b">
                            <th
                              className="text-left p-2 sm:p-3 cursor-pointer hover:bg-accent transition-colors text-xs sm:text-sm"
                              onClick={() => handleSort('name')}
                            >
                              Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                              className="text-left p-2 sm:p-3 cursor-pointer hover:bg-accent transition-colors hidden md:table-cell text-xs sm:text-sm"
                              onClick={() => handleSort('email')}
                            >
                              Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                              className="text-left p-2 sm:p-3 cursor-pointer hover:bg-accent transition-colors text-xs sm:text-sm"
                              onClick={() => handleSort('department')}
                            >
                              <span className="hidden xs:inline">Department</span>
                              <span className="xs:hidden">Dept</span> {sortConfig.key === 'department' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                              className="text-left p-2 sm:p-3 cursor-pointer hover:bg-accent transition-colors text-xs sm:text-sm"
                              onClick={() => handleSort('salary')}
                            >
                              Salary {sortConfig.key === 'salary' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                              className="text-left p-2 sm:p-3 cursor-pointer hover:bg-accent transition-colors hidden lg:table-cell text-xs sm:text-sm"
                              onClick={() => handleSort('city')}
                            >
                              City {sortConfig.key === 'city' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentEmployees.map((employee, index) => (
                            <motion.tr
                              key={employee.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleRowClick(employee)}
                              className="border-b hover:bg-accent/50 cursor-pointer transition-colors"
                            >
                              <td className="p-2 sm:p-3">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0 text-xs sm:text-sm">
                                    {employee.name?.charAt(0) || 'E'}
                                  </div>
                                  <span className="font-medium text-xs sm:text-sm truncate">{employee.name || 'Unknown'}</span>
                                </div>
                              </td>
                              <td className="p-2 sm:p-3 text-muted-foreground hidden md:table-cell text-xs sm:text-sm">{employee.email || 'N/A'}</td>
                              <td className="p-2 sm:p-3">
                                <Badge variant="secondary" className="text-xs">
                                  {employee.department || 'N/A'}
                                </Badge>
                              </td>
                              <td className="p-2 sm:p-3 font-semibold text-xs sm:text-sm">{formatCurrency(employee.salary || 0)}</td>
                              <td className="p-2 sm:p-3 hidden lg:table-cell text-xs sm:text-sm">{employee.city || 'N/A'}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-6 gap-3 sm:gap-4">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(endIndex, displayedEmployees.length)} of{' '}
                        {displayedEmployees.length} results
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="text-xs sm:text-sm"
                        >
                          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <span className="text-xs sm:text-sm">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="text-xs sm:text-sm"
                        >
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {viewMode === 'chart' && (
                  <motion.div
                    key="chart"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="h-96"
                  >
                    <h3 className="text-lg font-semibold mb-4">Top 10 Employee Salaries</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => formatCurrency(value)}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Legend />
                        <Bar dataKey="salary" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {viewMode === 'map' && (
                  <motion.div
                    key="map"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="h-96 rounded-lg overflow-hidden"
                  >
                    <MapContainer
                      center={[20.5937, 78.9629]}
                      zoom={5}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      {Object.entries(
                        employees.reduce((acc, emp) => {
                          const city = emp.city
                          if (!acc[city]) acc[city] = []
                          acc[city].push(emp)
                          return acc
                        }, {})
                      ).map(([city, cityEmployees]) => {
                        const coords = cityCoordinates[city]
                        if (!coords) return null
                        return (
                          <Marker key={city} position={coords}>
                            <Popup>
                              <div className="p-2">
                                <h3 className="font-bold">{city}</h3>
                                <p className="text-sm">{cityEmployees.length} employees</p>
                              </div>
                            </Popup>
                          </Marker>
                        )
                      })}
                    </MapContainer>
                  </motion.div>
                )}

                {viewMode === 'analytics' && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AdvancedAnalytics employees={employees} />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Employee Comparison Modal */}
      <AnimatePresence>
        {showComparison && (
          <EmployeeComparison
            employees={employees}
            onClose={() => setShowComparison(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ListPage

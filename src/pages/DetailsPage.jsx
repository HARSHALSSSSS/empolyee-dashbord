import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Camera,
  Clock,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useState } from 'react'

const DetailsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const [employee] = useState(location.state?.employee || getEmployeeFromStorage(id))

  function getEmployeeFromStorage(employeeId) {
    const cachedData = localStorage.getItem('employeeData')
    if (cachedData) {
      const { data } = JSON.parse(cachedData)
      return data.find(emp => emp.id === parseInt(employeeId))
    }
    return null
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <p className="text-lg mb-4">Employee not found</p>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleCapturePhoto = () => {
    navigate('/capture-photo', { state: { employee } })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass border-b border-white/20 sticky top-0 z-50 backdrop-blur-xl"
      >
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-xs sm:text-sm">
            <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Back to Dashboard
          </Button>
        </div>
      </motion.div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Profile Card */}
          <motion.div variants={itemVariants}>
            <Card className="glass border-white/20 overflow-hidden">
              <div className="h-20 sm:h-32 gradient-animated"></div>
              <CardContent className="relative pt-12 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="absolute -top-10 sm:-top-16 left-1/2 transform -translate-x-1/2"
                >
                  <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full gradient-primary flex items-center justify-center text-white text-3xl sm:text-5xl font-bold border-4 border-background shadow-xl">
                    {employee.name?.charAt(0) || 'E'}
                  </div>
                </motion.div>

                <div className="text-center mt-2 sm:mt-4">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">{employee.name}</h1>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-3 sm:mb-4">{employee.department || 'Employee'}</p>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleCapturePhoto}
                      className="gradient-primary hover:opacity-90 transition-opacity text-sm sm:text-base"
                      size="lg"
                    >
                      <Camera className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Capture Photo
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <motion.div variants={itemVariants}>
              <Card className="glass border-white/20 hover:shadow-xl transition-all h-full">
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center text-sm sm:text-base lg:text-lg">
                    <Mail className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Email Address</p>
                    <p className="font-medium text-sm sm:text-base break-all">{employee.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <p className="font-medium">{employee.city || 'Not provided'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass border-white/20 hover:shadow-xl transition-all h-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Briefcase className="mr-2 h-5 w-5 text-primary" />
                    Professional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Department</p>
                    <p className="font-medium">{employee.department || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Experience</p>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <p className="font-medium">{employee.experience || 0} years</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass border-white/20 hover:shadow-xl transition-all h-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <DollarSign className="mr-2 h-5 w-5 text-primary" />
                    Compensation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Annual Salary</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(employee.salary || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Monthly Salary</p>
                    <p className="font-medium">
                      {formatCurrency((employee.salary || 0) / 12)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="glass border-white/20 hover:shadow-xl transition-all h-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    Employment Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Join Date</p>
                    <p className="font-medium">{formatDate(employee.joinDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Employee ID</p>
                    <p className="font-medium">EMP-{String(employee.id).padStart(5, '0')}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Additional Info Card */}
          <motion.div variants={itemVariants}>
            <Card className="glass border-white/20 hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Award className="mr-2 h-5 w-5 text-primary" />
                  Additional Information
                </CardTitle>
                <CardDescription>
                  More details about the employee
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-primary/10">
                    <p className="text-2xl font-bold text-primary">{employee.experience || 0}</p>
                    <p className="text-sm text-muted-foreground">Years Exp.</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-primary/10">
                    <p className="text-2xl font-bold text-primary">
                      {employee.department?.substring(0, 3).toUpperCase() || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">Department</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-primary/10">
                    <p className="text-2xl font-bold text-primary">
                      {employee.city?.substring(0, 3).toUpperCase() || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">Location</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-primary/10">
                    <p className="text-2xl font-bold text-primary">
                      {Math.floor((employee.salary || 0) / 1000)}K
                    </p>
                    <p className="text-sm text-muted-foreground">Salary (K)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default DetailsPage

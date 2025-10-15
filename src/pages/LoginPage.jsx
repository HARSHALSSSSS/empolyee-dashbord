import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, User, Lock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuth } from '@/contexts/AuthContext'
import { validateLogin } from '@/services/api'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (validateLogin(username, password)) {
      // Success confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
      
      toast.success('Login successful! Welcome back! 🎉')
      login(username)
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 500)
    } else {
      setError('Invalid credentials. Try: testuser / Test123')
      toast.error('Invalid credentials. Please try again.')
      setIsLoading(false)
    }
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
    <div className="min-h-screen flex items-center justify-center gradient-animated relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-60 h-60 sm:w-80 sm:h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Login card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md px-4 sm:px-6 z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-lg mb-3 sm:mb-4"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Employee Dashboard</h1>
          <p className="text-sm sm:text-base text-white/80">Modern HR Management System</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass border-white/20">
            <CardHeader className="space-y-1 pb-4 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center text-sm sm:text-base">
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="testuser"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Test123"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2 sm:p-3 rounded-md bg-destructive/10 border border-destructive/20"
                  >
                    <p className="text-xs sm:text-sm text-destructive">{error}</p>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full gradient-primary hover:opacity-90 transition-opacity text-sm sm:text-base py-2 sm:py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                    </motion.div>
                  ) : (
                    <LogIn className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="text-center text-xs sm:text-sm text-muted-foreground">
                  <p>Demo credentials:</p>
                  <p className="font-mono">testuser / Test123</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-center text-white/60 text-xs sm:text-sm mt-4 sm:mt-6"
        >
          © 2025 Employee Dashboard. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  )
}

export default LoginPage

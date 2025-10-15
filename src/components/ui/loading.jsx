import { motion } from 'framer-motion'

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600">
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="spinner"></div>
        <motion.p
          className="text-white mt-8 text-lg font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  )
}

export const SmallSpinner = ({ className = "" }) => {
  return (
    <div className={`inline-block ${className}`}>
      <div className="spinner w-6 h-6 border-2"></div>
    </div>
  )
}

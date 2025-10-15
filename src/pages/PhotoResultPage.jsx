import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, ArrowLeft, RotateCcw, Check, Share2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PhotoEditor } from '@/components/PhotoEditor'
import { useState } from 'react'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

const PhotoResultPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { photo, employee } = location.state || {}
  const [isSaved, setIsSaved] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState(photo)

  if (!currentPhoto) {
    navigate(-1)
    return null
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = currentPhoto
    link.download = `${employee?.name || 'employee'}-photo-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setIsSaved(true)
    
    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    
    toast.success('Photo downloaded successfully!')
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const blob = await (await fetch(currentPhoto)).blob()
        const file = new File([blob], `${employee?.name || 'employee'}-photo.jpg`, { type: 'image/jpeg' })
        await navigator.share({
          files: [file],
          title: 'Employee Photo',
          text: `Photo of ${employee?.name || 'employee'}`,
        })
        toast.success('Photo shared successfully!')
      } catch (error) {
        console.log('Error sharing:', error)
        toast.error('Sharing not supported')
      }
    } else {
      handleDownload()
    }
  }

  const handlePhotoEdit = (editedPhoto) => {
    setCurrentPhoto(editedPhoto)
    setShowEditor(false)
    toast.success('Photo edited successfully!')
  }

  const handleRetake = () => {
    navigate(-1)
  }

  const handleBackToDetails = () => {
    if (employee) {
      navigate(`/employee/${employee.id}`, { state: { employee } })
    } else {
      navigate('/dashboard')
    }
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
          <Button variant="ghost" onClick={handleBackToDetails} className="text-xs sm:text-sm">
            <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            {employee ? 'Back to Details' : 'Back to Dashboard'}
          </Button>
        </div>
      </motion.div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass border-white/20">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center text-lg sm:text-xl lg:text-2xl">
                <Check className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                Photo Captured Successfully
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {employee ? `Photo for ${employee.name}` : 'Employee photo captured'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {/* Photo Display */}
                <motion.div
                  className="relative rounded-lg overflow-hidden shadow-2xl"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <img
                    src={currentPhoto}
                    alt="Captured employee"
                    className="w-full h-auto"
                  />
                  
                  {/* Success overlay animation */}
                  <motion.div
                    className="absolute inset-0 bg-green-500/20 flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center"
                    >
                      <Check className="w-10 h-10 text-white" />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Employee Info */}
                {employee && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-3 sm:p-4 rounded-lg bg-primary/10 border border-primary/20"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-primary flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0">
                        {employee.name?.charAt(0) || 'E'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg">{employee.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {employee.department} • {employee.city}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setShowEditor(true)}
                      variant="outline"
                      className="w-full text-xs sm:text-sm"
                      size="lg"
                    >
                      <Edit className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Edit
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="w-full text-xs sm:text-sm"
                      size="lg"
                    >
                      {isSaved ? (
                        <>
                          <Check className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                          Saved!
                        </>
                      ) : (
                        <>
                          <Download className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="hidden xs:inline">Download</span>
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="w-full text-xs sm:text-sm"
                      size="lg"
                    >
                      <Share2 className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden xs:inline">Share</span>
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleRetake}
                      variant="outline"
                      className="w-full text-xs sm:text-sm"
                      size="lg"
                    >
                      <RotateCcw className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden xs:inline">Retake</span>
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Done Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleBackToDetails}
                    className="w-full gradient-primary hover:opacity-90 transition-opacity"
                    size="lg"
                  >
                    <Check className="mr-2 h-5 w-5" />
                    Done - {employee ? 'Back to Details' : 'Back to Dashboard'}
                  </Button>
                </motion.div>

                {/* Info Box */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="p-4 rounded-lg bg-muted/50"
                >
                  <p className="text-sm text-muted-foreground text-center">
                    Photo captured on {new Date().toLocaleString()}
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Photo Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <PhotoEditor
            photo={currentPhoto}
            onSave={handlePhotoEdit}
            onCancel={() => setShowEditor(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default PhotoResultPage

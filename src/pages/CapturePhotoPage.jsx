import { useRef, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Webcam from 'react-webcam'
import { Camera, RotateCcw, Check, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'

const CapturePhotoPage = () => {
  const webcamRef = useRef(null)
  const [imgSrc, setImgSrc] = useState(null)
  const [facingMode, setFacingMode] = useState('user')
  const navigate = useNavigate()
  const location = useLocation()
  const employee = location.state?.employee

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode,
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImgSrc(imageSrc)
    toast.success('Photo captured successfully!')
  }, [webcamRef])

  const retake = () => {
    setImgSrc(null)
    toast.info('Ready to capture again')
  }

  const switchCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user')
    toast.success(`Switched to ${facingMode === 'user' ? 'back' : 'front'} camera`)
  }

  const handleConfirm = () => {
    toast.success('Photo confirmed!')
    navigate('/photo-result', { 
      state: { 
        photo: imgSrc,
        employee: employee 
      } 
    })
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
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-xs sm:text-sm">
            <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Back
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
                <Camera className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Capture Photo
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {employee ? `Taking photo for ${employee.name}` : 'Capture employee photo'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {/* Camera/Photo Display */}
                <motion.div
                  className="relative rounded-lg overflow-hidden bg-black aspect-video"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {imgSrc ? (
                    <motion.img
                      src={imgSrc}
                      alt="Captured"
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  ) : (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Overlay frame */}
                  {!imgSrc && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-4 border-2 border-white/50 rounded-lg">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  {!imgSrc ? (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={capture}
                          size="lg"
                          className="gradient-primary hover:opacity-90 transition-opacity w-full sm:w-auto"
                        >
                          <Camera className="mr-2 h-5 w-5" />
                          Capture Photo
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={switchCamera}
                          variant="outline"
                          size="lg"
                          className="w-full sm:w-auto"
                        >
                          <RotateCcw className="mr-2 h-5 w-5" />
                          Switch Camera
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleConfirm}
                          size="lg"
                          className="gradient-success hover:opacity-90 transition-opacity w-full sm:w-auto"
                        >
                          <Check className="mr-2 h-5 w-5" />
                          Confirm Photo
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={retake}
                          variant="outline"
                          size="lg"
                          className="w-full sm:w-auto"
                        >
                          <RotateCcw className="mr-2 h-5 w-5" />
                          Retake Photo
                        </Button>
                      </motion.div>
                    </>
                  )}
                </div>

                {/* Instructions */}
                {!imgSrc && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 rounded-lg bg-primary/10 border border-primary/20"
                  >
                    <h3 className="font-semibold mb-2">Photo Tips:</h3>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Ensure good lighting for best results</li>
                      <li>• Position yourself in the center frame</li>
                      <li>• Remove any accessories that might obscure your face</li>
                      <li>• Use the switch camera button to toggle between front and back camera</li>
                    </ul>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default CapturePhotoPage

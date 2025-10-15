import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Crop, RotateCw, Contrast, Sun, Droplet, Download, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const PhotoEditor = ({ photo, onSave, onCancel }) => {
  const canvasRef = useRef(null)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [rotation, setRotation] = useState(0)

  const applyFilters = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = photo

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Apply rotation
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)

      // Apply filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
      ctx.drawImage(img, 0, 0)
      ctx.restore()
    }
  }

  useState(() => {
    applyFilters()
  }, [brightness, contrast, saturation, rotation, photo])

  const handleSave = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const editedPhoto = canvas.toDataURL('image/jpeg', 0.9)
      onSave(editedPhoto)
    }
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const resetFilters = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setRotation(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-4xl">
        <Card className="glass border-white/20">
          <CardHeader>
            <CardTitle>Edit Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Canvas */}
            <div className="relative rounded-lg overflow-hidden bg-black/50 flex items-center justify-center" style={{ minHeight: '400px' }}>
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[500px] object-contain"
              />
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium mb-2">
                  <Sun className="w-4 h-4 mr-2" />
                  Brightness: {brightness}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  onMouseUp={applyFilters}
                  onTouchEnd={applyFilters}
                  className="w-full"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium mb-2">
                  <Contrast className="w-4 h-4 mr-2" />
                  Contrast: {contrast}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  onMouseUp={applyFilters}
                  onTouchEnd={applyFilters}
                  className="w-full"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium mb-2">
                  <Droplet className="w-4 h-4 mr-2" />
                  Saturation: {saturation}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  onMouseUp={applyFilters}
                  onTouchEnd={applyFilters}
                  className="w-full"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleRotate} variant="outline">
                <RotateCw className="w-4 h-4 mr-2" />
                Rotate
              </Button>
              <Button onClick={resetFilters} variant="outline">
                Reset Filters
              </Button>
              <div className="flex-1" />
              <Button onClick={onCancel} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSave} className="gradient-primary">
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

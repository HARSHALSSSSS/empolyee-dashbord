import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, Award, DollarSign, Calendar, MapPin, Briefcase } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

export const EmployeeComparison = ({ employees, onClose }) => {
  const [employee1, setEmployee1] = useState(employees[0]?.id || '')
  const [employee2, setEmployee2] = useState(employees[1]?.id || '')

  const emp1 = employees.find(e => e.id === parseInt(employee1))
  const emp2 = employees.find(e => e.id === parseInt(employee2))

  const ComparisonMetric = ({ icon: Icon, label, value1, value2, isHigherBetter = true }) => {
    let winner = null
    if (typeof value1 === 'number' && typeof value2 === 'number') {
      winner = value1 > value2 ? 1 : value1 < value2 ? 2 : null
      if (!isHigherBetter) winner = winner === 1 ? 2 : winner === 2 ? 1 : null
    }

    return (
      <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
        <div className={`text-center ${winner === 1 ? 'bg-green-500/20 rounded-lg p-2' : ''}`}>
          <p className="text-lg font-bold">{value1}</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Icon className="w-5 h-5 text-primary mb-1" />
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
        <div className={`text-center ${winner === 2 ? 'bg-green-500/20 rounded-lg p-2' : ''}`}>
          <p className="text-lg font-bold">{value2}</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="glass border-white/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Compare Employees</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Employee Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Employee 1</label>
                <Select value={employee1} onChange={(e) => setEmployee1(e.target.value)}>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Employee 2</label>
                <Select value={employee2} onChange={(e) => setEmployee2(e.target.value)}>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </Select>
              </div>
            </div>

            {emp1 && emp2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Profile Headers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="glass">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
                          {emp1.name?.charAt(0)}
                        </div>
                        <h3 className="font-bold text-lg">{emp1.name}</h3>
                        <Badge variant="secondary" className="mt-2">{emp1.department}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="glass">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full gradient-secondary flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
                          {emp2.name?.charAt(0)}
                        </div>
                        <h3 className="font-bold text-lg">{emp2.name}</h3>
                        <Badge variant="secondary" className="mt-2">{emp2.department}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Comparison Metrics */}
                <div className="space-y-3">
                  <ComparisonMetric
                    icon={DollarSign}
                    label="Salary"
                    value1={formatCurrency(emp1.salary)}
                    value2={formatCurrency(emp2.salary)}
                    isHigherBetter={true}
                  />
                  <ComparisonMetric
                    icon={Award}
                    label="Experience"
                    value1={`${emp1.experience}y`}
                    value2={`${emp2.experience}y`}
                    isHigherBetter={true}
                  />
                  <ComparisonMetric
                    icon={MapPin}
                    label="Location"
                    value1={emp1.city}
                    value2={emp2.city}
                  />
                  <ComparisonMetric
                    icon={Briefcase}
                    label="Department"
                    value1={emp1.department}
                    value2={emp2.department}
                  />
                  <ComparisonMetric
                    icon={Calendar}
                    label="Join Year"
                    value1={new Date(emp1.joinDate).getFullYear()}
                    value2={new Date(emp2.joinDate).getFullYear()}
                    isHigherBetter={false}
                  />
                </div>

                {/* Summary */}
                <Card className="glass bg-primary/10">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <p className="text-sm font-medium">
                        {emp1.salary > emp2.salary
                          ? `${emp1.name} earns ${formatCurrency(emp1.salary - emp2.salary)} more`
                          : emp2.salary > emp1.salary
                          ? `${emp2.name} earns ${formatCurrency(emp2.salary - emp1.salary)} more`
                          : 'Both employees have equal salaries'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

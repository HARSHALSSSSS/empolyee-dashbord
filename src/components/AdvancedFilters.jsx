import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, X, Download, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const AdvancedFilters = ({ employees, onFilterChange, onExport }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    department: '',
    city: '',
    minSalary: '',
    maxSalary: '',
    minExperience: '',
    maxExperience: '',
  })

  const departments = [...new Set(employees.map(e => e.department))].filter(Boolean)
  const cities = [...new Set(employees.map(e => e.city))].filter(Boolean)

  const applyFilters = () => {
    let filtered = [...employees]

    if (filters.department) {
      filtered = filtered.filter(e => e.department === filters.department)
    }
    if (filters.city) {
      filtered = filtered.filter(e => e.city === filters.city)
    }
    if (filters.minSalary) {
      filtered = filtered.filter(e => e.salary >= parseInt(filters.minSalary))
    }
    if (filters.maxSalary) {
      filtered = filtered.filter(e => e.salary <= parseInt(filters.maxSalary))
    }
    if (filters.minExperience) {
      filtered = filtered.filter(e => e.experience >= parseInt(filters.minExperience))
    }
    if (filters.maxExperience) {
      filtered = filtered.filter(e => e.experience <= parseInt(filters.maxExperience))
    }

    onFilterChange(filtered)
    setIsOpen(false)
  }

  const resetFilters = () => {
    setFilters({
      department: '',
      city: '',
      minSalary: '',
      maxSalary: '',
      minExperience: '',
      maxExperience: '',
    })
    onFilterChange(employees)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(20)
    doc.text('Employee Directory', 14, 22)
    
    // Date
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32)
    
    // Table
    const tableData = employees.map(emp => [
      emp.name,
      emp.email,
      emp.department,
      emp.city,
      `₹${emp.salary.toLocaleString()}`,
      `${emp.experience}y`,
    ])
    
    autoTable(doc, {
      head: [['Name', 'Email', 'Department', 'City', 'Salary', 'Experience']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [139, 92, 246] },
    })
    
    doc.save('employees.pdf')
  }

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Department', 'City', 'Salary', 'Experience', 'Join Date']
    const csvData = employees.map(emp => [
      emp.name,
      emp.email,
      emp.department,
      emp.city,
      emp.salary,
      emp.experience,
      emp.joinDate,
    ])
    
    const csv = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'employees.csv'
    a.click()
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
          {activeFiltersCount > 0 && (
            <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <Card className="glass border-white/20 mt-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Filter Employees</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Department</label>
                  <Select
                    value={filters.department}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">City</label>
                  <Select
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Min Salary</label>
                  <Input
                    type="number"
                    placeholder="e.g. 30000"
                    value={filters.minSalary}
                    onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Max Salary</label>
                  <Input
                    type="number"
                    placeholder="e.g. 100000"
                    value={filters.maxSalary}
                    onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Min Experience</label>
                  <Input
                    type="number"
                    placeholder="e.g. 2"
                    value={filters.minExperience}
                    onChange={(e) => setFilters({ ...filters, minExperience: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Max Experience</label>
                  <Input
                    type="number"
                    placeholder="e.g. 10"
                    value={filters.maxExperience}
                    onChange={(e) => setFilters({ ...filters, maxExperience: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button onClick={applyFilters} className="gradient-primary">
                  <Filter className="w-4 h-4 mr-2" />
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </>
  )
}

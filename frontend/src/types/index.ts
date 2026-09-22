export type Employee = {
  id: string
  firstName: string
  lastName: string
  email: string
  department: string
  salary: number
  country: string
  createdAt: string
}

export type AnalyticsData = {
  byDepartment: { department: string, avgSalary: number, count: number }[]
  byCountry: { country: string, avgSalary: number, count: number }[]
}

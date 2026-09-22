import { apiClient } from '../lib/apiClient'
import { Employee, AnalyticsData } from '../types'

export const api = {
  employees: {
    fetch: async (page: number, limit: number, search?: string) => {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : ''
      const res = await apiClient.get<{ success: boolean; data: { data: Employee[]; meta: any }; message: string }>(
        `/employees?page=${page}&limit=${limit}${searchParam}`
      )
      return res.data.data
    },

    create: async (data: Omit<Employee, 'id' | 'createdAt'>) => {
      const res = await apiClient.post<{ success: boolean; data: Employee; message: string }>(
        '/employees',
        data
      )
      return res.data.data
    },

    updateSalary: async (id: string | number, salary: number) => {
      const res = await apiClient.put<{ success: boolean; data: Employee; message: string }>(
        `/employees/${id}`,
        { salary }
      )
      return res.data.data
    }
  },
  
  analytics: {
    fetch: async (search?: string) => {
      const searchParam = search ? `?search=${encodeURIComponent(search)}` : ''
      const res = await apiClient.get<{ success: boolean; data: AnalyticsData; message: string }>(
        `/analytics${searchParam}`
      )
      return res.data.data
    }
  }
}

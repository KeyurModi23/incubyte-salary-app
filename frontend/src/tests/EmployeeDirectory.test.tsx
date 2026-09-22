/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { EmployeeDirectory } from '../components/dashboard/EmployeeDirectory'
import { Employee } from '@/types'

// Mock ResizeObserver for react-virtual
beforeAll(() => {
  vi.stubGlobal('ResizeObserver', class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  })
})

vi.mock('@tanstack/react-virtual', async (importOriginal) => {
  const actual = await importOriginal() as typeof import('@tanstack/react-virtual')
  return {
    ...actual,
    useVirtualizer: () => ({
      getVirtualItems: () => [
        { index: 0, start: 0, size: 64 } // Mock rendering the first item
      ],
      getTotalSize: () => 6400,
      measureElement: vi.fn(),
    })
  }
})

describe('EmployeeDirectory Component', () => {
  const mockEmployees: Employee[] = [
    {
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      department: 'Engineering',
      salary: 100000,
      country: 'USA',
      createdAt: new Date().toISOString()
    }
  ]

  it('renders a loading skeleton when loading is true and no employees', () => {
    const { container } = render(
      <EmployeeDirectory 
        employees={[]} 
        loading={true} 
        searchQuery="" 
        setSearchQuery={() => {}} 
        onRefresh={() => {}} 
        fetchNextPage={() => {}} 
        isFetchingNextPage={false} 
      />
    )
    
    // We expect the skeletons to render (they use the skeleton class)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders the empty state when no employees found', () => {
    render(
      <EmployeeDirectory 
        employees={[]} 
        loading={false} 
        searchQuery="NonexistentUser" 
        setSearchQuery={() => {}} 
        onRefresh={() => {}} 
        fetchNextPage={() => {}} 
        isFetchingNextPage={false} 
      />
    )
    
    expect(screen.getByText('No employees found.')).toBeInTheDocument()
  })

  it('renders the employee list', () => {
    render(
      <EmployeeDirectory 
        employees={mockEmployees} 
        loading={false} 
        searchQuery="" 
        setSearchQuery={() => {}} 
        onRefresh={() => {}} 
        fetchNextPage={() => {}} 
        isFetchingNextPage={false} 
      />
    )
    
    // Table Headers
    expect(screen.getAllByText('Employee').length).toBeGreaterThan(0)
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getAllByText('test@example.com').length).toBeGreaterThan(0)
  })
})

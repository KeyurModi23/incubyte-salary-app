/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { QuickStats } from '../components/dashboard/QuickStats'

describe('QuickStats Component', () => {
  it('renders a skeleton when loading is true and total is 0', () => {
    render(<QuickStats total={0} loading={true} />)
    
    // The skeleton does not have text, but we can verify Total Employees label is present
    expect(screen.getByText('Total Employees')).toBeInTheDocument()
    // The total text should not be present
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('renders the total count when loading is false', () => {
    render(<QuickStats total={15000} loading={false} />)
    
    expect(screen.getByText('Total Employees')).toBeInTheDocument()
    // format should be localized e.g. "15,000"
    expect(screen.getByText('15,000')).toBeInTheDocument()
  })
})

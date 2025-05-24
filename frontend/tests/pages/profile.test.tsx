// tests/pages/Profile.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor   } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Profile from '../../src/pages/profile'  // adjust if your filename is different

// 1) Stub out context providers entirely
vi.mock('@/context/activityContext', () => ({
  ActivityProvider: ({ children }: any) => <>{children}</>,
}))
vi.mock('@/context/activityTypeContext', () => ({
  ActivityTypesProvider: ({ children }: any) => <>{children}</>,
}))

// 2) Mock the hooks via the exact same alias your component imports
vi.mock('@/hooks/useUser', () => ({
  useUser: vi.fn(() => ({ name: 'John Doe', avatar: 'avatar.png' })),
}))
vi.mock('@/hooks/useUserProfilel', () => ({
  useUserProfile: vi.fn(() => ({
    level: 5,
    xp: 500,
    achievements: [
      { name: 'Achievement 1' },
      { name: 'Achievement 2' },
    ],
  })),
}))
vi.mock('@/hooks/useActivities', () => ({
  useActivities: vi.fn(() => ({
    activities: [
      { id: '1', title: 'Activity 1', description: 'Some description' },
      { id: '2', title: 'Activity 2', description: 'Another one' },
    ],
    hasMoreActivities: true,
    loadMoreActivities: vi.fn(),
  })),
}))
vi.mock('@/hooks/useHistory', () => ({
  useHistory: vi.fn(() => ({
    historyDisplayed: [
      { id: '3', title: 'History 1', description: 'Historic data' },
    ],
    hasMoreHistory: true,
    loadMoreHistory: vi.fn(),
  })),
}))

// 3) Stub any UI components that drag in real libs
vi.mock('@/components/ui/header', () => ({ default: () => <div data-testid="header">Header</div> }))
vi.mock('@/components/ui/button', () => ({ Button: (props: any) => <button {...props}>{props.children}</button> }))
vi.mock('@/components/ui/activityModal', () => ({
  default: ({ activityId, onClose }: any) => (
    <div role="dialog" data-testid="activity-modal">
      <p>Mocked ActivityModal</p>
      <p>Activity ID: {activityId}</p>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}))
vi.mock('@/components/ui/activitySmall', () => ({
  default: ({ id, title, description, onClick }: any) => (
    <div data-testid={`activity-small-${id}`} onClick={onClick}>
      <p>{title}</p>
      <p>{description}</p>
    </div>
  ),
}))
vi.mock('@/components/ui/progress', () => ({ Progress: ({ value }: any) => <div data-testid="progress" data-value={value} /> }))
vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children }: any) => <div data-testid="carousel">{children}</div>,
  CarouselContent: ({ children }: any) => <div data-testid="carousel-content">{children}</div>,
  CarouselItem: ({ children }: any) => <div data-testid="carousel-item">{children}</div>,
  CarouselPrevious: () => <button data-testid="carousel-prev">Prev</button>,
  CarouselNext: () => <button data-testid="carousel-next">Next</button>,
}))


vi.mock('@/api/getActitvities', () => ({ fetchActivities: vi.fn().mockResolvedValue([]) }))
vi.mock('@/api/getActivityType', () => ({ FetchActivitiesTypes: vi.fn().mockResolvedValue([]) }))



const renderPage = () =>
  render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>
  )

describe('Profile Page', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the header', () => {
    renderPage()
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('renders user name and avatar', () => {
    renderPage()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByAltText('Avatar do usuário')).toHaveAttribute('src', 'avatar.png')
  })

  it('renders level, XP and progress bar', () => {
    renderPage()
    expect(screen.getByText('Seu nível é')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('500 / 1000 pts')).toBeInTheDocument()
    expect(screen.getByTestId('progress')).toHaveAttribute('data-value', '50')
  })

  it('renders achievements carousel', () => {
    renderPage()
    expect(screen.getByText('Achievement 1')).toBeInTheDocument()
    expect(screen.getByText('Achievement 2')).toBeInTheDocument()
  })

  it('opens and closes the activity modal', () => {
    renderPage()

    fireEvent.click(screen.getByTestId('activity-small-1'))
    expect(screen.getByTestId('activity-modal')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Close'))
    expect(screen.queryByTestId('activity-modal')).toBeNull()
  })
})

import React from 'react'
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ActivityByTypes from '../../src/pages/activityByType'

vi.mock('../../src/api/getActitvities', () => ({
  fetchActivities: vi.fn(),
}))
import { fetchActivities } from '../../src/api/getActitvities'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom')
  return {
    ...actual,
    useLocation: () => ({ state: { typeId: 'a', name: 'Type A' } }),
  }
})

const navigateMock = vi.fn()
vi.mock('react-router', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('../../src/context/activityTypeContext', () => ({
  useActivityTypesContext: () => ({
    activityTypes: [
      { id: 'a', name: 'Type A', image: 'a.jpg', description: 'Desc A' },
      { id: 'b', name: 'Type B', image: 'b.jpg', description: 'Desc B' },
    ],
  }),
}))

vi.mock('../../src/components/ui/header', () => ({
  default: () => <div data-testid="header">Header</div>,
}))
vi.mock('@/components/ui/activity', () => ({
  default: ({ id, title }: any) => (
    <div data-testid={`activity-${id}`}>{title}</div>
  ),
}))
vi.mock('@/components/ui/activitySmall', () => ({
  default: ({ id, title }: any) => (
    <div data-testid={`small-${id}`}>{title}</div>
  ),
}))
vi.mock('@/components/ui/button', () => ({
  Button: (props: any) => <button {...props}>{props.children}</button>,
}))
vi.mock('../../src/components/ui/activityModal', () => ({
  default: ({ activityId, onClose }: any) => (
    <div role="dialog" data-testid="modal">
      <p>Modal for {activityId}</p>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}))
vi.mock('@/components/ui/category', () => ({
  default: ({ id, name }: any) => (
    <div data-testid={`cat-${id}`}>{name}</div>
  ),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={[{ pathname: '/activityByType', state: { typeId: 'a', name: 'Type A' } }]}>
      <ActivityByTypes />
    </MemoryRouter>
  )

describe('ActivityByTypes Page', () => {
  it('renders header and popular title', async () => {
    ;(fetchActivities as vi.Mock).mockResolvedValueOnce({
      activities: [{ id: '1', title: 'Pop 1' }],
    })

    renderPage()
    await waitFor(() =>
      expect(fetchActivities).toHaveBeenCalledWith({
        pageSize: 8,
        page: 1,
        orderBy: 'createdAt',
        order: 'desc',
        typeId: 'a',
      })
    )
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('POPULAR EM TYPE A')).toBeInTheDocument()
    expect(screen.getByTestId('activity-1')).toBeInTheDocument()
  })

  it('renders all activities and load‑more button', async () => {
    (fetchActivities as vi.Mock).mockResolvedValueOnce({
      activities: [
        { id: '1', title: 'Act 1' },
        { id: '2', title: 'Act 2' },
        { id: '3', title: 'Act 3' },
        { id: '4', title: 'Act 4' },
        { id: '5', title: 'Act 5' },
        { id: '6', title: 'Act 6' },
        { id: '7', title: 'Act 7' },
        { id: '8', title: 'Act 8' },
      ],
    });
  
    (fetchActivities as vi.Mock).mockResolvedValueOnce({
      activities: [{ id: '9', title: 'Act 9' }],
    });
  
    renderPage();
  
    await waitFor(() => expect(fetchActivities).toHaveBeenCalledTimes(1));
  
    expect(screen.getByTestId('small-1')).toBeInTheDocument();
    expect(screen.getByTestId('small-2')).toBeInTheDocument();
    expect(screen.getByTestId('small-8')).toBeInTheDocument();
  
    const btn = screen.getByRole('button', { name: /Ver mais/i });
    expect(btn).toBeInTheDocument();
  
    fireEvent.click(btn);
  
    await waitFor(() =>
      expect(fetchActivities).toHaveBeenCalledWith({
        pageSize: 8,
        page: 2,
        orderBy: 'createdAt',
        order: 'desc',
        typeId: 'a',
      })
    );
  
    expect(screen.getByTestId('small-9')).toBeInTheDocument();
  });

  it('renders other categories and navigates', async () => {
    ;(fetchActivities as vi.Mock).mockResolvedValueOnce({ activities: [] })

    renderPage()
    await waitFor(() =>
      expect(fetchActivities).toHaveBeenCalled()
    )

    expect(screen.queryByTestId('cat-a')).toBeNull()
    const catB = screen.getByTestId('cat-b')
    expect(catB).toBeInTheDocument()

    fireEvent.click(catB)
    expect(navigateMock).toHaveBeenCalledWith('/activityByType', {
      state: { typeId: 'b', name: 'Type B' },
    })
  })

  it('opens and closes the modal when an activity is clicked', async () => {
    ;(fetchActivities as vi.Mock).mockResolvedValueOnce({
      activities: [{ id: '1', title: 'Act 1' }],
    })

    renderPage()
    await waitFor(() =>
      expect(fetchActivities).toHaveBeenCalled()
    )

    fireEvent.click(screen.getByTestId('activity-1'))
    expect(screen.getByTestId('modal')).toHaveTextContent('Modal for 1')

    fireEvent.click(screen.getByText('Close'))
    expect(screen.queryByTestId('modal')).toBeNull()
  })
})

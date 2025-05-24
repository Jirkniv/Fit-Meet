import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Preferences } from '../../src/components/ui/preferences'
import { getUserPreferences } from '../../src/api/getUserPrefereces'

vi.mock('@/components/ui/dialog', () => ({
  Dialog:    ({ children }: any) => <div>{children}</div>,
  DialogTrigger: ({ children }: any) => children,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader:  ({ children }: any) => <div>{children}</div>,
  DialogTitle:   ({ children }: any) => <h1>{children}</h1>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogFooter:  ({ children }: any) => <div>{children}</div>,
  DialogClose:   ({ children }: any) => <span>{children}</span>,
}))

vi.mock('@/context/activityTypeContext', () => ({
    useActivityTypesContext: () => ({
      activityTypes: [
        { id: 'a', name: 'Type A', image: 'a.jpg', description: 'Desc A' },
        { id: 'b', name: 'Type B', image: 'b.jpg', description: 'Desc B' },
      ],
    }),
  }));

vi.mock('@/components/ui/category', () => ({
    default: (props: any) => (
      <div data-testid={`cat-${props.id}`}>
        {props.name} {props.selected ? '[selected]' : ''}
      </div>
    ),
  }));

  vi.mock('@/api/getUserPrefereces', () => ({
    getUserPreferences: vi.fn(),
  }));
  
  vi.mock('@/api/postUserPreferences', () => ({
    defineUserPreferences: vi.fn(),
  }));



describe('Preferences Component', () => {
  const token = 'tok123'
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('token', token)
  })

  it('opens the dialog when no preferences are returned', async () => {
    ;(getUserPreferences as vi.Mock).mockResolvedValueOnce([])
    render(<Preferences />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /SELECIONE AS SUAS ATIVIDADES PREFERIDAS/i })).toBeInTheDocument()
    })
  })


  it('toggles a preference when a category is clicked', async () => {
    ;(getUserPreferences as vi.Mock).mockResolvedValueOnce([])
    render(<Preferences />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /SELECIONE AS SUAS ATIVIDADES PREFERIDAS/i })).toBeInTheDocument()
    })

    const catA = screen.getByTestId('cat-a')
    expect(catA).toHaveTextContent('Type A')

    fireEvent.click(catA)
    expect(catA).toHaveTextContent('Type A [selected]')

    fireEvent.click(catA)
    expect(catA).toHaveTextContent('Type A')
  })


})


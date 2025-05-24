import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi, beforeEach, describe, it, expect } from 'vitest'
import CustomInput from '../../src/components/ui/CustomInput'


vi.mock('../../src/hooks/useUser', () => ({
  useUser: vi.fn(),
}))

vi.mock('../../src/api/getUser', () => ({
  FetchUser: vi.fn(),
}))

vi.mock('../../src/api/putUserAvatar', () => ({
  handleUpdateAvatar: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router', async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...mod,
    useNavigate: () => mockNavigate,
  }
})

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('CustomInput Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the form fields for login', () => {
    renderWithRouter(<CustomInput fields={['email', 'password', 'login']} />)

    expect(screen.getByPlaceholderText('Ex: junior@gmail.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ex: junior123')).toBeInTheDocument()
    expect(screen.getByText('Entrar')).toBeInTheDocument()
  })

  it('renders the form fields for registration', () => {
    renderWithRouter(<CustomInput fields={['email', 'password', 'name', 'cpf', 'register']} />)

    expect(screen.getByPlaceholderText('Ex: junior@gmail.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ex: junior123')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ex: Jober Junior...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ex: 123.456.789-10')).toBeInTheDocument()
    expect(screen.getByText('Cadastrar')).toBeInTheDocument()
  })

  it('renders the form fields for profile update', async () => {
    const mockUser = {
      avatar: 'avatar-url',
      token: 'mock-token',
      userId: 'mock-user-id',
    }
    const mockFetchedUser = {
      email: 'test@example.com',
      name: 'Test User',
      cpf: '123.456.789-10',
    }

    const { useUser } = await import('../../src/hooks/useUser')
    ;(useUser as vi.Mock).mockReturnValue(mockUser)
    const { FetchUser } = await import('../../src/api/getUser')
    ;(FetchUser as vi.Mock).mockResolvedValue(mockFetchedUser)

    renderWithRouter(<CustomInput fields={['email', 'password', 'name', 'cpf', 'update']} />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Ex: junior@gmail.com')).toHaveValue(mockFetchedUser.email)
      expect(screen.getByPlaceholderText('Ex: Jober Junior...')).toHaveValue(mockFetchedUser.name)
      expect(screen.getByPlaceholderText('Ex: 123.456.789-10')).toHaveValue(mockFetchedUser.cpf)
    })

    expect(screen.getByText('Editar')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })

  it('toggles password visibility', () => {
    renderWithRouter(<CustomInput fields={['password', 'login']} />)
    const passwordInput = screen.getByPlaceholderText('Ex: junior123')

    expect(passwordInput).toHaveAttribute('type', 'password')


    const toggleButton = screen.getByLabelText('Show password');
  fireEvent.click(toggleButton);

  expect(passwordInput).toHaveAttribute('type', 'text');

  expect(toggleButton).toHaveAttribute('aria-label', 'Hide password');

  fireEvent.click(toggleButton);

  expect(passwordInput).toHaveAttribute('type', 'password');
});

  it('calls the submit handler for login', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        token: 'mock-token',
        id: 'mock-id',
        name: 'Mock User',
        level: 1,
        avatar: 'mock-avatar',
      }),
    }) as any

    renderWithRouter(<CustomInput fields={['email', 'password', 'login']} />)

    fireEvent.change(screen.getByPlaceholderText('Ex: junior@gmail.com'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Ex: junior123'), { target: { value: 'password123' } })

    fireEvent.click(screen.getByText('Entrar'))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home')
    })
  })

  it('calls the submit handler for registration', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Registration successful' }),
    }) as any

    renderWithRouter(<CustomInput fields={['email', 'password', 'name', 'cpf', 'register']} />)

    fireEvent.change(screen.getByPlaceholderText('Ex: junior@gmail.com'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Ex: junior123'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByPlaceholderText('Ex: Jober Junior...'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByPlaceholderText('Ex: 123.456.789-10'), { target: { value: '123.456.789-10' } })

    fireEvent.click(screen.getByText('Cadastrar'))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})

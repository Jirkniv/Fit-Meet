import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Register from '../../src/pages/register'
import React from 'react'

vi.mock('@/components/ui/logo', () => ({
  default: () => <div data-testid="logo-mock">Logo</div>,
}))

vi.mock('@/components/ui/CustomInput', () => ({
  default: ({ fields }: { fields: string[] }) => (
    <div data-testid="custom-input-mock">{fields.join(', ')}</div>
  ),
}))

vi.mock('../assets/images/loginBg.png', () => 'loginBg.png')

const renderRegister = () => {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  )
}

describe('Register page', () => {
  it('renders the  background correctly', () => {
    renderRegister()
    const bgImage = screen.getByAltText('Background') as HTMLImageElement
    expect(bgImage).toBeInTheDocument()
    expect(bgImage.src).toContain('loginBg.png')
  })

  it('renders the logo', () => {
    renderRegister()
    expect(screen.getByTestId('logo-mock')).toBeInTheDocument()
  })

  it('renders the main texts', () => {
    renderRegister()
    expect(screen.getByText('CRIE SUA CONTA')).toBeInTheDocument()
    expect(screen.getByText(/Cadastre-se para encontrar parceiros de treino/i)).toBeInTheDocument()
  })

  it('renders CustomInput with the correct fields', () => {
    renderRegister()
    const customInput = screen.getByTestId('custom-input-mock')
    expect(customInput).toBeInTheDocument()
    expect(customInput).toHaveTextContent('name, cpf, email, password, register')
  })

  it('has a link to login', () => {
    renderRegister()
    const link = screen.getByRole('link', { name: /faça login/i })
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('href')).toBe('/')
  })
})

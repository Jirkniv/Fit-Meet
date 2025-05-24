import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Login from '../../src/pages/login'
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

const renderLogin = () => {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
}

describe('Login page', () => {
  it('renderiza o background corretamente', () => {
    renderLogin()
    const bgImage = screen.getByAltText('Background') as HTMLImageElement
    expect(bgImage).toBeInTheDocument()
    expect(bgImage.src).toContain('loginBg.png')
  })

  it('renderiza o logo', () => {
    renderLogin()
    expect(screen.getByTestId('logo-mock')).toBeInTheDocument()
  })

  it('renderiza os textos principais', () => {
    renderLogin()

    expect(screen.getByText('BEM-VINDO DE VOLTA!')).toBeInTheDocument()
    expect(screen.getByText(/Encontre parceiros para treinar/i)).toBeInTheDocument()
    expect(screen.getByText(/Conecte-se e comece agora!/i)).toBeInTheDocument()
  })

  it('renderiza o CustomInput com os campos corretos', () => {
    renderLogin()
    const customInput = screen.getByTestId('custom-input-mock')
    expect(customInput).toBeInTheDocument()
    expect(customInput).toHaveTextContent('email, password, login')
  })

  it('possui link para cadastro', () => {
    renderLogin()
    const link = screen.getByRole('link', { name: /cadastre-se/i })
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('href')).toBe('/register')
  })
})

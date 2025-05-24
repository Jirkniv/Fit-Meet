import { render, screen } from '@testing-library/react'
import { describe, it, expect , vi} from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import UpdatePerfil from '../../src/pages/UpdatePerfil'
import React from 'react'

vi.mock('@/components/ui/CustomInput', () => ({
  default: ({ fields }: { fields: string[] }) => (
    <div data-testid="custom-input-mock">{fields.join(', ')}</div>
  ),
}))

vi.mock('@/components/ui/deactivate', () => ({
  Deactivate: () => <div data-testid="deactivate-mock">Deactivate Component</div>,
}))

vi.mock('@/components/ui/header', () => ({
  default: () => <div data-testid="header-mock">Header</div>,
}))

// Testes
describe('UpdatePerfil page', () => {
    const renderPage = () =>
        render(
          <MemoryRouter initialEntries={['/my-app/profile/update']}>
            <Routes>
              <Route path="/my-app/profile/update" element={<UpdatePerfil />} />
            </Routes>
          </MemoryRouter>
        )

  it('renders Header correctly', () => {
    renderPage()
    expect(screen.getByTestId('header-mock')).toBeInTheDocument()
  })

  it('renders go back link with the icon', () => {
    renderPage()
    const link = screen.getByRole('link', { name: /voltar para o perfil/i })
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('href')).toBe('/profile')
  })

  it('renders CustomInput with the expected fields', () => {
    renderPage()
    const input = screen.getByTestId('custom-input-mock')
    expect(input).toBeInTheDocument()
    expect(input).toHaveTextContent('email, password, name, cpf, update, avatar')
  })

  it('remders the Deactivate component', () => {
    renderPage()
    expect(screen.getByTestId('deactivate-mock')).toBeInTheDocument()
  })
})

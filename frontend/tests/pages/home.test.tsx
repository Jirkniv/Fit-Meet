import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../../src/pages/Home";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { toBeInTheDocument } from '@testing-library/jest-dom';
vi.mock('@/components/ui/activity', () => ({
  default: ({ name }: any) => <div data-testid="Activity">{name}</div>,
}));
vi.mock('@/components/ui/category', () => ({
  default: ({ name }: any) => <div data-testid="Category">{name}</div>,
}));
vi.mock('@/components/ui/activitySmall', () => ({
  default: ({ name }: any) => <div data-testid="ActivitySmall">{name}</div>,
}));
vi.mock('@/components/ui/header', () => ({
  default: () => <div data-testid="Header">Header</div>,
}));
vi.mock('@/components/ui/preferences', () => ({
  Preferences: () => <div data-testid="Preferences">Preferences</div>,
}));
vi.mock('@/components/ui/activityModal', () => ({
  default: ({ activityData }: any) => (
    <div data-testid="ActivityModal">{activityData.name}</div>
  ),
}));

vi.mock("react-router", async () => {
  const actual: any = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('@/context/activityContext', () => ({
  useActivityContext: vi.fn(),
}));

vi.mock('@/context/activityTypeContext', () => ({
  useActivityTypesContext: vi.fn(),
}));

import { Routes, Route } from 'react-router-dom';

render(<Home />, {
  wrapper: ({ children }) => (
    <BrowserRouter basename="/my-app">
      <Routes>
        <Route path="/" element={children} />
      </Routes>
    </BrowserRouter>
  ),
});

import { useActivityContext } from '../../src/context/activityContext';
import { useActivityTypesContext } from '../../src/context/activityTypeContext';

describe("Home page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders load message", () => {
    (useActivityContext as any).mockReturnValue({
      activities: [],
      loading: true,
      error: null,
    });

    (useActivityTypesContext as any).mockReturnValue({
      activityTypes: [],
      loading: false,
      error: null,
    });

    render(<Home />, { wrapper: BrowserRouter });

    expect(screen.getByText("Carregando atividades...")).toBeInTheDocument();
  });

  it("renders error message", () => {
    (useActivityContext as any).mockReturnValue({
      activities: [],
      loading: false,
      error: "Erro ao carregar",
    });

    (useActivityTypesContext as any).mockReturnValue({
      activityTypes: [],
      loading: false,
      error: null,
    });

    render(<Home />, { wrapper: BrowserRouter });

    expect(screen.getByText("Erro ao carregar atividades: Erro ao carregar")).toBeInTheDocument();
  });

  it("renders data correctly", () => {
    (useActivityContext as any).mockReturnValue({
      activities: [
        { id: "1", name: "Atividade 1", type: "Tipo A" },
        { id: "2", name: "Atividade 2", type: "Tipo B" },
      ],
      loading: false,
      error: null,
    });

    (useActivityTypesContext as any).mockReturnValue({
      activityTypes: [
        { id: "a", name: "Tipo A", image: "", description: "" },
        { id: "b", name: "Tipo B", image: "", description: "" },
      ],
      loading: false,
      error: null,
    });

    render(<Home />, { wrapper: BrowserRouter });

    expect(screen.getByTestId("Header")).toBeInTheDocument();
    expect(screen.getByTestId("Preferences")).toBeInTheDocument();

    expect(screen.getAllByTestId("Activity").length).toBe(2);

    expect(screen.getAllByTestId("Category").length).toBe(2);

    expect(screen.getAllByTestId("ActivitySmall").length).toBeGreaterThan(0);
  });
});

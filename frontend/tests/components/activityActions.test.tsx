import { vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

import ActivityActions from "../../src/components/ui/activityActions";


describe("ActivityActions Component", () => {
    const defaultProps = {
        activityId: "1",
        isCreator: false,
        isSubscribed: false,
        isConfirmed: false,
        subscriptionStatus: "",
        timeLeft: 60,
        updateLoading: false,
        confirmationCode: "",
        deletedAt: null,
        completedAt: null,
        onSubscribe: vi.fn(),
        onUnsubscribe: vi.fn(),
        onCheckIn: vi.fn(),
        onConclude: vi.fn(),
    };

    it("renders EditActivityModal when user is creator and timeLeft > 30", () => {
        render(<ActivityActions {...defaultProps} isCreator={true} timeLeft={60} />);
        expect(screen.getByText(/Editar Atividade/i)).toBeInTheDocument();
    });

    it("renders 'Atividade cancelada' button when deletedAt is not null", () => {
        render(<ActivityActions {...defaultProps} deletedAt="2023-01-01" />);
        expect(screen.getByText(/Atividade cancelada/i)).toBeInTheDocument();
    });

    it("renders 'Atividade encerrada' button when completedAt is not null", () => {
        render(<ActivityActions {...defaultProps} completedAt="2023-01-01" />);
        expect(screen.getByText(/Atividade encerrada/i)).toBeInTheDocument();
    });

    it("renders 'Inscrição negada' button when subscriptionStatus is REJECTED", () => {
        render(<ActivityActions {...defaultProps} subscriptionStatus="REJECTED" />);
        expect(screen.getByText(/Inscrição negada/i)).toBeInTheDocument();
    });

    it("renders 'Encerrar atividade' button when user is creator and timeLeft <= 30", () => {
        render(<ActivityActions {...defaultProps} isCreator={true} timeLeft={30} />);
        expect(screen.getByText(/Encerrar atividade/i)).toBeInTheDocument();
    });

    it("renders 'Atividade em Andamento' button when timeLeft < 0 and user is not subscribed", () => {
        render(<ActivityActions {...defaultProps} timeLeft={-1} />);
        expect(screen.getByText(/Atividade em Andamento/i)).toBeInTheDocument();
    });

    it("renders 'Aguardando Aprovação' button when subscriptionStatus is WAITING", () => {
        render(<ActivityActions {...defaultProps} subscriptionStatus="WAITING" />);
        expect(screen.getByText(/Aguardando Aprovação/i)).toBeInTheDocument();
    });

    it("renders check-in input and button when user is subscribed and timeLeft <= 30", () => {
        render(
            <ActivityActions
                {...defaultProps}
                isSubscribed={true}
                timeLeft={30}
                subscriptionStatus="APPROVED"
            />
        );
        expect(screen.getByPlaceholderText(/Código de confirmação/i)).toBeInTheDocument();
        expect(screen.getByText(/Confirmar/i)).toBeInTheDocument();
    });

    it("renders 'Desinscrever' button when user is subscribed and subscriptionStatus is APPROVED", () => {
        render(
            <ActivityActions
                {...defaultProps}
                isSubscribed={true}
                subscriptionStatus="APPROVED"
            />
        );
        expect(screen.getByText(/Desinscrever/i)).toBeInTheDocument();
    });

    it("renders 'Participar' button when user is not subscribed", () => {
        render(<ActivityActions {...defaultProps} />);
        expect(screen.getByText(/Participar/i)).toBeInTheDocument();
    });

    it("calls onSubscribe when 'Participar' button is clicked", () => {
        const onSubscribe = vi.fn();
        render(<ActivityActions {...defaultProps} onSubscribe={onSubscribe} />);
        fireEvent.click(screen.getByText(/Participar/i));
        expect(onSubscribe).toHaveBeenCalled();
    });

    it("calls onUnsubscribe when 'Desinscrever' button is clicked", () => {
        const onUnsubscribe = vi.fn();
        render(
            <ActivityActions
                {...defaultProps}
                isSubscribed={true}
                subscriptionStatus="APPROVED"
                onUnsubscribe={onUnsubscribe}
            />
        );
        fireEvent.click(screen.getByText(/Desinscrever/i));
        expect(onUnsubscribe).toHaveBeenCalled();
    });

    it("calls onCheckIn when 'Confirmar' button is clicked", () => {
        const onCheckIn = vi.fn();
        render(
            <ActivityActions
                {...defaultProps}
                isSubscribed={true}
                timeLeft={30}
                subscriptionStatus="APPROVED"
                onCheckIn={onCheckIn}
            />
        );
        const input = screen.getByPlaceholderText(/Código de confirmação/i);
        fireEvent.change(input, { target: { value: "1234" } });
        fireEvent.click(screen.getByText(/Confirmar/i));
        expect(onCheckIn).toHaveBeenCalledWith("1234");
    });

    it("calls onConclude when 'Encerrar atividade' button is clicked", () => {
        const onConclude = vi.fn();
        render(
            <ActivityActions
                {...defaultProps}
                isCreator={true}
                timeLeft={30}
                onConclude={onConclude}
            />
        );
        fireEvent.click(screen.getByText(/Encerrar atividade/i));
        expect(onConclude).toHaveBeenCalled();
    });

    it("disables button 'Encerrar atividade' when updateLoading is true", () => {
        render(
          <ActivityActions
            {...defaultProps}
            isCreator={true}
            timeLeft={10}
            updateLoading={true}
          />
        );
      
        const button = screen.getByRole("button", { name: /encerrar atividade/i });
        expect(button).toBeDisabled();
      });

      it("calls onCheckIn with the correct code", () => {
        const mockOnCheckIn = vi.fn();
        render(
          <ActivityActions
            {...defaultProps}
            isSubscribed={true}
            timeLeft={10}
            onCheckIn={mockOnCheckIn}
          />
        );
      
        const input = screen.getByPlaceholderText(/código de confirmação/i);
        const button = screen.getByRole("button", { name: /confirmar/i });
      
        fireEvent.change(input, { target: { value: "ABC123" } });
        fireEvent.click(button);
      
        expect(mockOnCheckIn).toHaveBeenCalledWith("ABC123");
      });
      

});
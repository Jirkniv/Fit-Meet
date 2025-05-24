import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

import Participant from '../../src/components/ui/participant';


describe('Participant Component', () => {
    const mockProps = {
      name: 'John Doe',
      avatar: 'http://localhost:4566/bootcamp/1744771691440default-avatar.jpg',
      level: 5,
      id: '123',
      organizer: true,
    };
  
    it('renders the participant name', () => {
      render(<Participant {...mockProps} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  
    it('renders avatar image or fallback', async () => {
      render(<Participant {...mockProps} />);
      
      const avatarImage = screen.queryByRole('img');
    
      if (avatarImage) {
        expect(avatarImage).toHaveAttribute('src', mockProps.avatar);
      } else {
        const fallback = screen.getByText('OFF');
        expect(fallback).toBeInTheDocument();
      }
    });
  
    it('renders the participant level', () => {
      render(<Participant {...mockProps} />);
      expect(screen.getByText(mockProps.level.toString())).toBeInTheDocument();
    });
  
    it('renders "Organizador" text if organizer is true', () => {
      render(<Participant {...mockProps} />);
      expect(screen.getByText('Organizador')).toBeInTheDocument();
    });
  
    it('does not render "Organizador" text if organizer is false', () => {
      render(<Participant {...mockProps} organizer={false} />);
      expect(screen.queryByText('Organizador')).not.toBeInTheDocument();
    });
  });
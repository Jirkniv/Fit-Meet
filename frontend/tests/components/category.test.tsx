import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

import Category from '../../src/components/ui/category';


describe('Category Component', () => {
    const mockProps = {
      name: 'Test Category',
      image: 'test-image.jpg',
    };
  
    it('should render the category name', () => {
      render(<Category {...mockProps} />);
      const categoryName = screen.getByText('Test Category');
      expect(categoryName).toBeInTheDocument();
    });
  
    it('should render the category image with correct src and alt attributes', () => {
      render(<Category {...mockProps} />);
      const categoryImage = screen.getByAltText('Imagem da Categoria');
      expect(categoryImage).toBeInTheDocument();
      expect(categoryImage).toHaveAttribute('src', 'test-image.jpg');
    });
  
    it('should apply default styles and classes', () => {
      render(<Category {...mockProps} />);
      const categoryText = screen.getByText('Test Category');
      const container = categoryText.parentElement?.parentElement; 
      expect(container).toHaveClass(
        'flex flex-col items-center justify-center h-30.5 w-22.5 bg-white rounded-lg overflow-hidden gap-3'
      );
    });
    
  });
  
  
  
  
  
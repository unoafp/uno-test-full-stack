import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
  const defaultProps = {
    id: '1',
    url: 'http://example.com/image.jpg',
    isFlipped: false,
    isMatched: false,
    onClick: vi.fn(),
  };

  it('renders the card with question mark when not flipped or matched', () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText('?')).toBeInTheDocument();
    expect(screen.queryByAltText('card')).not.toBeInTheDocument();
  });

  it('renders the image when flipped', () => {
    render(<Card {...defaultProps} isFlipped={true} />);
    const img = screen.getByAltText('card');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'http://example.com/image.jpg');
  });

  it('renders the image when matched', () => {
    render(<Card {...defaultProps} isMatched={true} />);
    const img = screen.getByAltText('card');
    expect(img).toBeInTheDocument();
  });

  it('calls onClick when clicked and not flipped or matched', () => {
    const mockOnClick = vi.fn();
    render(<Card {...defaultProps} onClick={mockOnClick} />);
    const card = screen.getByText('?').parentElement;
    fireEvent.click(card!);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when flipped', () => {
    const mockOnClick = vi.fn();
    render(<Card {...defaultProps} onClick={mockOnClick} isFlipped={true} />);
    const card = screen.getByAltText('card').parentElement?.parentElement;
    fireEvent.click(card!);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when matched', () => {
    const mockOnClick = vi.fn();
    render(<Card {...defaultProps} onClick={mockOnClick} isMatched={true} />);
    const card = screen.getByAltText('card').parentElement?.parentElement;
    fireEvent.click(card!);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('has correct classes for flipped state', () => {
    render(<Card {...defaultProps} isFlipped={true} />);
    const card = screen.getByAltText('card').parentElement;
    expect(card).toHaveClass('bg-white');
  });

  it('has correct classes for not flipped state', () => {
    render(<Card {...defaultProps} />);
    const card = screen.getByText('?').parentElement;
    expect(card).toHaveClass('bg-blue-600');
  });
});
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders different variants', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByText('Delete')).toHaveClass('bg-destructive');

    rerender(<Button variant="outline">Cancel</Button>);
    expect(screen.getByText('Cancel')).toHaveClass('border');
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled Button</Button>);
    expect(screen.getByText('Disabled Button')).toBeDisabled();
  });

  it('renders different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText('Small')).toHaveClass('h-9');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText('Large')).toHaveClass('h-11');
  });
});

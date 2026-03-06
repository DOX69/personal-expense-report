import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header', () => {
    it('renders the search input with correct placeholder', () => {
        render(<Header />);
        expect(screen.getByPlaceholderText('Search transactions...')).toBeInTheDocument();
    });

    it('renders the notification bell button', () => {
        render(<Header />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });
});

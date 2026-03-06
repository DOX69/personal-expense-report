import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar';

// Mock next/link since we're outside Next.js context
jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    );
});

describe('Sidebar', () => {
    const mockOnToggle = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the FinanceFlow brand name', () => {
        render(<Sidebar isOpen={true} onToggle={mockOnToggle} />);
        expect(screen.getByText('FinanceFlow')).toBeInTheDocument();
    });

    it('renders all 5 navigation links', () => {
        render(<Sidebar isOpen={true} onToggle={mockOnToggle} />);
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Transactions')).toBeInTheDocument();
        expect(screen.getByText('Budgets')).toBeInTheDocument();
        expect(screen.getByText('Subscriptions')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('displays user name DOX and Premium User label', () => {
        render(<Sidebar isOpen={true} onToggle={mockOnToggle} />);
        expect(screen.getByText('DOX')).toBeInTheDocument();
        expect(screen.getByText('Premium User')).toBeInTheDocument();
    });

    it('navigation links have correct href attributes', () => {
        render(<Sidebar isOpen={true} onToggle={mockOnToggle} />);
        const links = screen.getAllByRole('link');
        const hrefs = links.map((link) => link.getAttribute('href'));
        expect(hrefs).toContain('/');
        expect(hrefs).toContain('/transactions');
        expect(hrefs).toContain('/budgets');
        expect(hrefs).toContain('/subscriptions');
        expect(hrefs).toContain('/settings');
    });

    it('calls onToggle when the toggle button is clicked', () => {
        render(<Sidebar isOpen={true} onToggle={mockOnToggle} />);
        const toggleButton = screen.getByTestId('sidebar-toggle');
        fireEvent.click(toggleButton);
        expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });
});

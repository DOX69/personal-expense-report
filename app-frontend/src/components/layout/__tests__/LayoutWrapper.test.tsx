import { render, screen, fireEvent } from '@testing-library/react';
import LayoutWrapper from '../LayoutWrapper';
import Header from '../Header';

// Mock Header to isolate it
jest.mock('../Header', () => {
    return function MockHeader() {
        return <div data-testid="header">Header</div>;
    };
});

describe('LayoutWrapper', () => {
    it('toggles sidebar and main content margin between expanded and collapsed states', () => {
        render(
            <LayoutWrapper>
                <div data-testid="main-content">Content</div>
            </LayoutWrapper>
        );

        // Sidebar and main content should initially be expanded
        const sidebar = screen.getByTestId('sidebar-container');
        const main = screen.getByTestId('main-container');

        expect(sidebar).toHaveClass('w-64');
        expect(main).toHaveClass('ml-64');

        // Find the toggle button
        const toggleButton = screen.getByTestId('sidebar-toggle');

        // Click to collapse
        fireEvent.click(toggleButton);

        expect(sidebar).toHaveClass('w-20');
        expect(main).toHaveClass('ml-20');

        // Click to expand
        fireEvent.click(toggleButton);

        expect(sidebar).toHaveClass('w-64');
        expect(main).toHaveClass('ml-64');
    });
});

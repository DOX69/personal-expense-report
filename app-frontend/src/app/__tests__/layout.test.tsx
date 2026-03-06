import { render } from '@testing-library/react';
import RootLayout from '../layout';

// Mock the Geist fonts to avoid errors during test rendering
jest.mock('next/font/google', () => ({
    Geist: () => ({ variable: '--font-geist-sans' }),
    Geist_Mono: () => ({ variable: '--font-geist-mono' }),
}));

// Mock Providers and layout components
jest.mock('../providers', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="providers">{children}</div>,
}));
jest.mock('@/components/layout/Sidebar', () => ({
    __esModule: true,
    default: () => <div data-testid="sidebar" />,
}));
jest.mock('@/components/layout/Header', () => ({
    __esModule: true,
    default: () => <div data-testid="header" />,
}));

describe('RootLayout', () => {
    it('suppresses hydration warnings on the html tag', () => {
        // We render the layout and then inspect the raw HTML output or the DOM string
        const { container } = render(
            <RootLayout>
                <div>Test Content</div>
            </RootLayout>
        );

        // RTL renders the children of RootLayout into a div, but RootLayout returns <html>...
        // Let's check the container's innerHTML to see if the suppressHydrationWarning prop (or its React internal representation) is handled, 
        // or just check if the html tag has no hydration mismatch.
        // Actually, in JSDOM, render() strips the <html> tag and just renders its children into the container.
        // However, if we look at the component directly by calling it as a function:
        const layoutElement = RootLayout({ children: <div>Test Content</div> });

        // layoutElement is a React element. we can check its props directly!
        expect(layoutElement.type).toBe('html');
        expect(layoutElement.props.suppressHydrationWarning).toBe(true);
    });
});

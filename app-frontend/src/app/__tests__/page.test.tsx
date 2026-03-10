import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import * as ReactQuery from '@tanstack/react-query';

// Mock child components to isolate Dashboard's state handling
jest.mock('@/components/dashboard/MetricCard', () => () => <div data-testid="metric-card" />);
jest.mock('@/components/dashboard/CashflowChart', () => () => <div data-testid="cashflow-chart" />);
jest.mock('@/components/dashboard/CategoriesChart', () => () => <div data-testid="categories-chart" />);
jest.mock('@/components/dashboard/RecentTransactions', () => () => <div data-testid="recent-transactions" />);
jest.mock('@/components/dashboard/SankeyChart', () => () => <div data-testid="sankey-chart" />);

jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'),
    useQuery: jest.fn(),
}));

const queryClient = new ReactQuery.QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <ReactQuery.QueryClientProvider client={queryClient}>
            {ui}
        </ReactQuery.QueryClientProvider>
    );
};

describe('Dashboard', () => {
    beforeEach(() => {
        (ReactQuery.useQuery as jest.Mock).mockImplementation((options: any) => {
            const queryKey = options.queryKey;
            if (queryKey[0] === 'categories') {
                return {
                    data: [
                        { id: 1, category: 'Salary', flow_type: 'income' },
                        { id: 21, category: 'Restaurant', flow_type: 'expense' },
                    ],
                    isLoading: false,
                    error: null,
                };
            }
            if (queryKey[0] === 'dashboard-metrics') {
                return {
                    data: { total_income: 1000, total_expense: 500, net_cashflow: 500 },
                    isLoading: false,
                    error: null,
                };
            }
            return { data: null, isLoading: false, error: null };
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    it('renders filter controls: Period, Category, and Reset', () => {
        renderWithProviders(<Dashboard />);

        // Check for Period selector
        expect(screen.getByRole('combobox', { name: /period/i })).toBeInTheDocument();
        // Check for Category filter label
        expect(screen.getByText(/category/i)).toBeInTheDocument();
        // Check for Reset button
        expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    });

    it('updates state when filters are changed and reset', () => {
        renderWithProviders(<Dashboard />);

        const periodSelect = screen.getByRole('combobox', { name: /period/i });
        const resetButton = screen.getByRole('button', { name: /reset/i });

        fireEvent.change(periodSelect, { target: { value: 'this_month' } });
        expect(periodSelect).toHaveValue('this_month');

        // Test Category selection (simplified since it's now a custom UI)
        const categoryFilter = screen.getByText('All Categories');
        fireEvent.click(categoryFilter);
        
        // After clicking, we should see category options. 
        // Note: categories are fetched via useQuery, so they might not be there immediately without mocking.
        
        fireEvent.click(resetButton);

        // Assuming default values are 'all' or 'this_month' for period
        expect(periodSelect).toHaveValue('all');
    });
});

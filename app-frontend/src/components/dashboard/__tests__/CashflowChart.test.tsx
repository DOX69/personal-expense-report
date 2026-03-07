import { render, screen } from '@testing-library/react';
import CashflowChart from '../CashflowChart';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as ReactQuery from '@tanstack/react-query';

jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'),
    useQuery: jest.fn(),
}));

jest.mock('recharts', () => {
    const OriginalRechartsModule = jest.requireActual('recharts');
    return {
        ...OriginalRechartsModule,
        ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
        BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
        Bar: ({ dataKey }: any) => <div data-testid={`bar-${dataKey}`} />,
    };
});

describe('CashflowChart', () => {
    const queryClient = new ReactQuery.QueryClient();

    beforeEach(() => {
        (ReactQuery.useQuery as jest.Mock).mockReturnValue({
            data: [
                { date: '2026-01-15T00:00:00.000Z', amount: 1000, category: 'Salary' },
                { date: '2026-01-20T00:00:00.000Z', amount: -500, category: 'Food' }
            ],
            isLoading: false,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders a BarChart with income and expense bars', () => {
        render(
            <ReactQuery.QueryClientProvider client={queryClient}>
                <CashflowChart />
            </ReactQuery.QueryClientProvider>
        );

        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('bar-income')).toBeInTheDocument();
        expect(screen.getByTestId('bar-expense')).toBeInTheDocument();
    });
});

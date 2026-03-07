import { render, screen } from '@testing-library/react';
import ImportPage from '../page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Setting up a query client for testing the page if it uses any hooks
const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
};

describe('ImportPage', () => {
    it('renders the page title', () => {
        renderWithProviders(<ImportPage />);
        expect(screen.getByText('Import Transactions')).toBeInTheDocument();
    });

    it('renders the CSV format instructions', () => {
        renderWithProviders(<ImportPage />);
        expect(screen.getByText(/CSV Format Instructions/i)).toBeInTheDocument();
        expect(screen.getByText(/date/i)).toBeInTheDocument();
        expect(screen.getByText(/description/i)).toBeInTheDocument();
        expect(screen.getByText(/amount/i)).toBeInTheDocument();
        expect(screen.getAllByText(/category/i)[0]).toBeInTheDocument();
    });

    it('renders the drag and drop area', () => {
        renderWithProviders(<ImportPage />);
        expect(screen.getByText(/Drag & drop a CSV file/i)).toBeInTheDocument();
    });
});

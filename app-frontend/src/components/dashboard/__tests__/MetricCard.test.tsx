import { render, screen } from '@testing-library/react';
import MetricCard from '../MetricCard';
import { Home } from 'lucide-react';

describe('MetricCard', () => {
    it('renders the title and value correctly', () => {
        render(<MetricCard title="Total Balance" value="$1,234.56" icon={Home} />);

        expect(screen.getByText('Total Balance')).toBeInTheDocument();
        expect(screen.getByText('$1,234.56')).toBeInTheDocument();
    });

    it('renders positive trend correctly', () => {
        const { container } = render(
            <MetricCard title="Income" value="$500" icon={Home} trend="+5%" trendPositive={true} />
        );

        expect(screen.getByText('+5%')).toBeInTheDocument();
        expect(container.querySelector('.text-green-400')).toBeInTheDocument();
    });

    it('renders negative trend correctly', () => {
        const { container } = render(
            <MetricCard title="Expenses" value="$200" icon={Home} trend="-2%" trendPositive={false} />
        );

        expect(screen.getByText('-2%')).toBeInTheDocument();
        expect(container.querySelector('.text-red-400')).toBeInTheDocument();
    });
});

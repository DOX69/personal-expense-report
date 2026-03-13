import { NextRequest } from 'next/server';
import { POST } from '../route';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

// Mock Supabase client
jest.mock('@/lib/supabaseServer', () => ({
  getSupabaseServerClient: jest.fn(() => ({
    from: jest.fn(() => ({
      upsert: jest.fn(() => Promise.resolve({ error: null }))
    }))
  }))
}));

describe('Upload API Integration', () => {
    const mockRequest = (csvContent: string) => {
        return {
            formData: jest.fn(async () => {
                const formData = new FormData();
                const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
                // Polyfill text() for the mock file
                file.text = jest.fn(async () => csvContent);
                formData.append('file', file);
                return formData;
            })
        } as any;
    };

    it('successfully processes a CSV with English headers', async () => {
        const engCsvContent = 'date,description,amount,currency\n2023-10-15,English Header Test,-12.5,USD';
        const request = mockRequest(engCsvContent);

        const response: any = await POST(request);
        const body = await response.json();

        expect(body.success).toBe(true);
        expect(body.inserted).toBe(1);
    });

    it('successfully processes a CSV with full French headers', async () => {
        const csvContent = 'Type,Produit,Date de début,Date de fin,Description,Montant,Frais,Devise,État,Solde\nVirement,,2023-11-01,,French Format Transaction,-50.0,,EUR,Exécuté,-1200.0';
        const request = mockRequest(csvContent);

        const response: any = await POST(request);
        const body = await response.json();

        expect(body.success).toBe(true);
        expect(body.inserted).toBe(1);
    });

    it('reports specific missing columns', async () => {
        const missingCsvContent = 'date,description\n2023-10-15,Incomplete Data';
        const request = mockRequest(missingCsvContent);

        const response: any = await POST(request);
        const body = await response.json();

        expect(body.success).toBe(false);
        expect(body.errors[0]).toContain('amount');
        expect(body.errors[0]).toContain('currency');
        expect(body.errors[0]).toContain('Colonnes manquantes');
    });

    it('handles invalid amount format', async () => {
        const invalidCsvContent = 'date,description,amount,currency\n2023-10-15,Bad Amount,not-a-number,USD';
        const request = mockRequest(invalidCsvContent);

        const response: any = await POST(request);
        const body = await response.json();

        expect(body.success).toBe(false);
        expect(body.errors[0]).toContain('Montant invalide');
    });
});

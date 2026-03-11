import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import Papa from 'papaparse';

const KEYWORD_MAP: Record<string, number> = {
  // Salary
  'decideom': 1, 'mondial relay': 1, 'salaire': 1, 'paye': 1,
  // Income - Passive/Exceptional
  'dividende': 2, 'interet': 3, 'loyer': 4, 'remboursement': 5, 'refund': 5, 'vinted': 5, 'cadeau': 6,
  // Housing
  'syndic': 10, 'taxe foncière': 10,
  // Energy
  'edf': 11, 'engie': 11, 'totalenergies': 11, 'eau': 11,
  // Insurance
  'assurance': 12, 'mutuelle': 12, 'allianz': 12, 'axa': 12, 'macif': 12,
  // Telecom
  'orange': 13, 'sfr': 13, 'bouygues': 13, 'free': 13, 'icloud': 13, 'google': 13, 'spotify': 13, 'netflix': 13, 'amazon prime': 13,
  // Transport Subscription
  'navigo': 14, 'abonnement transport': 14,
  // Groceries
  'auchan': 20, 'carrefour': 20, 'leclerc': 20, 'monoprix': 20, 'franprix': 20, 'match': 20, 'aldi': 20, 'lidl': 20,
  // Restaurant
  'restaurant': 21, 'cafe': 21, 'bar': 21, 'deliveroo': 21, 'ubereats': 21, 'mcdo': 21, 'burger king': 21, 'starbucks': 21,
  // Transport (Usage)
  'sncf': 22, 'sbb cff ffs': 22, 'cff': 22, 'uber': 22, 'taxi': 22, 'parking': 22, 'peage': 22, 'tamoil': 22, 'bp': 22, 'total': 22, 'shell': 22,
  // Leisure / Culture
  'cinema': 23, 'fnac': 23, 'concert': 23, 'musee': 23,
  // Shopping
  'zara': 24, 'h&m': 24, 'amazon': 24, 'sephora': 24, 'uniqlo': 24, 'vetement': 24,
  // Health
  'pharmacie': 25, 'doctolib': 25, 'medecin': 25, 'dentiste': 25, 'opticien': 25,
  // Life & Social
  'social': 27, 'club': 27, 'sortie': 27, 'loisir': 27, 'lifestyle': 27,
  // Savings / Investment
  'epargne': 30, 'livret': 30, 'pea': 31, 'assurance-vie': 31, 'crypto': 31, 'binance': 31, 'coinbase': 31,
  // Transfers
  'change en': 40, 'change de': 40,
};

const SORTED_KEYWORDS = Object.keys(KEYWORD_MAP).sort((a, b) => b.length - a.length);

function categorizeTransaction(description: string, amount: number): number {
  const desc = (description || '').toLowerCase();
  for (const keyword of SORTED_KEYWORDS) {
    if (desc.includes(keyword)) {
      return KEYWORD_MAP[keyword];
    }
  }
  return amount > 0 ? 7 : 26; // other income : other expense
}

function parseDate(dateStr: string): string | null {
  if (!dateStr) return null;
  // Try to parse basic DD/MM/YYYY vs YYYY-MM-DD
  // For simplicity, just use JS Date constructor, which works with YYYY-MM-DD
  // Let's assume standard formatting. Best effort:
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    // try European format DD/MM/YYYY
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const euDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      if (!isNaN(euDate.getTime())) return euDate.toISOString();
    }
    return null;
  }
  return d.toISOString();
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, errors: ['No file uploaded'] }, { status: 400 });
    }

    const textContent = await file.text();
    
    return new Promise((resolve) => {
      Papa.parse(textContent, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const rows = results.data as Record<string, any>[];
          const errors: string[] = [];

          if (rows.length === 0) {
            return resolve(NextResponse.json({ success: false, errors: ['Fichier vide'] }));
          }

          // Check required columns
          const required = ['Date de début', 'Description', 'Montant', 'Devise'];
          const firstRow = rows[0];
          const missing = required.filter(r => !(r in firstRow));
          
          if (missing.length > 0) {
            return resolve(NextResponse.json({ success: false, errors: [`Colonnes manquantes: ${missing.join(', ')}`] }));
          }

          const dbRecords = [];
          
          for (const row of rows) {
            const dateRaw = row['Date de début'];
            const description = row['Description'];
            const amountRaw = row['Montant'];
            const currency = row['Devise'];
            const type = row['Type'] || null;

            if (!dateRaw || !description || amountRaw == null || !currency) {
              errors.push(`Valeurs manquantes pour certaines transactions.`);
              break;
            }

            const parsedDate = parseDate(dateRaw);
            if (!parsedDate) {
              errors.push(`Format de date invalide`);
              break;
            }

            let amountStr = String(amountRaw).replace(',', '.');
            const amount = parseFloat(amountStr);
            if (isNaN(amount)) {
              errors.push(`Montant invalide: ${amountRaw}`);
              break;
            }

            const categoryId = categorizeTransaction(description, amount);

            dbRecords.push({
              start_date: parsedDate,
              description: String(description),
              amount,
              currency: String(currency),
              category_id: categoryId,
              type: type ? String(type) : null
            });
          }

          if (errors.length > 0) {
            return resolve(NextResponse.json({ success: false, errors }));
          }

          // Insert into Supabase
          const supabase = getSupabaseServerClient();
          const { error: insertError } = await supabase
            .from('transactions')
            .upsert(dbRecords, { onConflict: 'start_date,description' });

          if (insertError) {
            console.error('Database insert error:', insertError);
            return resolve(NextResponse.json({ success: false, errors: ['Failed to save transactions to database'] }));
          }

          resolve(NextResponse.json({ success: true, inserted: dbRecords.length }));
        },
        error: (err: any) => {
          resolve(NextResponse.json({ success: false, errors: [`Erreur de lecture: ${err.message}`] }));
        }
      });
    });
  } catch (err) {
    console.error('Unexpected upload error:', err);
    return NextResponse.json({ success: false, errors: ['Internal Server Error'] }, { status: 500 });
  }
}

import '@testing-library/jest-dom'
import * as dotenv from 'dotenv'
import path from 'path'
import 'cross-fetch/polyfill'

// Polyfill Response.json if it is missing
if (typeof Response.json !== 'function') {
    (Response as any).json = (data: any, init?: ResponseInit) => {
        const body = JSON.stringify(data);
        return new Response(body, {
            ...init,
            headers: {
                'Content-Type': 'application/json',
                ...init?.headers,
            },
        });
    };
}

// Load .env.local for integration tests
dotenv.config({ path: path.resolve(__dirname, '.env.local') })

import '@testing-library/jest-dom'
import * as dotenv from 'dotenv'
import path from 'path'
import 'cross-fetch/polyfill'

// Load .env.local for integration tests
dotenv.config({ path: path.resolve(__dirname, '.env.local') })

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env files
// Priority: .env.local > .env > ../../.env

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Load root .env.local
dotenv.config({ path: path.resolve(process.cwd(), '../../.env.local') });

// Load root .env
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

// Application constants and configuration

// Rate limiting
export const RATE_LIMITS = {
    // Anonymous users
    ANONYMOUS: {
        CREATE_PASTE: { points: 5, duration: 60 * 60 }, // 5 pastes per hour
        VIEW_PASTE: { points: 100, duration: 60 * 60 }, // 100 views per hour
        API_GENERAL: { points: 50, duration: 60 * 60 }, // 50 requests per hour
    },
    // Authenticated users
    AUTHENTICATED: {
        CREATE_PASTE: { points: 50, duration: 60 * 60 }, // 50 pastes per hour
        VIEW_PASTE: { points: 500, duration: 60 * 60 }, // 500 views per hour
        API_GENERAL: { points: 200, duration: 60 * 60 }, // 200 requests per hour
    },
} as const;

// Paste constraints
export const PASTE_CONSTRAINTS = {
    MAX_TITLE_LENGTH: 200,
    MAX_CONTENT_LENGTH: 10 * 1024 * 1024, // 10MB
    MIN_CONTENT_LENGTH: 1,
    MAX_PASTES_PER_USER: 10000,
    MAX_FOLDER_NAME_LENGTH: 100,
} as const;

// Password constraints
export const PASSWORD_CONSTRAINTS = {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: false,
} as const;

// Supported programming languages
export const SUPPORTED_LANGUAGES = [
    'plaintext',
    'javascript',
    'typescript',
    'python',
    'java',
    'c',
    'cpp',
    'csharp',
    'go',
    'rust',
    'ruby',
    'php',
    'swift',
    'kotlin',
    'scala',
    'r',
    'perl',
    'lua',
    'bash',
    'shell',
    'powershell',
    'sql',
    'html',
    'css',
    'scss',
    'sass',
    'less',
    'json',
    'xml',
    'yaml',
    'toml',
    'markdown',
    'dockerfile',
    'makefile',
    'nginx',
    'apache',
    'haskell',
    'elixir',
    'erlang',
    'clojure',
    'lisp',
    'scheme',
    'ocaml',
    'fsharp',
    'dart',
    'julia',
    'matlab',
    'objective-c',
    'assembly',
    'vhdl',
    'verilog',
    'solidity',
    'graphql',
    'protobuf',
] as const;

// Expiration durations in milliseconds
export const EXPIRATION_DURATIONS = {
    '10m': 10 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000,
    '1m': 30 * 24 * 60 * 60 * 1000,
    '6m': 180 * 24 * 60 * 60 * 1000,
    '1y': 365 * 24 * 60 * 60 * 1000,
} as const;

// Security headers
export const SECURITY_HEADERS = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
} as const;

// Content Security Policy
export const CSP_DIRECTIVES = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'"], // Monaco editor requires unsafe-eval
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': ["'self'"],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
} as const;

// API configuration
export const API_CONFIG = {
    VERSION: 'v1',
    PREFIX: '/api',
    TIMEOUT: 30000, // 30 seconds
} as const;

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
} as const;

// Session configuration
export const SESSION_CONFIG = {
    ACCESS_TOKEN_EXPIRY: '15m',
    REFRESH_TOKEN_EXPIRY: '7d',
    COOKIE_MAX_AGE: 7 * 24 * 60 * 60, // 7 days in seconds
} as const;

// Encryption configuration
export const ENCRYPTION_CONFIG = {
    ALGORITHM: 'aes-256-gcm',
    KEY_LENGTH: 32,
    IV_LENGTH: 16,
    AUTH_TAG_LENGTH: 16,
    SALT_LENGTH: 32,
    ITERATIONS: 100000,
} as const;

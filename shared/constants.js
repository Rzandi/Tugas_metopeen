/**
 * Shared Constants
 * Used across both frontend and backend
 */

// User Roles
export const USER_ROLES = {
  OWNER: 'owner',
  STAFF: 'staff',
};

// Transaction Types
export const TRANSACTION_TYPES = {
  SALE: 'sale',
  EXPENSE: 'expense',
  RESTOCK: 'restock',
};

// API Status Codes
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

// Cache Keys
export const CACHE_KEYS = {
  USER: 'user',
  DASHBOARD: 'dashboard',
  TRANSACTIONS: 'transactions',
  USERS: 'users',
  PRICE_LIST: 'priceList',
  APPROVALS: 'approvals',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Validation Rules
export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 255,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  PRICE_MIN: 0,
  QUANTITY_MIN: 0,
};

// Features
export const FEATURES = {
  ANALYTICS: 'analytics',
  EXPORT_PDF: 'exportPdf',
  EXPORT_EXCEL: 'exportExcel',
  BULK_OPERATIONS: 'bulkOperations',
};

export default {
  USER_ROLES,
  TRANSACTION_TYPES,
  API_STATUS,
  CACHE_KEYS,
  PAGINATION,
  VALIDATION_RULES,
  FEATURES,
};

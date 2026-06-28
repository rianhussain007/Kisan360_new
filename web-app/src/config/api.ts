const API_BASE = (process as any).env?.REACT_APP_API_URL || '/api';
export const API_URL = API_BASE.replace(/\/+$/, '');

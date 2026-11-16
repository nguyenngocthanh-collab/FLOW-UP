import type { ImportMetaEnv } from '../shared/types/environment';

const env = import.meta.env as ImportMetaEnv;

export const appName = env.VITE_APP_NAME?.trim() || 'FLOW-UP';

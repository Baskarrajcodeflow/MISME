import { Environment } from './environment.model';
export const environment: Environment = {
  production: true,
  apiUrl: 'https://bo.mymoney.af',
  debugMode: true,
  enableLogs:false,
  sessiontimout: 50 * 60 * 1000,
  inactivetimout: 15 * 60 * 1000,
};
  
  
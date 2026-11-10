import { Environment } from './environment.model';
export const environment: Environment = {
  production: false,
  apiUrl: 'http://uatbo.mymoney.af',
  debugMode: true,
  enableLogs:true,
  sessiontimout: 50 * 60 * 1000,
  inactivetimout: 15 * 60 * 1000,
};
  
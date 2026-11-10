export interface Environment {
    production: boolean;
    apiUrl: string;
    debugMode: boolean;
    enableLogs: boolean;
    sessiontimout: number;
    inactivetimout: number;
}
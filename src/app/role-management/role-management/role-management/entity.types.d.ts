
// Interfaces for entities in your Angular application

export interface MlsModule {
    id: number;
    name: string;
    description: string;
    moduleAccessControls: ModuleAccessAuthority[];
}

export interface ModuleAccessAuthority {
    id: number;
    visible: boolean;
    permissionName: string;
    description: string;
    uri: string;
    method: string;
    mlsModuleId: number;  // Only the ID reference is needed for the relationship
}

export interface Branch {
    id: number|null;
    name: string;
    departments: Department[];  // Array of Department interfaces
}

export interface Department {
    id: number|null;
    name: string;
    roleId: number;  // Assuming you only need the ID reference for the related role
    branchId: number;  // Assuming you only need the ID reference for the related branch
}


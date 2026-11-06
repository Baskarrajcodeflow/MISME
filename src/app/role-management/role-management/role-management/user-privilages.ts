export interface UserPrivilages {
    componentId: number;
    subComponentId: number,
    subComponentName: string,
    active: boolean;
    create: boolean;
    update: boolean;
    read: boolean;
    authorize: boolean;
    delete: boolean
}
export interface PrevilageComponent {
    componentId: number;
    subComponentId: number,
    subComponentName: string,
    active: boolean;
    create: boolean;
    update: boolean;
    read: boolean;
    authorize: boolean;
    delete: boolean
}
export interface componentPrivilage {
    componentId: number;
    subComponentId: number,
    active: boolean;
    create: boolean;
    update: boolean;
    read: boolean;
    authorize: boolean;
    delete: boolean
}
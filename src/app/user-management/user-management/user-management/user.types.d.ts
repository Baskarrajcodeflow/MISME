export interface BaseUser {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    userType: UserType;
    password: string;
    pwdUpdatedOn: Date;
    pwdExpiry: Date;
    active: boolean;
    deleted: boolean;
    role: MiRole;
}
export interface BackOffice extends BaseUser {
    department: Department;
    branch: Branch;
}
export interface MiPayUser extends BaseUser {
    gender: Gender;
    walletAccount: WalletAccount;
    accountKycLevel: AccountKYCLevel;
    kycStatus: KYCStatus;
    phone: string;
}

export interface MiPayAgent extends BaseUser {
    gender: Gender;
    familyId: number;
    agentType: AgentType;
    parent: BaseUser;
    children: BaseUser[];
    accountKycLevel: AccountKYCLevel;
    kycStatus: KYCStatus;
    accountType: MyMoneyAccountType;
    walletAccount: WalletAccount;
}
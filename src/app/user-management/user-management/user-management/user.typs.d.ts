export interface BaseUser {
    id: number;
    email: string;
    username: string;
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
    alternativeMobileNos: string[];
    address: Address;
    walletAccount: WalletAccount;
    preferredCurrency: string;
    accountKycLevel: AccountKYCLevel;
    kycStatus: KYCStatus;
    parent: BaseUser;
    userProfile: UserProfile;
}
export interface MiPayAgent extends BaseUser {
    gender: Gender;
    cifId: string;
    position: string;
    department: string;
    location: string;
    company: string;
    familyId: number;
    firmType: FirmType;
    agentType: AgentType;
    shareHolders: AgentShareHolder[];
    parent: BaseUser;
    children: BaseUser[];
    alternativeMobileNos: string[];
    accountKycLevel: AccountKYCLevel;
    kycStatus: KYCStatus;
    accountType: MyMoneyAccountType;
    agentProfile: AgentProfile;
}

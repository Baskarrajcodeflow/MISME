export interface WalletAccount {
    id: number;
    accountNo: string;
    accountDescription: string;
    subAccountNo: string;
    headAccountNo: string;
    subDescription: string | null;
    headDescription: string | null;
    type: string;
    walletType: string;
    productReference: number;
    branchCode: string;
    acDesc: string | null;
    cifNo: string;
    ccy: string;
    baseUserId: number;
    acOpenDate: string;
    acStmtDay: string;
    makerId: string | null;
    active: boolean;
    makerDtStamp: string;
    checkerId: string | null;
    checkerDtStamp: string;
    noCredit: boolean;
    noDebit: boolean;
    locked: boolean;
    dormant: boolean;
    suspend: boolean;
    productName: string;
    accRemarks: string;
    walletStatus: string;
    walletNo: string;
    wallet: any | null;
}

export interface User {
    createdOn: string;
    modifiedOn: string;
    lastLoggedIn: string | null;
    createdBy: string;
    suspendedBy: string | null;
    unSuspendedBy: string | null;
    registeredMasterId: string | null;
    suspendedAuthorizedBy: string | null;
    activateAuthorizedBy: string | null;
    deactivatedBy: string | null;
    verifiedBy: string | null;
    authorizedOn: string | null;
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    userType: string;
    digitalKey: string | null;
    userCategoryType: string | null;
    active: boolean;
    accountState: string;
    deleted: boolean;
    role: string | null;
    roleData: any | null;
    username: string;
    password: string;
    profilePic: string | null;
    suspendReason: string | null;
    kycStatus: string | null;
    activatePending: boolean;
    activityRequestId: string | null;
    pwdLockout: string | null;
    masterAgentType: string | null;
    gender: string;
    walletAccount: WalletAccount;
    accountKycLevel: string;
    dateOfBirth: string | null;
    birthCountry: string | null;
    birthProvince: string | null;
    birthDistrict: string | null;
    currCountry: string | null;
    currProvince: string | null;
    currDistrict: string | null;
    product: number;
    lastTransactionDate: string | null;
    availableBalance: number | null;
    depositLimit: number | null;
    accessChannels: string[] | null;
    lastTxnDate: string | null;
    dormant:boolean;
    walletNo : string;
    dormantOn : string | null;
    dlEdit: boolean;
    kycType: string | null;
    oldDepositLimitVal: number | null;
    initiatedDepositLimit: number;
}

export interface CustomerKyc {
    id: number;
    custInfoFirstName: string;
    custInfoLastName: string;
    custInfoFatherName: string;
    custInfoMMWallet: string;
    custInfoDob: string;
    custInfoGender: string;
    custInfoMaritalStatus: string;
    custInfoAltPhone: string;
    custInfoEmail: string;
    custInfoNationality: string;
    custInfoAccOpenDate: string | null;
    custInfoBirthCountry: string;
    custInfoBirthProvince: string;
    currLocation: string;
    currCountry: string;
    currProvince: string;
    currProvinceId: number;
    currDistrict: string;
    currDistrictId: number;
    permCountry: string;
    permProvince: string;
    permProvinceId: number;
    permDistrict: string;
    permDistrictId: number;
    employmentType: string;
    employerName: string;
    sourceOfIncome: string;
    positionHeld: string;
    periodOfService: string;
    monthlyTurnover: number;
    monthlyIncome: number;
    tinNumber: string;
    bizNature: string;
    govtOrgName: string | null;
    govtPositionHeld: string | null;
    nokName: string;
    nokFatherName: string;
    nokRelationship: string;
    nokPhone: string;
    nokLocation: string;
    purposeOfAcc: string;
    custProofType: string;
    custProofNumber: string;
    custProofDateOfIssue: string;
    custProofDateOfExpiry: string;
    custPhoto: string;
    custSignaturePhoto: string;
    tazkiraPageNo: string | null;
    tazkiraRegNo: string | null;
    tazkiraBookNo: string | null;
    custProofFrontPhoto: string;
    custProofBackPhoto: string;
    otherDocs: string | null;
    processedByOpsFullName: string | null;
    processedByOpsUsername: string | null;
    processedByOpsDate: string | null;
    opsSignaturePhoto: string | null;
    approvedByComplianceFullName: string;
    approvedByComplianceUsername: string | null;
    approvedByComplianceDate: string | null;
    complianceSignaturePhoto: string;
    complianceHeadSignaturePhoto: string | null;
    ceoSignaturePhoto: string | null;
    riskCategory: string | null;
    checkedWatchlist: boolean;
    watchlistRemarks: string;
    attachments: string[];
}

export interface KycUser {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    userType: string;
    walletNumber: string | null;
}

export interface Kyc {
    id: number;
    seqNo: string;
    kycType: string;
    customerKyc: CustomerKyc;
    masterAgentKyc: any | null;
    agentKyc: any | null;
    corporateKyc: any | null;
    ngoKyc: any | null;
    govtAgencyKyc: any | null;
    attachments: any | null;
    submittedBy: KycUser;
    submittedFor: KycUser;
    status: string;
    rejectReason: string | null;
    createdOn: string;
    l1VerifiedOn: string | null;
    l1VerifiedBy: string | null;
    l2VerifiedOn: string | null;
    l2VerifiedBy: string | null;
    approvedOn: string;
    approvedBy: KycUser;
    rejectedOn: string | null;
    rejectedBy: string | null;
}

export interface UserKycData {
    user: User;
    kyc?: Kyc;
    transactions?: Transaction[];
}
/* export interface CustomerUserDetails {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    dob: Date;
    address: string;
    fatherName?: string;
    accountStatus: string;
    kycStatus?: string;
    kycId?: string;
    accessChannels?: { name: string; status: string; activity: string };
    userType: string;
    transactions?: Transaction[];
    accountopeningDate: Date;
    walletNo: string;
    IDType?: string;
    IDNumber?: string;
    lastTransactionDate?: Date;
    availableBalance?: number;
    depositLimit?: number;
    withdrawalLimit?: number;
    product?: string;
    profilePicture?: string;
    passwordLockout?: boolean;
    agentDetails?: {
        agentType: string;
        parentAgentEmail: string;
        parentAgentPhone: string;
        childrenAgents: {
            id: string;
            name: string;
            email: string;
            phone: string;
        }[];
    }
    corporateDetails?: {
        companyName: string;
        registrationNumber: string;
        taxId: string;
        address: string;
    }
    WalletAccount?: {
        id: number;
        accountNo: string;
        accountDescription: string;
        subAccountNo: string;
        headAccountNo: string;
        subDescription: string | null;
        headDescription: string | null;
        type: string;
        walletType: string;
        productReference: number;
        branchCode: string;
        acDesc: string | null;
        cifNo: string;
        ccy: string;
        baseUserId: number;
        acOpenDate: string;
        acStmtDay: string;
        makerId: string | null;
        active: boolean;
        makerDtStamp: string;
        checkerId: string | null;
        checkerDtStamp: string;
        noCredit: boolean;
        noDebit: boolean;
        locked: boolean;
        dormant: boolean;
        suspend: boolean;
        productName: string;
        accRemarks: string;
        walletStatus: string;
        walletNo: string;
        wallet: any | null;
    }
} */
export interface AccessChannelReq {
    userId: number;
    accessChannels: string[];
}


/* export interface Transaction {
    date: string;
    id: string;
    amount: number;
    sender: { name: string; wallet: string };
    receiver: { name: string; wallet: string };
    status: string;
    type: 'credit' | 'debit';
} */
export interface Transaction {
  debitAmount: string;
  creditAmount: string;
  serviceName: string;
  txnDate: string;
  payMethod: string;
  txnType: string;
  txnNo: string;
  otherInfo: string;
  sender: string;
  receiver: string;
  channel: string | null;
  medium: string | null;
  txnStatus: string | null;
}
export interface searchReq {
    userType: 'CUSTOMER' | 'AGENT' | 'MASTER_AGENT' | 'CORPORATE' | 'MERCHANT' ;
    email: string | null;
    phone: string | null;
    wallet: string | null;
    name: string | null;
    idProof: string | null;
    page: number;

}
export interface SearchResult {
    id: number;
    active: boolean;
    email: string;
    firstName: string;
    phone: string;
    userType: string;
    walletNo: string;
    lastName: string;
    accountState: string;
    kycStatus: string | null;
    companyName: string | null;
    idProofNo: string | null;
    tin: string | null;
    bizLicenseNo: string | null;
}


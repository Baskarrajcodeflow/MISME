export interface addCustomerKYCRequest {
    // images?:any[];
    customerInfo: {
        firstName: any;
        middleName: any;
        surname: any;
        fatherName: any;
        dateOfBirth: any;
        placeOfBirth: any;
        nationality: any;
        tazkiraPassportNo: any;
        dateOfIssue: any;
        dateOfExpiry: any;
        mmWalletNo: any;
        accOpenDate: any;
        gender: any;
        maritalStatus: any;
        contactNo: any;
        email: any;
        monthlyTurnOver: any;
        purposeOfAcc: any;
    }
    currentAddress: {
        houseNo: any;
        location: any;
        province: any;
        street: any;
        district: any;
        country: any;

    }
    permanentAddress: {
        houseNo: any;
        location: any;
        province: any;
        street: any;
        district: any;
        country: any;

    }
    professionDetails: {
        occupation: any;
        positionHeld: any
        periodOfService: any;
        monthlyIncome: any;
        monthlyTurnOver: any;
        purposeOfAcc: any;
        tinNumber: any;
    }

    nextOfKin: {
        nextOfKinName: any;
        nextOfKinFatherName: any;
        relationship: any;
        mobileNo: any;
    }
    undertaken: {
        name: any;
        date: any;
        riskCategory: any;
        watchlist: any;
    },
    agentVerification: {
        agentName: any;
        licenseNo: any;
        agentLocation: any;
        posNo: any;
        ptidNo: any;
        iccidNo: any;
        kycProcessedBy: any;
        processingDate: any;
        superAgentVerification: any;
        verificationDate: any;
    },
    abmmcVerification: {
        kycProcessedBy:any;
        processedDate:any;
        verifiedByOperation:any;
        verifyDate:any;
        approvedByCompliance:any;
        approvedDate:any;
    }
}



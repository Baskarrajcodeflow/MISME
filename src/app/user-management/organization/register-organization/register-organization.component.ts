import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { organizationScreenFor } from "../organization-screen";
import { CustomerApiService } from "../../user-management/user-management/bo/customer/ApiService/api.service";
export interface BusinessProfile {
  legalBusinessName: string;
  tradingName: string;
  entityType: string;
  registrationNumber: string;
  incorporationDate: string;
  taxIdentificationNumber: string;
}

export interface OperationalDetails {
  mcc: string;
  industryVertical: string;
  websiteUrl: string;
  mobileAppLink: string;
  storefrontDetails: string;
  expectedMonthlyVolume: number;
  averageTicketSize: number;
}

export interface Address {
  addressType: string;
  streetLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UBO {
  fullLegalName: string;
  dateOfBirth: string;
  nationality: string;
  residentialAddress: string;
  identificationType: string;
  identificationNumber: string;
  identificationExpiryDate: string;
  ownershipPercentage: number;
  politicallyExposedPerson: boolean;
}

export interface BankAccount {
  beneficiaryName: string;
  bankName: string;
  branchName: string;
  institutionCode: string;
  accountNumber: string;
  iban: string;
  accountType: string;
}

export interface MerchantOnboardingPayload {
  businessProfile: BusinessProfile;
  operationalDetails: OperationalDetails;
  addresses: Address[];
  ubos: UBO[];
  bankAccounts: BankAccount[];
}
@Component({
  selector: "app-register-organization",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./register-organization.component.html",
  styleUrl: "./register-organization.component.css",
})
export class RegisterOrganizationComponent {
  onboardingForm!: FormGroup;
  isLoading = false;
  nationalities: any;

  // Replace with your actual API Base URL
  private apiUrl = "https://your-api-domain.com/api/kyc/merchant/create";

  // Merchant onboarding (back office) or partner onboarding (manufacturer), chosen by the route's data
  readonly screen = organizationScreenFor(inject(ActivatedRoute));

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private apiService: CustomerApiService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getCountries();
  }

  initForm(): void {
    this.onboardingForm = this.fb.group({
      // 1. Business Profile
      businessProfile: this.fb.group({
        legalBusinessName: ["", Validators.required],
        tradingName: [""],
        entityType: [this.screen.defaultEntityType, Validators.required],
        registrationNumber: ["", Validators.required],
        incorporationDate: [""],
        taxIdentificationNumber: ["", Validators.required],
      }),

      // 2. Operational Details
      operationalDetails: this.fb.group({
        mcc: ["", Validators.required],
        industryVertical: [""],
        websiteUrl: [""],
        mobileAppLink: [""],
        storefrontDetails: [""],
        expectedMonthlyVolume: [0.0, [Validators.required, Validators.min(0)]],
        averageTicketSize: [0.0, [Validators.required, Validators.min(0)]],
      }),

      // 3. Address (Single Object)
      address: this.fb.group({
        addressType: ["REGISTERED", Validators.required],
        streetLine: ["", Validators.required],
        city: ["", Validators.required],
        state: [""],
        postalCode: [""],
        country: ["", Validators.required],
      }),

      // 4. UBO (Single Object)
      ubo: this.fb.group({
        fullLegalName: ["", Validators.required],
        dateOfBirth: [""],
        nationality: [""],
        residentialAddress: [""],
        identificationType: ["PASSPORT"],
        identificationNumber: [""],
        identificationExpiryDate: [""],
        ownershipPercentage: [0.0],
        politicallyExposedPerson: [false],
      }),

      // 5. Bank Account (Single Object)
      bankAccount: this.fb.group({
        beneficiaryName: ["", Validators.required],
        bankName: ["", Validators.required],
        branchName: [""],
        institutionCode: [""],
        accountNumber: ["", Validators.required],
        iban: [""],
        accountType: ["CHECKING"],
      }),
    });
  }

  getCountries() {
    this.apiService.getCountries().subscribe({
      next: (data: any) => {
        this.nationalities = data?.data;
      },
    });
  }

  onSubmit(): void {
    if (this.onboardingForm.invalid) {
      this.onboardingForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const rawValue = this.onboardingForm.getRawValue();

    // Map the single form groups into arrays for the API payload
    const payload = {
      businessProfile: rawValue.businessProfile,
      operationalDetails: rawValue.operationalDetails,
      addresses: [rawValue.address],
      ubos: [rawValue.ubo],
      bankAccounts: [rawValue.bankAccount],
    };

    console.log("API Payload:", payload);

    this.apiService.createOrganization(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log("Organization registered successfully:", response);
        this.router.navigateByUrl(this.screen.listPath);
      },
      error: (error) => {
        console.error("Error registering organization:", error);
        this.isLoading = false;
      },
    });
  }

  cancel() {
    this.router.navigateByUrl(this.screen.listPath);
  }
}

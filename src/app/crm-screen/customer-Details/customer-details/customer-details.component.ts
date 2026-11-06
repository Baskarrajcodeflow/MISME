import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { Router, ActivatedRoute } from '@angular/router';import { AccessChannelReq, UserKycData } from '../../models';
import { UserManagementService } from '../../../user-management/user-management/user-management/openapi/api/userManagement.service';
import { SuspendUserDialogComponent } from '../../../corporate/suspend-user-dialog/suspend-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CorporateService } from '../../../corporate/corporate.service';
import { UserService } from '../../../user-management/user-management/user-management/bo/user.service';
import { ApiServiceService } from '../../../product/api-service/api-service.service'
import { CrmServiceService } from '../../crm-service.service';
import { access } from 'fs';
import { IndividualKYCService } from '../../../user-management/user-management/user-management/bo/kyc.service';
import { KycModuleService } from '../../../kyc/kyc/kyc-module.service';
import { environment } from '../../../../environments/environment';
import { LoaderComponent } from '../../../loader/loader.component';
import { finalize } from 'rxjs/operators';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PermissionService } from '../../../permission.service';


enum usertype {
  CUSTOMER = 'CUSTOMER',
  MERCHANT = 'MERCHANT',
  AGENT = 'AGENT',
  CORPORATE = 'CORPORATE',
  MASTER_AGENT = 'MASTER_AGENT'
}
@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule,NgChartsModule,MatIconModule, LoaderComponent, MatTooltipModule],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent {
  tranactionHistory: any;
  showModalNew : boolean = false;
  viewDetails: any;  
  customerUserDetails!: UserKycData;
  transactionGraphData: any[] =  [];
  customerPhoto: any;
  barChartData: ChartData<'bar'> | undefined;
  barChartOptions: ChartOptions<'bar'> | undefined;
  public barChartType: ChartType = 'bar';  
  isLoading: boolean = false; 
  tabs: string[] = [];
  selectedTab: string = '';
  availableBalance :number = 0;
  selectedUserType!:  'CUSTOMER' | 'AGENT' | 'MERCHANT' | 'CORPORATE' ;
  profilePicUrl : string = 'https://i.pravatar.cc/100';
  oldDepositLimit: number | null = null;
  imageUrl = environment.apiUrl;
  firstSignatoryIdProofNumber!: string | null;
  limitValue!: number;
  activityGroups: any[] = [];
  showKycTable: boolean = false;
  page: number = 0;
  size: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  selectedLogId: any;

  constructor(private permissionService:PermissionService,public router: Router,private KycService: KycModuleService, private route: ActivatedRoute, private customerService: UserManagementService,private dialog:MatDialog,private corporate : CorporateService,private userService: UserService, private apiService: ApiServiceService, private crmService: CrmServiceService, private kycService:IndividualKYCService) { 
  this.permissionService.hideSidebar = true; 
  }


  ngOnInit() {
   this.customerUserDetails = this.crmService.getUserDetails();
   this.oldDepositLimit = this.customerUserDetails.user.oldDepositLimitVal;
   console.log("Inside customer detail", this.customerUserDetails);
    this.firstSignatoryIdProofNumber = '';

    const signatories = this.customerUserDetails?.kyc?.corporateKyc?.signatories;

    if (signatories && signatories.length > 0) {
      this.firstSignatoryIdProofNumber = signatories[0].idProofNumber;
    }
    this.buildActivityGroups(); 
   console.log(this.tabs,"Tabs");
   this.getAccessChannel();
   this.getWalletBalance(); 
  //  this.getProfilePic(this.customerUserDetails.user.userType);  
   this.getTransactionHistory();
   this.getTransactionGraph();
   this.selectedUserType = this.customerUserDetails.user.userType as 'CUSTOMER' | 'AGENT' | 'MERCHANT' | 'CORPORATE' ;
   console.log(this.selectedUserType,"this.selectedUserType 1");
   
   this.setTabs(); 
  //  this.getImagesProfile();
}

setTabs(): void {
  const baseTabs: string[] = ['Account Details', 'KYC Details', 'Access Channels'];

  const isCorporate = this.selectedUserType === 'CORPORATE';

  const isMasterAgent =
    this.selectedUserType === 'AGENT' &&
    this.customerUserDetails?.kyc?.kycType === 'MASTER AGENT';

  if (isCorporate || isMasterAgent) {
    this.tabs = ['Company Address', ...baseTabs];
  } else {
    this.tabs = ['Address', ...baseTabs];
  }

  this.selectedTab = this.tabs[0] as string; // optional but safe
}

  getUserDetails(userType: string | null, userId: number | null) {
    this.isLoading = true;
    if(userType === usertype.CUSTOMER){
    this.customerService.getAllCustomersList().subscribe({
      next: (users: any[]) => {
        if (users) {
          let customerUserDetails = users.find(user => user.id == userId); // Replace with actual customer ID
         // this.customerUserDetails = this.mapDetails(customerUserDetails);
          this.isLoading = false;
          if( this.customerUserDetails) {
            this.getTransactions(); // Fetch transactions after user details are loaded
          }
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something went wrong");
      }
    });
  }
  else if(userType === usertype.MERCHANT){
    this.customerService.getAllMerchants().subscribe({
      next: (users: any[]) => {
        if (users) {
          let merchantUserDetails = users.find(user => user.id == userId); // Replace with actual merchant ID
          //this.customerUserDetails = this.mapDetails(merchantUserDetails);
        this.tabs = [
  'Address',
  'Account Details',
  'KYC Details',
  'Access Channels'
] as string[];
          this.isLoading = false;
         /*  if( this.customerUserDetails) {
            this.getTransactions(); // Fetch transactions after user details are loaded
          } */
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something went wrong");
      }
    });
  }
  else if(userType === usertype.AGENT){
    this.customerService.getAllAgents().subscribe({
      next: (users: any[]) => {
        if (users) {
          let agentUserDetails = users.find(user => user.id == userId); // Replace with actual agent ID
          //this.customerUserDetails = this.mapDetails(agentUserDetails);
          // this.tabs = ['Address', 'Account Details', 'KYC Details', 'Parent Agent Details', 'Access Channels'];
          this.tabs = [
  'Address',
  'Account Details',
  'KYC Details',
  'Access Channels'
] as string[];
          this.isLoading = false;
         /*  if( this.customerUserDetails) {
            this.getTransactions(); // Fetch transactions after user details are loaded
          } */
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something went wrong");
      }
    });
  }
  else if (userType === usertype.CORPORATE) {
    this.apiService.getAllCorporateData().subscribe({
      next: (users: any[]) => {
        if (users) {
          let corporateUserDetails = users.find(user => user.id == userId); // Replace with actual corporate ID
         // this.customerUserDetails = this.mapDetails(corporateUserDetails);
          // this.tabs = ['Company Address', 'Account Details', 'KYC Details', 'Access Channels', 'Authorized Signatories'];
          this.tabs = [
  'Address',
  'Account Details',
  'KYC Details',
  'Access Channels'
] as string[];
          this.isLoading = false;
          /* if( this.customerUserDetails) {
            this.getTransactions(); // Fetch transactions after user details are loaded
          } */
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something went wrong");
      }
    });
  }
  console.log("Corporate User Details:", this.customerUserDetails);
}

  accessChannels = [{ name: 'Web', status: 'Enabled' }, //activity: 'Active'  },
  { name: 'Mobile', status: 'Enabled' }, //activity: 'Active' },
  { name: 'USSD', status: 'Enabled' }]; //activity: 'Active' }];

  getAccessChannel(){
    let accessChannels = this.customerUserDetails?.user.accessChannels;
   
    if (accessChannels) {
     
      if(accessChannels.length != 0 && accessChannels.length == 3){
        return;
      }
      if(!accessChannels.includes('WEB')){
       const web = this.accessChannels.find(channel => channel.name === 'Web')!;
       web.status = 'Disabled';
      }
      if(!accessChannels.includes('MOBILE')){
        const mobile = this.accessChannels.find(channel => channel.name === 'Mobile')!;
        mobile.status = 'Disabled';
       }
       if(!accessChannels.includes('USSD')){
        const ussd = this.accessChannels.find(channel => channel.name === 'USSD')!;
        ussd.status = 'Disabled';
       }
    }
  }

  getProfilePic(userType : string ){
    this.isLoading = true;
    console.log(userType, "pic user type");
    
    switch(userType){
      case 'CUSTOMER':{
        this.kycService.getCustomerDetails(this.customerUserDetails.user.id).subscribe({
          next: (response: any) => {
            this.isLoading = false;
            console.log('Profile Picture URL:', response);
            this.profilePicUrl = response?.data?.profilePictureUrl || '';
            console.log('this.profilePicUrl:', this.profilePicUrl);
          },
          
        });
        break;
    }
    case  'MERCHANT':{
      this.kycService.getMerchantDetails(this.customerUserDetails.user.id).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.profilePicUrl = response?.data?.profilePictureUrl || 'https://i.pravatar.cc/100';
          console.log('Profile Picture URL:', response);
        },
        
      });
      break;
  }
  case 'CORPORATE':{
    this.kycService.getCorporateDetails(this.customerUserDetails.user.id).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.profilePicUrl = response?.data?.profilePictureUrl || 'https://i.pravatar.cc/100';
        console.log('Profile Picture URL:', response);
      },
    });
    break;
  }
}
}

  getWalletBalance() {
    this.isLoading = true;

    this.crmService.getWalletBalance(
      this.customerUserDetails?.user.walletAccount?.walletNo
    ).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Wallet Balance Response:', response);
        this.availableBalance = response?.data || 0;
      },
      error: () => {
        this.isLoading = false;
        console.error('Error fetching wallet balance');
      }
    });
  }

  getTransactionHistory() {
    this.isLoading = true;

    this.crmService.getTransactionHistory(
      this.customerUserDetails?.user.walletAccount?.walletNo,
      'ALL'
    ).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.customerUserDetails.transactions = response?.data || [];
        console.log('Hello:', this.customerUserDetails.transactions);
      },
      error: () => {
        this.isLoading = false;
        console.error('Error fetching transaction history');
      }
    });
  }

 getTransactionGraph() {
  this.isLoading = true;

  this.crmService
    .getTransactionGraph(this.customerUserDetails?.user?.walletAccount?.walletNo)
    .pipe(
      finalize(() => {
        this.isLoading = false; // always stop loader
      })
    )
    .subscribe({
      next: (response: any) => {
        this.transactionGraphData = response?.data || [];
        console.log("txn",this.transactionGraphData)
        this.generateTxnGraph();
      },
      error: (err) => {
        console.error('Error fetching transaction graph', err);
        this.transactionGraphData = [];
        this.barChartData = undefined;
      }
    });
}

  generateTxnGraph() {
    if (!this.transactionGraphData?.length) {
      this.barChartData = undefined;
      return;
    }

    const allZero = this.transactionGraphData.every((d: any) => (d.txnCount ?? 0) === 0);
    if (allZero) {
      this.barChartData = undefined;
      return;
    }

    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: { display: false },

        tooltip: {
          callbacks: {
            label: (context: any) => {
              const index = context.dataIndex;
              const item = this.transactionGraphData[index];

              return [
                `Transaction Count: ${item.txnCount ?? 0}`,
                `Total Debit: ${item.totalDebit ?? 0}`,
                `Total Credit: ${item.totalCredit ?? 0}`
              ];
            }
          }
        }
      },

      scales: {
        x: {
          grid: { display: false },
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 90,
            font: { size: 10 },
            padding: 10
          }
        },
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
          grid: { color: '#f3f4f6' }
        }
      }
    };

    this.barChartData = {
      // Keeps the formatting logic from your original code
      labels: this.transactionGraphData.map((d: any) =>
        d.serviceName
          ?.replace(/_/g, ' ')
          ?.toLowerCase()
          ?.replace(/\b\w/g, (c: string) => c.toUpperCase())
      ),

      datasets: [
        {
          label: 'Transaction Count',
          data: this.transactionGraphData.map((d: any) => d.txnCount ?? 0),
          backgroundColor: '#60a5fa',
          borderRadius: 4,
          categoryPercentage: 0.6, // Adjust this (0.1 to 1.0) to increase/decrease space between groups
          barPercentage: 0.9      // Adjust this to change the thickness of the individual bar
        }
      ]
    };
  }

  activateDormant() {
    this.isLoading = true;

    this.crmService.activateDormantUser(this.customerUserDetails.user.id).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        if (response && response.responseCode === 200) {
          alert("Activated Dormant User Successfully");
          this.customerUserDetails.user.dormant = false;
          console.log('Activate Dormant User Response:', response);
        } else {
          alert("Error -" + response.error);
        }
      },
      error: () => {
        this.isLoading = false;
        console.error('Error activating dormant user');
      }
    });
  }

changeLogs(id: any) {
  this.isLoading = true;

  this.crmService.changeLogs(id, this.page, this.size)
    .pipe(
      finalize(() => {
        this.isLoading = false;
      })
    )
    .subscribe({

      next: (response: any) => {
        console.log(response, "change log");

        if (!response || response.responseCode !== 200) {
          this.viewDetails = [];
          this.totalElements = 0;
          this.totalPages = 0;
          return;
        }

        const data = response.data;

        let logs: any[] = [];

        // ✅ Case 1: Paginated response
        if (data?.content) {
          logs = data.content;
          this.totalElements = data.totalElements ?? logs.length;
          this.totalPages = data.totalPages ?? 1;
        }

        // ✅ Case 2: Plain array
        else if (Array.isArray(data)) {
          logs = data;
          this.totalElements = logs.length;
          this.totalPages = Math.ceil(logs.length / this.size);
        }

        else {
          this.viewDetails = [];
          this.totalElements = 0;
          this.totalPages = 0;
          return;
        }

        // ✅ Inject changedFields comparison here
        this.viewDetails = logs.map((item: any) => {

          const oldData = item.oldData;
          const newData = item.newData;

          const changedFields = this.getChangedFields(oldData, newData);

          return {
            ...item,
            changedFields
          };
        });

      },

      error: (err) => {
        console.error('Error fetching change logs', err);
        this.viewDetails = [];
        this.totalElements = 0;
        this.totalPages = 0;
      }

    });
}

private getChangedFields(oldObj: any, newObj: any, parentKey: string = ''): any[] {
  const changes: any[] = [];

  if (!oldObj && !newObj) return changes;

  const ignoredFields = [
    'reKycDone',
    'modifiedOn',
    'modifiedBy',
    'modifiedBy.id',
    'modifiedBy.email',
    'modifiedBy.phone',
    'modifiedBy.firstName',
    'modifiedBy.lastName',
    'modifiedBy.userType',
  ];

  const allKeys = new Set([
    ...Object.keys(oldObj || {}),
    ...Object.keys(newObj || {})
  ]);

  allKeys.forEach(key => {
    const oldValue = oldObj ? oldObj[key] : undefined;
    const newValue = newObj ? newObj[key] : undefined;

    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    // Skip ignored fields
    if (ignoredFields.includes(fullKey)) {
      return;
    }

    // Get the human-readable field name
    const fieldName = this.getFieldName(fullKey);

    // If both are objects → recursive
    if (
      oldValue &&
      newValue &&
      typeof oldValue === 'object' &&
      !Array.isArray(oldValue) &&
      typeof newValue === 'object' &&
      !Array.isArray(newValue)
    ) {
      changes.push(...this.getChangedFields(oldValue, newValue, fullKey)); // Recursion
    }

    // Arrays
    else if (Array.isArray(oldValue) || Array.isArray(newValue)) {
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({ field: fieldName, oldValue, newValue });
      }
    }

    // Primitives
    else {
      if (oldValue !== newValue) {
        changes.push({ field: fieldName, oldValue, newValue });
      }
    }

  });

  return changes;
}

private getFieldName(field: string): string {
  // Extract the last part of the path (e.g., 'nokPhone' from 'customerKyc.nokPhone')
  const fieldName = field.split('.').pop() || field;

  // Convert camelCase to space-separated words and capitalize each word
  return fieldName
    .replace(/([A-Z])/g, ' $1')  // Add a space before each uppercase letter
    .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
}


onPageChange(newPage: number) {
  if (newPage < 0 || newPage >= this.totalPages) return;

  this.page = newPage;
  this.changeLogs(this.selectedLogId);
}

  buildActivityGroups() {
  const user = this.customerUserDetails?.user;
  const kyc = this.customerUserDetails?.kyc;

  this.activityGroups = [];

  if (!user || !kyc) return;

  // ✅ Registration
  this.activityGroups.push({
    date: this.formatDate(kyc.createdOn),
    activities: [{
      icon: 'fas fa-user-plus',
      description: `
        Account registration completed successfully as 
        <a class="text-blue-950 underline">
          ${user?.firstName || 'NA'}
        </a>
        by Agent 
        <a class="text-blue-600 underline">
          ${kyc?.submittedBy?.firstName || 'NA'} - ID : ${kyc?.submittedBy?.id || 'NA'}
        </a>
      `,
      time: this.formatDateTime(kyc.createdOn),
      tags: [],
      status: ''
    }]
  });

  // ✅ Approved
  if (kyc?.approvedOn && kyc?.approvedBy) {
    this.activityGroups.push({
      date: this.formatDate(kyc.approvedOn),
      activities: [{
        icon: 'fas fa-check',
        description: `
          KYC Approved by 
          <a class="text-blue-600 underline">
            User ID : ${kyc?.approvedBy}
          </a>
        `,
        time: this.formatDateTime(kyc.approvedOn),
        tags: [],
        status: 'APPROVED'
      }]
    });
  }

  // ✅ Rejected
  if (kyc?.rejectedOn && kyc?.rejectedBy) {
    this.activityGroups.push({
      date: this.formatDate(kyc.rejectedOn),
      activities: [{
        icon: 'fas fa-times',
        description: `
          KYC Rejected by 
          <a class="text-blue-600 underline">
            User ID : ${kyc?.rejectedBy}
          </a>
        `,
        time: this.formatDateTime(kyc.rejectedOn),
        tags: [kyc?.rejectReason || 'No reason provided'],
        status: 'REJECTED'
      }]
    });
  }
}


formatDate(date: string) {
  if (!date) return 'NA';
  return new Date(date).toLocaleDateString();
}

formatDateTime(date: string) {
  if (!date) return 'NA';
  return new Date(date).toLocaleString();
}

  toggleStatus(channel: any) {
    let request : AccessChannelReq = {
      userId : this.customerUserDetails.user.id,
      accessChannels : [channel.name.toUpperCase()]
    }
    if(channel.status === 'Enabled'){
    this.crmService.removeAccessChannel(request).subscribe({  
      next: (response) => {
        if(response && response.responseCode === 200){
          alert("Removed Access Channel Successfully");
          this.accessChannels.find(ch => ch.name === channel.name)!.status = 'Disabled';
        }
        else{
          alert("Error -"+ response.error);
        }
        console.log('Remove Access Channel Response:', response);
      }
    });
  }
  else if (channel.status === 'Disabled'){
    this.crmService.addAccessChannel(request).subscribe({  
      next: (response) => {
        if(response && response.responseCode === 200){
          alert("Added Access Channel Successfully");
          this.accessChannels.find(ch => ch.name === channel.name)!.status = 'Enabled';
        }
        else{
          alert("Error -"+ response.error);
        }
        console.log('Add Access Channel Response:', response);
      }
    });
  }
  }

  toggleActivity(channel: any) {
    channel.activity = channel.activity === 'Active' ? 'Inactive' : 'Active';
  }

/*   public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      tooltip: { enabled: true },
      legend: { position: 'top' }
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }


  };

  public barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Cash In',
        backgroundColor: '#3a6b8a',
        data: [16000, 17000, 16500, 18000, 17800, 16200]
      },
      {
        label: 'Cash Out',
        backgroundColor: '#9c5b4f',
        data: [7000, 10200, 10100, 9500, 8700, 9900]
      },
      {
        label: 'Bills',
        backgroundColor: '#775987',
        data: [2000, 2200, 2400, 2500, 2600, 2800]
      },
      {
        label: 'Topups',
        backgroundColor: '#911e09',
        data: [3000, 3200, 3400, 3500, 3600, 3700]
      }
    ]
  }; */

  onBarClick(event: any) {
    console.log('Bar clicked', event);
  }

  onNavigate(route: string) {
    // Implement navigation logic here
    this.router.navigate([route]);
  }

  suspendUser(event: any, flag: any,flag2:any) {
      let dialogRef = this.dialog
        .open(SuspendUserDialogComponent, {
          width: "750px",
          height: "200px",
          data: { message: event, flag: flag,flag2:flag2 },
          panelClass: "custom-dialog-container",
          disableClose: true,
        })
        .afterClosed()
        .subscribe((res: any) => {
        this.refreshUserDetails();
          if (res == undefined) {
          }
        });
  }

   unSuspendUser(event: any) {
  console.log(event?.id);

  this.isLoading = true;

  this.corporate.unSuspendUser(event?.id).subscribe({
    next: (res) => {
      this.isLoading = false;
      if (res) {
        alert("Request Sent For UnSuspend");
        this.refreshUserDetails();
      } else {
        alert(res?.error);
      }
    },
    error: (error) => {
      this.isLoading = false;
      if (error.status === 500) {
        const errorMessage = error.error?.message || 'Maker cannot be checker';
        alert(errorMessage);
      } else {
        alert('An error occurred: ' + error.message);
      }
    }
  });
}

  authSuspendUser(event: any) {
  console.log(event?.id);

  this.isLoading = true;

  this.corporate.authSuspendUser(event?.id).subscribe({
    next: (res) => {
      this.isLoading = false;
      if (res) {
        alert("Suspended");
        this.refreshUserDetails();
      } else {
        alert(res);
      }
    },
    error: (error) => {
      this.isLoading = false;
      if (error.status === 500) {
        const errorMessage = error.error?.message || 'Maker cannot be checker';
        alert(errorMessage);
      } else {
        alert('An error occurred: ' + error.message);
      }
    }
  });
}

  authorizeUnSuspendUser(event: any, flag: any, flag2: any) {
    let dialogRef = this.dialog
      .open(SuspendUserDialogComponent, {
        width: "750px",
        height: "200px",
        data: { message: event, flag: flag, flag2: flag2 },
        panelClass: "custom-dialog-container",
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.refreshUserDetails();
        if (res == undefined) {
        }
      });
  }

  passwordUnlock(event: any, flag: any, flag2: any) {
    let dialogRef = this.dialog
      .open(SuspendUserDialogComponent, {
        width: "750px",
        height: "300px",
        data: { message: event, flag: flag, flag2: flag2 },
        panelClass: "custom-dialog-container",
        disableClose: true,
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.refreshUserDetails();
        if (res == undefined) {
        }
      });
    /* this.userService.passwordUnlock(id).subscribe(response =>{
      if(response.responseCode == 200){
        alert("Account Unlocked Successfully")
      }
      else if(response.responseCode == 0){
        alert("Error Occured - "+response.error)
      }
    }) */


  }

  approvePasswordUnlock(id: any) {
    this.isLoading = true;

  this.userService.passwordUnlockRevoke(id).subscribe({
    next: (response) => {
      this.isLoading = false;
      if(response.responseCode == 200){
        alert("Account Unlock Approved Successfully");
        this.customerUserDetails = this.crmService.getUserDetails();
      }
      else if(response.responseCode == 0){
        alert("Error Occured - "+response.error)
      }
    },
    error: () => {
      this.isLoading = false;
      alert("Something Went Wrong");
    }
  });
}

     getTransactions(){
      if (this.customerUserDetails?.user.walletAccount) {
        this.isLoading = true;
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);


        const lastMonth = oneMonthAgo;
        const formatDate = (date: Date): string => {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
          const year = date.getFullYear();
          return `${year}-${month}-${day}`;
        };
        /* this.transactionHitoryForm.patchValue({
          fromDate: formatDate(lastMonth),
          toDate: formatDate(today),
          type: 'ALL',
        }); */

        let walletNo = this.customerUserDetails?.user.walletAccount.accountNo;
        let fromDate = formatDate(lastMonth);
        let toDate = formatDate(today);
        let strToDate = toDate?.split('-').reverse().join('-');
        let strFromDate = fromDate?.split('-').reverse().join('-');

        // this.dataSharing.show();
        this.corporate.getTranasactionHistory(
          walletNo,
          'ALL',
          strFromDate,
          strToDate
        )
          .subscribe({
            next: (res) => {
              this.isLoading = false;
              if (res?.responseCode == 200) {
                this.tranactionHistory = res?.data;
                console.log(this.tranactionHistory);
              } else {
                alert("Failed to load transactions");
              }
            },

                /* this.totalCredit = this.tranactionHistory?.reduce(
                  (acc: number, item: any) => {
                    return acc + parseFloat(item?.creditAmount || '0');
                  },
                  0
                ); */

               /*  this.totalDebit = this.tranactionHistory?.reduce(
                  (acc: number, item: any) => {
                    return acc + parseFloat(item?.debitAmount || '0');
                  },
                  0
                ); */
               /*  this.totalCreditCount = this.tranactionHistory?.reduce(
                  (acc: number, item: any) => {
                    
                    return (
                      acc +
                      (parseFloat(item?.debitAmount) === 0 &&
                      parseFloat(item?.creditAmount) !== 0
                        ? 1
                        : 0)
                    );
                  },
                  0
                );

                this.totalDebitCount = this.tranactionHistory?.reduce(
                  (acc: number, item: any) => {
                    
                    return (
                      acc +
                      (parseFloat(item?.creditAmount) === 0 &&
                      parseFloat(item?.debitAmount) !== 0
                        ? 1
                        : 0)
                    );
                  },
                  0
                ); */
            //   }
            // },
            error: () => {
             this.isLoading = false;
              //this.dataSharing.hide();
              alert('Error While Loading Data');
            },
          });
      }
  
  }

 view(event: any, data: string) {
  this.showModalNew = true;
  this.isLoading = true;
  this.selectedLogId = event;
  this.page = 0; // reset page when opening

  if (data === 'view log') {
    this.showKycTable = false;

    this.corporate.getLogs(event).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log("view log acc deatils",res)
        this.viewDetails = res || [];
      },
      error: () => {
        this.isLoading = false;
        this.viewDetails = [];
        alert("Something Went Wrong");
      }
    });

  } else {
    this.showKycTable = true;
    this.changeLogs(event);
  }
}

  ngOnDestroy(): void {
    // Cleanup logic here if needed
  }

  verifyDepositLimit() {
  this.isLoading = true;

  this.crmService.authorizeEditDepositLimit(
    this.customerUserDetails.user.id
  ).pipe(
    finalize(() => {
      this.isLoading = false; // ✅ Always stop loader
    })
  ).subscribe({
    next: (response: any) => {

      if (response?.responseCode === 200) {
        alert(response.data);
        this.refreshUserDetails();
      } else {
        alert("Error - " + response?.error);
        this.refreshUserDetails();
      }

    },
    error: (err) => {
      console.error("Authorize Error:", err);
      alert(err?.error?.message || "Something Went Wrong");
    }
  });
}

 editDepositLimit() {

  const newLimit = prompt(
    "Enter new deposit limit:",
    this.customerUserDetails.user.depositLimit?.toString() || "0"
  );

  if (newLimit === null || newLimit.trim() === "") return;

  const parsedValue = Number(newLimit);

  if (isNaN(parsedValue) || parsedValue < 0) {
    alert("Please enter a valid positive number.");
    return;
  }

  this.isLoading = true;

  this.crmService.initiateEditDepositLimit(
    this.customerUserDetails.user.id,
    parsedValue
  ).pipe(
    finalize(() => {
      this.isLoading = false; // ✅ Always stops loader
    })
  ).subscribe({
    next: (response: any) => {

      if (response?.responseCode === 200) {
        alert("Deposit Limit Update Initiated Successfully");
        this.refreshUserDetails();
      } else {
        alert(response?.error || "Error occurred");
      }

    },
    error: (err) => {
      console.error("Initiate Error:", err);
      alert(err?.error?.message || "Something Went Wrong");
    }
  });
}

  // getImagesProfile() {
  //   if (this.selectedUserType == 'CUSTOMER') {
  //     this.customerPhoto = this.customerUserDetails.kyc?.customerKyc?.custPhoto;
  //     console.log(this.customerPhoto, "INSIDE CUST PHOTO");
  //   }
  //   if (this.selectedUserType == 'AGENT') {
  //     this.customerPhoto = this.customerUserDetails.kyc?.agentKyc?.custPhoto;
  //     console.log(this.customerPhoto, "INSIDE AGENT PHOTO");
  //   } if (this.selectedUserType == 'MASTER_AGENT') {
  //     this.customerPhoto = this.customerUserDetails.kyc?.masterAgentKyc?.custPhoto;
  //     console.log(this.customerPhoto, "INSIDE MASTER_AGENT PHOTO");
  //   }
  //   if (this.selectedUserType == 'CORPORATE') {
  //     this.customerPhoto = this.customerUserDetails.kyc?.corporateKyc?.custPhoto;
  //     console.log(this.customerPhoto, "INSIDE CORPORATE PHOTO");
  //   }
  // }

  refreshUserDetails() {
    this.isLoading = true;

    this.crmService.viewUser(this.customerUserDetails.user.id).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        if (response?.responseCode == 200) {
          this.customerUserDetails = response.data;
          this.crmService.setUserDetails(response.data);
          this.KycService.setItem(this.customerUserDetails.kyc);
          console.log('View Customer Details:', response);
        } else {
          alert("Failed to refresh user details");
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Something Went Wrong While Refreshing");
      }
    });
  }

  downloadPdf() {
    if (!this.showKycTable) {
      this.isLoading = true;
      this.userService.downloadUserLog(this.customerUserDetails?.user?.id)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (res: Blob) => {
            this.downloadFile(res, 'user-log.pdf');
          },
          error: (err: any) => {
            console.error('PDF Error:', err);
            this.handleBlobError(err, 'PDF Download Failed');
          }
        });
    }
    else {
      this.isLoading = true;
      this.userService.downloadChangeLogs(this.customerUserDetails?.kyc?.id)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (res: Blob) => {
            this.downloadFile(res, 'kyc-change-log.pdf');
          },
          error: (err: any) => {
            console.error('PDF Error:', err);
            this.handleBlobError(err, 'PDF Download Failed');
          }
        });
    }
  }

  handleBlobError(err: any, fallbackMsg: string) {
    if (err?.error instanceof Blob) {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const text = reader.result as string;
          const json = JSON.parse(text);
          alert(json.message || fallbackMsg);
        } catch {
          alert(reader.result || fallbackMsg);
        }
      };

      reader.readAsText(err.error);
    } else {
      alert(err?.error?.message || fallbackMsg);
    }
  }
  
  downloadFile(data: Blob, fileName: string) {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

viewKycForm() {

  const kyc = this.customerUserDetails?.kyc;
  const kycType = kyc?.kycType;

  if (!kycType) return;

  const routeMap: { [key: string]: string } = {
    CUSTOMER: 'kyc/view-customer-kyc',
    AGENT: 'kyc/view-agent-kyc',
    MERCHANT: 'kyc/view-agent-kyc',
    CORPORATE: 'kyc/view-superagent-kyc',
    NGO: 'kyc/view-superagent-kyc',
    UN_AGENCY: 'kyc/view-superagent-kyc',
    GOVT_AGENCY: 'kyc/view-superagent-kyc',
    'MASTER AGENT': 'kyc/view-masteragent-kyc'
  };

  const route = routeMap[kycType];

  if (route) {

    // ✅ Store ONLY KYC object
    this.KycService.setItem(kyc);

    this.router.navigate([route], {
      queryParams: { from: this.router.url }
    });

  } else {
    console.warn('Unknown KYC Type:', kycType);
  }
}

}

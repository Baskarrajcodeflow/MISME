import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule,NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WalletService } from '../wallet-management/wallet-managemnt.service';
import { AuthorizePushPullDialogComponent } from '../Dialog/authorize-push-pull-dialog/authorize-push-pull-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface walletDetails{
  id: any,
  fullName : string,
  walletNo : string,
  createdDate : string,
  tagStatus ?: string,
  email : string,
  phone: string,
  showLink: boolean,
  showList: boolean,
  showAuthorize: boolean,



  
}

@Component({
  selector: 'app-push-pull-money',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './push-pull-money.component.html',
  styleUrl: './push-pull-money.component.css'
})
export class PushPullMoneyComponent {

  amount : any;
  pin :any;
  tab = 'push'
  tab1 = 'Push/Pull'
  currentBalance:any;
  accountList :any = [];
  walletList :any = [];
  walletData:any ;
  accountId :any;
  transactionHitoryForm!: FormGroup;
  array:any[]=[]
  tranactionHistory:any
  baseUserId: any;
  search(){}
  constructor(private walletService : WalletService,
    private fb: FormBuilder,
    private dialog:MatDialog

  ){

  }

  ngOnInit(){
    this.baseUserId = sessionStorage.getItem('loginUserId')
    this.getWalletDetails();
  //  --------------------------Transaction History-----------------//
  this.transactionHitoryForm = this.fb.group({
    fromDate: [''],
    toDate: [''],
    type: [''],
  });


  }
  getWalletDetails(){
    this.walletService.getSystemWallets().subscribe((resp : any) =>{
      console.log("System Wallet -",resp);
      if(resp.responseCode == 200){
        this.walletList = resp.data;        
      }
      
      else{
        alert("Something went wrong")
      }



     })

  }

  showLinkedAccounts($event : any){
    if(this.walletData !=null || this.walletData != '', this.walletData != 'undefined'){
      //this.showLinkedAccounts(this.wallet);
      console.log("Wallet", $event.target.value);  
      let walletNo;    

      for(let item of this.walletList){
        if(item.id == $event.target.value){
           walletNo = item.walletAccount.walletNo;

        }
      }
      this.walletService.getWalletBalance(walletNo).subscribe((response)=>{
        if(response.responseCode == 200){
          this.currentBalance = response?.data;

        }
        else{
          alert("Not able to fetch balance");
        }
      })
   
    this.walletService.getLinkedAccountsSystemWallet($event.target.value).subscribe((response) => {
      if(response.responseCode == 200){
        this.accountList = response.data;
        
      }
      else{
        alert("Not able to fetch linked bank accounts now. Try again");
      }
    })
    this.walletService.getPullPush($event.target.value).subscribe({
      next:(res)=>{
        console.log(res);
        this.tranactionHistory = res?.data
      }
    })
  }
  }
  authorize(event:any){
let dialogRef = this.dialog
.open(AuthorizePushPullDialogComponent, {
  width: "500px",
  height: "220px",
  panelClass: "custom-dialog-container",
  data: event,
  disableClose: true,
})
.afterClosed()
.subscribe((res:any) => {
  console.log(res);
//  this.dialogRef.close()
});
  }

  onSubmit(){
    let serviceName = '';

    if(this.tab == 'push'){
       serviceName = 'GB_PUSH';
    }
    else{
       serviceName = 'GB_PULL';
    }
    
    

    

  
  let pullPushReq = {
    "initiator": {
      "id": sessionStorage.getItem('loginUserId')
  },
  "serviceProvider": {
  "id": this.walletData
},
"serviceReceiver": {
  "id": this.walletData
},
"context": {
  "SERVICE_NAME": serviceName,
  "MEDIUM": "Web",
  "CHANNEL": "BACKOFFICE",
  "AMOUNT": this.amount.toString(),
  "bankPin": "",
  "bankAccId": this.accountId
}     

}
this.walletService.addPushPull(pullPushReq).subscribe({
  next:(response)=>{
      if(response.responseCode == 200){
        alert("Success")
        this.walletData = ''
        this.accountId = ''
        this.amount = ''
      }
      else{
        alert("Failed,, Try Again");
      }
  },error:()=>{
    alert("Failed,, Try Again");
  }
})
}

  selectTab(selected :any){
    this.tab = selected;

  }
  selectTab1(selected :any){
    this.tab1 = selected;

  }



  
}

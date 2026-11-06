import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ApiServiceService } from '../../../../../product/api-service/api-service.service';
import { Router } from '@angular/router';
export class Country {
  constructor(public name: string, public code: string) {}
}
@Component({
  selector: 'app-register-copoarte-user',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,],
  templateUrl: './register-copoarte-user.component.html',
  styleUrl: './register-copoarte-user.component.css'
})
export class RegisterCopoarteUserComponent {
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  corpsData: any;
  value:any
ngOnInit(): void {

  this.apiService.getAuthorizedCorporate().subscribe({
    next:(res)=>{
      console.log(res);
      if(res){
        this.corpsData = res
      }else{
        alert(res?.error)
      }
    },error:()=>{
      alert('Something Went Wrong!!!')
    }
  })
  
}


constructor(private apiService:ApiServiceService,private router:Router){

}

passwordMatchValidator: any = (formGroup: FormGroup): { [key: string]: boolean } | null => {
  const password = formGroup.get('password')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordsDoNotMatch: true };
};
corpForm = new FormGroup({
  firstName: new FormControl('', Validators.required),
  lastName: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
  dob: new FormControl('', Validators.required),
  phone: new FormControl('', [Validators.required, Validators.pattern(/^[7][0-9]{8}$/)]),
  basicGender: new FormControl('', Validators.required),
  password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  confirmPassword: new FormControl('', Validators.required),
  role: new FormControl('', Validators.required),
  selectCorp: new FormControl('', Validators.required),
}, { validators: this.passwordMatchValidator });



  select(event:any){
    console.log(event?.target?.value);
    this.value = event?.target?.value
   }
  register(){
    let data={
      firstName:this.corpForm.controls['firstName'].value,
      lastName:this.corpForm.controls['lastName'].value,
      email:this.corpForm.controls['email'].value,
      dob:this.corpForm.controls['dob'].value,
      phone:this.corpForm.controls['phone'].value,
      gender:this.corpForm.controls['basicGender'].value,
      password:this.corpForm.controls['password'].value,
      corpUserRole:this.corpForm.controls['role'].value,
    }
console.log(this.value);

this.apiService.registerCorporateUser(data,this.value).subscribe({
  next:(res:any)=>{
    console.log(res);
    if(res?.responseCode == 200){
      alert('Corporate User Created Successfully')
      this.router.navigateByUrl('/viewcorporate')
    }else{
      alert(res?.error)
    }
  },error:()=>{
    alert('Something Went Wrong.Try Again!!!')
  }
})
  }

  get passwordsDoNotMatch() {
    return this.corpForm.hasError('mismatch') &&
      this.corpForm.get('confirmPassword')?.touched;
  }
  back(){
    this.router.navigateByUrl('/viewcorporate')
  }
}

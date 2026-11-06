import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserManagementService } from '../user-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { customerRegistration } from '../../../../interface/interface-list';
import { ToastService } from '../../../../toast.service';


@Component({
  selector: 'app-corporate-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './corporate-form.component.html',
  styleUrl: './corporate-form.component.css'
})
export class CorporateFormComponent {
  
  isCreatingUser: boolean = false;
  userCreateForm: FormGroup;
  userId: string | null = null;
  customerRequest! : customerRegistration;

  fields = [
    { id: 'firstName', name: 'firstName', label: 'First Name', type: 'text' },
    { id: 'lastName', name: 'lastName', label: 'Last Name', type: 'text' },
    { id: 'gender', name: 'gender', label: 'Gender', type: 'select', options: ['MALE', 'FEMALE', 'OTHERS', 'DEFAULT'] },
    { id: 'phone', name: 'phone', label: 'Phone', type: 'text', errors: { minlength: { requiredLength: 9 } } },
    { id: 'email', name: 'email', label: 'Email', type: 'email' },
    { id: 'userName', name: 'userName', label: 'User NAME', type: 'text' },
    { id: 'password', name: 'password', label: 'Password', type: 'password' },
  ];

  constructor(private userService: UserManagementService, private fb: FormBuilder, private router: Router, private toastService: ToastService,private route: ActivatedRoute) {
    this.userCreateForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      userName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(9)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      if (this.userId) {
        this.userService.getAllUsers().subscribe(user => {
          this.userCreateForm.patchValue(user);
        });
      }
    });
  }
  
  onSubmit(): void {
    if (this.userCreateForm.valid) {
      const formData = this.userCreateForm.value;
      this.customerRequest = {
      email:formData.email,
      username: formData.userName,
      userType:"CUSTOMER",
      password: formData.password,
     userProfile: {
        firstName: formData.firstName,
        lastName:formData.lastName,
        phone: formData.phone,
        gender: formData.gender
      }
    }
      
      if (this.userId) {
        this.userService.editCustomer(this.customerRequest).subscribe((response: any) => {
          console.log('User updated successfully:', response);
          this.router.navigate(['/CustomerManagement']);
        }, (error: any) => {
          console.error('Error updating user:', error);
        });
      } else {
        this.userService.registerCustomer(this.customerRequest).subscribe((response: any) => {
          console.log('User created successfully:', response);
          this.router.navigate(['/CustomerManagement']);
        }, (error: any) => {
          console.error('Error creating user:', error);
        });
      }
    }
  }
}

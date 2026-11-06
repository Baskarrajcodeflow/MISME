import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../toast.service';
import { BackOffice, UserManagementService } from '../open-api';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit{

  userCreateForm: FormGroup;
  boUserId: any;
  userRequest!:Partial<BackOffice>;
  RoleList: any;

  fields = [
    { id: 'firstName', name: 'firstName', label: 'First Name', type: 'text' },
    { id: 'lastName', name: 'lastName', label: 'Last Name', type: 'text' },
    { id: 'phone', name: 'phone', label: 'Phone', type: 'text', errors: { minlength: { requiredLength: 9 } } },
    { id: 'email', name: 'email', label: 'Email', type: 'text' },
    { id: 'role', name: 'role', label: 'Role', type: 'select', options: ['ADMIN'] },
    { id: 'password', name: 'password', label: 'Password', type: 'password' },
    { id: 'username', name: 'username', label: 'User Name', type: 'text' },
    { id: 'userType', name: 'userType', label: 'User Type', type: 'select', options: ['BACKOFFICE'] }
  ];

  constructor(private userService: UserManagementService, private fb: FormBuilder, private router: Router, private toastService: ToastService,private route: ActivatedRoute) {
  
    this.userCreateForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(9)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', Validators.required],
      username: ['', Validators.required],
      userType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // this.getRole();
    this.route.paramMap.subscribe(params => {
      this.boUserId = params.get('id');
      if (this.boUserId) {
        this.userService.getBOUserById('',this.boUserId).subscribe({
          next: (value: any) => {
          this.userCreateForm.patchValue(value);
          }
        });
      }
    });
  }
  
  getRole() {
    // this.userService.getRole().subscribe({
    //   next: (value: JSON) => {
    //     this.RoleList = value;
    //   }
    // })
  }

  onSubmit(): void {
    if (this.userCreateForm.valid) {
      const formData = this.userCreateForm.value;
      this.userRequest = {
      email: formData.email,
      username: formData.userName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      userType: 'BO',
      phone: formData.phone,
      // password: formData.password,
      role: {
        name: formData.role,
      },
    }
        this.userService.createBOUser(this.userRequest).subscribe({
          next: (value: any) => {
            if (value.status == 201) {
              console.log('User updated successfully:', value);
              this.toastService.showMessage('success', 'User updated successfully');
              this.router.navigate(['/UserManagement']);
            }
            else {
            }
          }, error: (error) => {
            alert("something went wrong")
            console.error('Error:', error);
          }
        })
    }
  }
}

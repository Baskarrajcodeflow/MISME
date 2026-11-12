import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { LoaderComponent } from '../../../../loader/loader.component';
import { BackOffice } from '../openapi';
import { boService } from '../bo/bo.service';
import { showToast } from '../../../../core/toast/toast';

@Component({
  selector: 'app-bo-user-edit',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, LoaderComponent, FormsModule, CommonModule],
  templateUrl: './bo-user-edit.component.html',
  styleUrl: './bo-user-edit.component.css'
})
export class BoUserEditComponent implements OnInit {

  @Input() backOffice: any | undefined;
  @Input() isDisableField!: boolean;

  @Output() save = new EventEmitter<BackOffice>();
  @Output() cancel = new EventEmitter<void>();

  backOfficeForm!: FormGroup;
  roles: any[] = [];
  departments: any[] = [];
  branches: any[] = [];
  isLoading: boolean = false;

  selectedRole: any;
  branchId: any;
  departmentId: any;

  constructor(
    private fb: FormBuilder,
    private backOfficeService: boService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadBranches();

    // Ensure backOffice is available before patching
    setTimeout(() => {
      this.setBackOfficeForm();
    }, 0);
  }

  initializeForm() {
    this.backOfficeForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      username: [{ value: '', disabled: true }, [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("^(\\+93|0)?7[0-9]{8}$")]],
      userType: ['BO'],
      active: [false],
      deleted: [false],
      branchId: ['', Validators.required],
      departmentId: ['', Validators.required],
      roleData: ['', Validators.required]
    });
  }

  setBackOfficeForm() {
    if (!this.backOffice) return;

    // 🔹 NORMALIZE TO STRING (CRITICAL FIX)
    this.branchId = String(this.backOffice.branch?.id);
    this.departmentId = String(this.backOffice.department?.id);

    // Patch basic fields first
    this.backOfficeForm.patchValue({
      email: this.backOffice.email,
      username: this.backOffice.email,
      firstName: this.backOffice.firstName,
      lastName: this.backOffice.lastName,
      phone: this.backOffice.phone,
      branchId: this.branchId
    });

    if (this.branchId) {
      this.loadDepartments(() => {

        // Patch department ONLY after list loads
        this.backOfficeForm.patchValue({
          departmentId: this.departmentId
        });

        if (this.departmentId) {
          this.getRole(this.departmentId, () => {
            this.backOfficeForm.patchValue({
              roleData: this.backOffice.roleData
            });
          });
        }
      });
    }
  }

  onSave() {
    const formValue = this.backOfficeForm.getRawValue();

    const payload = {
      ...this.backOffice,
      email: formValue.email,
      username: formValue.username,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phone: formValue.phone,
      branch: { id: formValue.branchId },
      department: { id: formValue.departmentId, branchId: formValue.branchId },
      roleData: {
        id: formValue.roleData.id,
        name: formValue.roleData.roleName
      }
    };

    console.log('EDIT PAYLOAD:', payload);
    this.save.emit(payload);
  }

  onSelectBranch(event: any) {
    this.branchId = String(event.target.value);
    this.backOfficeForm.patchValue({ departmentId: '', roleData: '' });
    this.loadDepartments();
  }

  loadDepartments(callback?: () => void) {
    this.isLoading = true;
    this.backOfficeService.getDepartmentByBranch(this.branchId).subscribe({
      next: (departments: any) => {

        this.departments = departments || [];

        // Re-apply saved department after load
        if (this.departmentId) {
          this.backOfficeForm.patchValue({
            departmentId: this.departmentId
          });
        }

        this.isLoading = false;
        if (callback) callback();
      },
      error: () => {
        this.isLoading = false;
        showToast("Something went wrong");
      }
    });
  }

  onSelectDepartment(event: any) {
    this.departmentId = String(event.target.value);
    this.backOfficeForm.patchValue({ roleData: '' });
    this.getRole(this.departmentId);
  }

  getRole(departmentId: any, callback?: () => void) {
    this.isLoading = true;
    this.backOfficeService.getRolesByDepartment(departmentId).subscribe({
      next: (roles: any) => {
        this.roles = roles?.data || [];
        this.isLoading = false;
        if (callback) callback();
      },
      error: () => {
        this.isLoading = false;
        showToast("Something went wrong");
      }
    });
  }

  onCancel() {
    this.cancel.emit();
  }

  loadBranches(): void {
    this.isLoading = true;
    this.backOfficeService.getBranch().subscribe({
      next: (branches: any) => {
        this.branches = branches || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        showToast("Something went wrong");
      }
    });
  }

  // Needed for role object matching
  compareRole(r1: any, r2: any): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }
}

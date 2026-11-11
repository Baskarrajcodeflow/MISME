import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BackOffice } from '../../openapi'; // Make sure this import is correct
import { RoleManagementControllerService, BranchControllerServiceService, DepartmentControllerServiceService } from '../../../../../role-management/role-management/role-management/openapi';
import { LoaderComponent } from '../../../../../loader/loader.component';
import { boService } from '../bo.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { showToast } from '../../../../../core/toast/toast';

@Component({
  selector: 'app-bo-view',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, LoaderComponent, FormsModule,CommonModule],
  templateUrl: './bo-view.component.html',
  styleUrl: './bo-view.component.css'
})
export class BoViewComponent implements OnInit, OnChanges {
  @Input() backOffice: any | undefined; // Type the input correctly
  @Output() save = new EventEmitter<BackOffice>();
  @Output() cancel = new EventEmitter<void>();
  @Input() isDisableField!: boolean;
  backOfficeForm!: FormGroup; // Use definite assignment assertion
  roles: any[] = [];
  departments: any[] = []; // Initialize as empty array
  branches: any[] = [];   // Initialize as empty array
  isLoading: boolean = false;
  selectedRole: any; // Store selected role object

  constructor(
    private fb: FormBuilder,
    private backOfficeService: boService,
    private roleService: RoleManagementControllerService,
    private branchService: BranchControllerServiceService,
    private departmentService: DepartmentControllerServiceService
  ) { }

  ngOnInit(): void {
    this.initializeForm(); // Initialize form in ngOnInit
    this.loadBranches();
  }

  ngOnChanges(changes: SimpleChanges): void {
  const backOfficeChange = changes['backOffice'];
  if (!backOfficeChange) {
    return; // no change to backOffice
  }

  const current = backOfficeChange.currentValue;

  if (current) {
    // Edit / load existing BO data into the form
    this.backOffice = current;
    this.setBackOfficeForm();
  } else {
    // Create / register case — no backOffice passed in
    this.backOffice = undefined;
    this.initializeForm();
    this.loadBranches(); // reload branch list for the empty/register form
  }
}


  initializeForm() {
    this.backOfficeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: [{ value: '', disabled: true }, [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("^(\\+93|0)?7[0-9]{8}$")]],
      userType: ['BO'],
      pwdUpdatedOn: [''],
      pwdExpiry: [''],
      active: [false],
      deleted: [false],
      roleData: ['', Validators.required],
      department: this.fb.group({
        id: [''],
        name: ['']
      }),
      branch: this.fb.group({
        id: [''],
        name: ['']
      }),
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/)]],
      // Validators.minLength(6)
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }
  setBackOfficeForm() {
    if (this.backOffice?.id != undefined) {
      this.backOfficeForm.patchValue(this.backOffice);
      this.selectedRole = this.backOffice.roleData ?? null;

      if (this.backOffice.branch?.id) {
        this.branchId = this.backOffice.branch.id;
        this.loadDepartments(() => {
          if (this.backOffice.department?.id) {
            this.departmentId = this.backOffice.department.id;
            this.getRole(this.departmentId);
          }
        });
      } else {
        this.backOfficeForm.patchValue({ department: null, roleData: null });
        this.departments = [];
        this.roles = [];
        this.selectedRole = null;
      }
    } else {
      this.backOfficeForm.reset({
        id: undefined,
        userType: 'BO', // Reset with default values
        active: false,
        deleted: false,
      });
      this.selectedRole = null;
      this.departments = [];
      this.roles = [];
    }
  }



  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  };

  get passwordsDoNotMatch() {
    return this.backOfficeForm.hasError('mismatch') && this.backOfficeForm.get('confirmPassword')?.touched;
  }

  onSave() {
    const formValue = this.backOfficeForm.getRawValue();
    delete formValue.confirmPassword; // Remove confirmPassword before emitting

    // Ensure id is undefined if it's null
    //formValue.id = formValue.id ?? '';

    if (formValue.roleData) {
      formValue.roleData = { id: formValue.roleData.id, name: formValue.roleData.roleName };
    }

    if (formValue.department) {
      formValue.department = { id: this.departmentId, branchId: this.branchId };
    }

    if (formValue.branch) {
      formValue.branch = { id: this.branchId };
    }
    console.log('Form Value on Save:', formValue);
    this.save.emit(formValue);
  }

  departmentId: any;
  branchId: any;
  onSelectBranch(event: any) {
    this.branchId = event.target.value;
    this.loadDepartments(); // No callback needed here, as it's not setting departmentId directly
    this.departments = [];
    this.roles = [];
    this.backOfficeForm.patchValue({ department: null, roleData: null });
    this.selectedRole = null;
    this.departmentId = null; // Reset departmentId
  }

  loadDepartments(callback?: () => void) {
    this.isLoading = true;
    this.backOfficeService.getDepartmentByBranch(this.branchId).subscribe({
      next: (departments: any) => {
        this.departments = departments || [];
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
    this.departmentId = event.target.value;
    this.getRole(this.departmentId);
    this.roles = [];
    this.backOfficeForm.patchValue({ roleData: null });
    this.selectedRole = null;
  }


  getRole(departmentId: any) {
    this.isLoading = true;
    this.backOfficeService.getRolesByDepartment(departmentId).subscribe({
      next: (roles: any) => {
        this.roles = roles?.data || [];  // Handle potential null or undefined
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        showToast("Something went wrong");
      }
    });
  }


  onEmailInput() {
    const email = this.backOfficeForm.get('email')?.value;
    if (email) {
      this.backOfficeForm.patchValue({ username: email });
    }
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
}
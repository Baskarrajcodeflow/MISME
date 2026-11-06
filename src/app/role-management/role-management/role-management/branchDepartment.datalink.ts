import { Injectable, signal } from "@angular/core";
import { Branch, Department, } from "./entity.types";
import { DepartmentService } from "./department/deparment.service";
import { BranchService } from "./branch/branch.service";

@Injectable(
  {
    providedIn: 'any'
  }
)
export class RoleMgmtDataLink {
  branches = signal<Branch[]>([])
  departments = signal<Department[]>([])
  selectedBranch = signal<Branch>({} as Branch)
  selectedDepartment = signal<Department>({} as Department)
  // selectedRole = signal<Role>({} as Role)

  constructor(
    private departmentSvc: DepartmentService,
    private branchSvc: BranchService,
  ) { }

  loadBranches() {
    this.branchSvc.getAllBranches().subscribe({
      next: (b: Branch[]) => this.branches.set(this.branches().concat(b))
    })
  }

  resetDepartmentSignals() {
    this.departments = signal<Department[]>([])
    this.selectedDepartment = signal<Department>({} as Department)
  }

  addBranch(name: string): void {
    this.branchSvc.addBranch({ id: null, name, departments: [] }).subscribe({
      next: (newBranch: Branch) => this.branches.set([...this.branches(), newBranch]),
      error: (err) => console.error('Failed to add branch', err)
    });
  }

  saveBranch(b: Branch): void {
    this.branchSvc.updateBranch(b).subscribe({
      next: (uBranch: Branch) => {
        const updatedBranches = this.branches().filter(branch => branch.id !== uBranch.id);
        updatedBranches.push(uBranch);
        this.branches.set(updatedBranches);
      },
      error: (err) => console.error('Failed to update branch', err)
    });
  }

  deleteBranch(branch: Branch): void {
    if (branch.id === null) {
      console.error('Attempted to delete a branch without an ID.');
      return;
    }
    this.branchSvc.deleteBranch(branch.id).subscribe({
      next: (delBranch: Branch) => {
        const updatedBranches = this.branches().filter(b => b.id !== delBranch.id);
        this.branches.set(updatedBranches);
      },
      error: (err) => console.error('Failed to delete branch', err)
    });
  }

  addDepartment(name: string): void {
    const newDepartment = { name };
    this.departmentSvc.addDepartment(newDepartment as Department).subscribe({
      next: (addedDepartment: Department) => {
        const updatedDepartments = [...this.departments(), addedDepartment];
        this.departments.set(updatedDepartments);
      },
      error: (err) => console.error('Failed to add department', err)
    });
  }

  updateDepartment(department: Department): void {
    if (department.id !== null) {
      this.departmentSvc.updateDepartment(department).subscribe({
        next: (uDepartment: Department) => {
          const updatedDepartments = this.departments().filter(d => d.id !== uDepartment.id);
          updatedDepartments.push(uDepartment);
          this.departments.set(updatedDepartments);
        },
        error: (err) => console.error('Failed to update department', err)
      });
    } else {
      console.error('Cannot update a department without an ID.');
    }
  }

  toggleEditMode(id: number | null): void {
    if (id !== null) {
      // Implement the edit mode toggle logic here, depending on your application structure.
    }
  }

  removeDepartment(id: number | null): void {
    if (id !== null) {
      this.departmentSvc.deleteDepartment(id).subscribe({
        next: (dDepartment: Department) => {
          const updatedDepartments = this.departments().filter(d => d.id !== dDepartment.id);
          this.departments.set(updatedDepartments);
        },
        error: (err) => console.error('Failed to delete department', err)
      });
    } else {
      console.error('Cannot delete a department without an ID.');
    }
  }

}
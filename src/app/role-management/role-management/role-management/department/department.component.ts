import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Branch, BranchControllerServiceService, Department, DepartmentControllerServiceService } from '../openapi';
import { NgFor, NgIf } from '@angular/common';
import { LoaderComponent } from '../../../../loader/loader.component';
import { RoleService } from '../role.service';
import { roleService } from '../../../role.service';
import { showToast } from '../../../../core/toast/toast';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [FormsModule,NgFor,NgIf,LoaderComponent],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentComponent implements OnInit{

  departmentName! : string;
  selectedBranch! : number;
  departmentDesc! : string;
  departmentReq!  : Department;
  branches:Branch [] = [];
  @Output() departmentCreated = new EventEmitter<boolean>();
  isLoading: boolean = false;


  constructor( private roleService: roleService,private departmentService:DepartmentControllerServiceService, private branchService:BranchControllerServiceService){}

  ngOnInit(): void {
    this.getBranches();

  }

  getBranches(){
    this.isLoading = true;
   this.roleService.getBranch().subscribe({
    next : (branch:any) =>{
      this.branches = branch;
      this.isLoading = false;
    },
    error: () => {
      this.isLoading = false;
      showToast("Something went wrong");
    }
  })
  }

  onSubmit(){
    this.isLoading = true;
    this.departmentReq = {
        name: this.departmentName,
        branchId: this.selectedBranch
    }
    this.roleService.createDepartment(this.departmentReq).subscribe({
      next : (department:any)=>{
        if(department){
          showToast("Department created successfully");
          this.departmentName = '';
          this.isLoading = false;
          this.departmentCreated.emit(true);
        }
        else{
          showToast("Something went wrong");
          this.isLoading = false;

        }
      },
      error: (error) => {
        showToast("Something went wrong");
      }
    })
  }
}

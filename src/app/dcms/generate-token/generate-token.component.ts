import { Component } from '@angular/core';
import { DcmsService } from '../dcms.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgClass, NgFor, CommonModule } from '@angular/common';

@Component({
  selector: 'app-generate-token',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './generate-token.component.html',
  styleUrl: './generate-token.component.css'
})
export class GenerateTokenComponent {
  generateTokenForm: FormGroup = new FormGroup({});
  userPrevilages1: any;
  privilege: any;
  userPrivileges: any;
  projectList: any;
  isLoading: boolean = false;
  subprojectList: any;
  showTable: boolean = false
  beneficiaryList: any;
  constructor(private dcmsService: DcmsService, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.generateTokenForm = this.fb.group({
      project: ['', [Validators.required]],
      subproject: ['', Validators.required],
    })
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "User Management") {
          if (item.subComponent?.subComponentName == "MM Staff")
            this.privilege = item;
        }
      }
    }
    this.getProjectList();
    this.getSubprojectList();
  }
  getProjectList() {
    this.dcmsService.getProjectList().subscribe((data: any) => {
      this.projectList = data
    })
  }
  getSubprojectList() {
    this.dcmsService.getSubprojectList().subscribe((data: any) => {
      this.subprojectList = data
    })
  }
  fetch() {
    this.showTable = true;
    this.dcmsService.getBeneficiariesList().subscribe((data: any) => {
      this.beneficiaryList = data?.response
    })
  }
}

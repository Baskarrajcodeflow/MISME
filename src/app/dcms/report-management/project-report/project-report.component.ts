import { Component } from '@angular/core';
import { DcmsService } from '../../dcms.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-project-report',
  standalone: true,
  imports: [NgIf,NgClass,NgFor,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './project-report.component.html',
  styleUrl: './project-report.component.css'
})
export class ProjectReportComponent {
  reportForm: FormGroup = new FormGroup({});
  userPrevilages1: any;
  privilege: any;
  userPrivileges: any;
  projectList: any;
  isLoading: boolean = false;
  subprojectList: any;
  showTable: boolean = false
  beneficiaryList: any;
  selectedFileName: any;
  constructor(private dcmsService: DcmsService) { }
  ngOnInit(): void {
    // this.reportForm = this.fb.group({
    //   project: ['', [Validators.required]],
    //   subproject: ['', Validators.required]
    // })
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
  }
  getReports() {
    this.showTable = true;
    this.dcmsService.getReports().subscribe((data: any) => {
      this.beneficiaryList = data?.response
    })
  }
}

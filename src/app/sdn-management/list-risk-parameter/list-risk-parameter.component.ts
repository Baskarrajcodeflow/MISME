import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AmlService } from '../aml.service';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-risk-parameter',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,
    NgFor, NgIf, NgClass
  ],
  templateUrl: './list-risk-parameter.component.html',
  styleUrls: ['./list-risk-parameter.component.scss']
})
export class ListRiskParameterComponent implements OnInit {
  data: any;
  isLoading: boolean = false;

  constructor(private router: Router,
    private amlService: AmlService
  ) { }

  ngOnInit(): void {
    this.listRiskParameter();
  }
  listRiskParameter() {
    this.isLoading = true
    this.amlService.listRiskParameter().subscribe((data: any) => {
      this.isLoading = false
      this.data = data.filter((item:any) => item.score !== 0);
    })
  }
  onDelete(item: any) {
    this.isLoading = true
    let req={
      "id":item?.id
    }
    this.amlService.deleteRiskParameter(req).subscribe((data: any) => {
      this.isLoading = false
      if (data) {
        alert("Success");
        this.data = this.data.filter((i: any) => i.id !== item.id); }
      else {
        alert("Failed");
      }
    })
  }
  onClickAdd() {
    this.router.navigateByUrl("/create-risk-parameter");
  }
}

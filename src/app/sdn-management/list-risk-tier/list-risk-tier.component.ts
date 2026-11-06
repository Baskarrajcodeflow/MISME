import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AmlService } from '../aml.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-list-risk-tier',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,
    NgFor, NgIf, NgClass
  ],
  templateUrl: './list-risk-tier.component.html',
  styleUrls: ['./list-risk-tier.component.scss']
})
export class ListRiskTierComponent implements OnInit {
  data: any;
  isLoading: boolean=false;

  constructor(private router: Router,
    private amlService: AmlService
  ) { }

  ngOnInit(): void {
    this.listRiskTier();
  }
  listRiskTier() {
    this.isLoading=true
    this.amlService.listRiskTier().subscribe((data: any) => {
    this.isLoading=false
    // this.data = data
    this.data = data.filter((item: any) => item.fromScore !== 0 || item.toScore !== 0);
    })
  }
  onDelete(item: any) {
    this.isLoading = true
    let req={
      "id":item?.id
    }
    this.amlService.deleteRiskTier(req).subscribe((data: any) => {
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
    this.router.navigateByUrl("/create-risk-tier");
  }
}

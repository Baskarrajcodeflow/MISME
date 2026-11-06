import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AmlService } from '../aml.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-aml-sdn-search',
  templateUrl: './aml-sdn-search.component.html',
  imports: [ReactiveFormsModule,NgIf,NgFor],
  standalone: true,
  styleUrls: ['./aml-sdn-search.component.scss']
})
export class AmlSdnSearchComponent implements OnInit {
  searchForm: FormGroup;
  beforeSearch: boolean = true;
  afterSearch: boolean = false;
  percentages: number[] = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
  searchResult: any;

  constructor(private fb: FormBuilder, private amlService: AmlService) {
    this.searchForm = this.fb.group({
      name: ['', Validators.required],
      percentage: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onClickSearch() {
    if (this.searchForm.valid) {
      this.beforeSearch = false;
      this.afterSearch = true;
      const req = this.searchForm.value;
      this.amlService.searchSdn(req).subscribe((data: any) => {
        console.log(data);
        this.searchResult = data;
        // handle response
      });
    }
  }

  onReset() {
    this.searchForm.reset();
    this.beforeSearch = true;
    this.afterSearch = false;
  }

  onClickSave() {
    // handle save action
    console.log('Save button clicked');
  }
}

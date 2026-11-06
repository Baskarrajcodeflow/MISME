import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AmlService } from '../aml.service';
import { NgFor, NgIf } from '@angular/common';
import { CorporateService } from '../../corporate/corporate.service';
import { LoaderComponent } from "../../loader/loader.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aml-sdn-search',
  templateUrl: './aml-sdn-search.component.html',
  imports: [ReactiveFormsModule, NgIf, NgFor, CommonModule, LoaderComponent],
  standalone: true,
  styleUrls: ['./aml-sdn-search.component.scss']
})
export class AmlSdnSearchComponent implements OnInit {
  searchForm: FormGroup;
  beforeSearch: boolean = true;
  afterSearch: boolean = false;
  percentages: number[] = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
  searchResult: any;
  countries: any[] = [];
  loading : boolean = false

  constructor(private fb: FormBuilder, private amlService: AmlService, private corporate: CorporateService) {
    this.searchForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z -]*$')]],
      dob: '',
      birthCountry: ''
    });
  }

  ngOnInit(): void {
    this.getCountries();
  }

    getCountries() {
    this.corporate.getCountries().subscribe({
      next: (data: any) => {
        this.countries = data?.data;
      }
    });
  }

  onClickSearch() {
     if (this.searchForm.valid) {
      this.loading = true;
      this.beforeSearch = false;
      this.afterSearch = true; 
     const req = {
      "name": this.searchForm.get('name')?.value,
     
      "dob": this.searchForm.get('dob')?.value,
      "birthCountry": this.searchForm.get('birthCountry')?.value,
      "kycId": '',
      "userId": '',
      "minMatchPercent": "60"
    };

      this.amlService.searchSdn(req).subscribe((data: any) => {
        this.loading = false;
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

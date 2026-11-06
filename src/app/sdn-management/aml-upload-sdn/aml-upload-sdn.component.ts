import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AmlService } from '../aml.service';
import { NgFor, NgIf } from '@angular/common';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-aml-upload-sdn',
  templateUrl: './aml-upload-sdn.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, LoaderComponent],
  styleUrls: ['./aml-upload-sdn.component.scss']
})
export class AmlUploadSdnComponent implements OnInit {

  uploadForm: FormGroup;
  selectedFile: File | null = null;
  isLoading: boolean = false;
  userPrivileges: any;
  userPrevilages1: any;
  prvilege: any;

  constructor(private fb: FormBuilder, private amlService: AmlService) {
    this.uploadForm = this.fb.group({
      source: ['', Validators.required],
      file: [Validators.required]
    });
  }

  ngOnInit(): void {
    const privilegesData = sessionStorage.getItem('privileges');
    if (privilegesData) {
      this.userPrivileges = JSON.parse(privilegesData);
      this.userPrevilages1 = this.userPrivileges[0];
      for (let item of this.userPrevilages1?.uiComponentPrivileges) {
        if (item?.component?.componentName == "AML") {
          if (item.subComponent?.subComponentName == "SDN Upload")
            this.prvilege = item;
        }
      }
    }
   }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
    this.uploadForm.patchValue({ file: this.selectedFile }); // Update the form control value
  }

  // onSubmit() {
  //   if (this.uploadForm.valid && this.selectedFile) {
  //   const source = this.uploadForm.get('source')?.value;
  //     this.isLoading = true;
  //     this.amlService.uploadFile(this.selectedFile, source)
  //     .subscribe({
  //       next:(res)=>{
  //             if (res) {
  //               this.isLoading = false;
  //               alert("Upload success");
  //             }
  //           },
  //           error:()=>{
  //             this.isLoading = false;
  //             alert('Failed')
  //           }
  //     })
  //   } else {
  //     alert("Please fill in all required fields and select a file.");
  //   }
  // }
  onSubmit() {
    if (this.uploadForm.valid && this.selectedFile) {
      const source = this.uploadForm.get('source')?.value;
      this.isLoading = true;
      this.amlService.uploadFile(this.selectedFile, source)
        .subscribe({
          next: (res: any) => {
            if (res) {
              this.isLoading = false;
              alert("Upload successful.");
            } else {
              this.isLoading = false;
              alert("Unexpected response format: ");
            }
          },
          error: (err: any) => {
            this.isLoading = false;
            alert('Something went wrong during the upload.');
          }
        });
    } else {
      alert("Please fill in all required fields and select a file.");
    }
  }
  
  
}

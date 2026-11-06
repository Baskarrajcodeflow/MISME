import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AmlService } from '../aml.service';

@Component({
  selector: 'app-aml-upload-sdn',
  templateUrl: './aml-upload-sdn.component.html',
  standalone: true,
  imports : [ReactiveFormsModule],
  styleUrls: ['./aml-upload-sdn.component.scss']
})
export class AmlUploadSdnComponent implements OnInit {

  uploadForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private amlService: AmlService) {
    this.uploadForm = this.fb.group({
      source: [''],
      file: [null]
    });
  }

  ngOnInit(): void {
      
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }

  onSubmit() {
    if (this.uploadForm.valid && this.selectedFile) {
      const source = this.uploadForm.get('source')?.value;
      this.amlService.uploadFile(this.selectedFile,source).subscribe(
        response => {
          if(response){
            alert("Upload success")
          }
          else{
            alert("Something went wrong")
          }
          console.log('Upload success', response);
        }
       
      );
    }
  }
}
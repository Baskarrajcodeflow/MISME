import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControlConfig } from '../interface/interface-list';

@Component({
  selector: 'app-form-component',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './form-component.component.html',
  styleUrl: './form-component.component.scss'
})
export class FormComponentComponent {

  @Input() formName : FormGroup = new FormGroup({});
  @Input() formControls !: FormControlConfig[] ;

  constructor(private fb : FormBuilder){

  }


  ngOnInit(){
    this.buildForm();

  }
  buildForm(){
    this.formName = this.fb.group({});
    this.formControls.forEach(control => {
      //const validators = control.validators ? control.validators : [];
      this.formName.addControl(control.key, this.fb.control('',));
    });
  }

}



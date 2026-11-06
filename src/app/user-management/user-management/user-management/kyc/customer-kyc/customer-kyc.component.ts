import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-kyc',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,NgFor],
  templateUrl: './customer-kyc.component.html',
  styleUrl: './customer-kyc.component.css'
})
export class CustomerKycComponent {

}

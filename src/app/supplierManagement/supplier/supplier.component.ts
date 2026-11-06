import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface Supplier {
  id: number;
  supplierName: string;
  accountNumber: string;
  commission: string;
  province: string;
  phoneNumber: string;
  email: string;
  countryId: string;
  postalCode: string;
  district: string;
  village: string;
  streetNo: string;
  houseOrFlatOrBuilding: string;
}

@Component({
  standalone:true,
  imports:[ ReactiveFormsModule , NgFor],
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent {
  supplierForm: FormGroup;
  suppliers: Supplier[] = [];
  editIndex: number | null = null;

  constructor(private fb: FormBuilder) {
    this.supplierForm = this.fb.group({
      supplierName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      commission: ['', Validators.required],
      province: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryId: ['', Validators.required],
      postalCode: ['', Validators.required],
      district: ['', Validators.required],
      village: ['', Validators.required],
      streetNo: ['', Validators.required],
      houseOrFlatOrBuilding: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.supplierForm.valid) {
      const newSupplier: Supplier = { id: Date.now(), ...this.supplierForm.value };
      if (this.editIndex !== null) {
        this.suppliers[this.editIndex] = newSupplier;
        this.editIndex = null;
      } else {
        this.suppliers.push(newSupplier);
      }
      this.supplierForm.reset();
    }
  }

  onEdit(index: number) {
    this.editIndex = index;
    this.supplierForm.patchValue(this.suppliers[index]);
  }

  onDelete(index: number) {
    this.suppliers.splice(index, 1);
  }

  onCancel() {
    this.editIndex = null;
    this.supplierForm.reset();
  }
}

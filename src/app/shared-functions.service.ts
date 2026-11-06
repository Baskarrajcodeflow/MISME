import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SharedFunctionsService {

  constructor() { }
    // Custom validator to check for past date
     futureDateValidator() {
      return (control: AbstractControl) => {
        const selectedDate = new Date(control.value);
        const today = new Date();
  
        // Ignore time part for comparison
        today.setHours(0, 0, 0, 0);
  
        if (selectedDate.getTime() < today.getTime()) {
          return { pastDate: true };
        }
        return null;
      };
    }
  
  pastDateValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const selectedDate = new Date(control.value);
      const today = new Date();
  
      // Ignore time part for comparison
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0,0,0,0)
    //console.log(today,"today");
    //console.log(selectedDate,"selected");
      if (selectedDate.getTime() >= today.getTime()) {
        //console.log("hi");

        return { pastDate: true };
      }
      return null;
    };
  }
  ageValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values
      }

      const today = new Date();
      const birthDate = new Date(control.value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      const isUnderage = age < 18 || (age === 18 && monthDifference < 0);
      const isOverage = age >100  || (age === 100 && monthDifference < 0);
      if (isUnderage) {
        return { underage: { message: 'Age must be 18 years or older.', value: control.value } };
      }
  
      if (isOverage) {
        return { overage: { message: 'Age must not exceed 100 years.', value: control.value } };
      }

      return null;

      

    };


  }
}

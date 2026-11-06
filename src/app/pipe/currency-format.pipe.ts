import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
@Injectable({
  providedIn: 'root'
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: string, currencySymbol: string = 'AFN'): string {
    if (!value) {
      return ''; 
    }
  
    let rawIncome = value.replace(/[^0-9.]/g, '');
  
    let parsedIncome = parseFloat(rawIncome);
    if (isNaN(parsedIncome)) {
      return ''; 
    }
  
    const formattedIncome = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parsedIncome);
  
    return `${currencySymbol} ${formattedIncome}`; 
  }
}

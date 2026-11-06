// src/app/corp-chooser/corp-chooser.service.ts
import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Corp } from './corp-chooser.model';
import { ApiServiceService } from '../../../product/api-service/api-service.service';

@Injectable({
  providedIn: 'root',
})
export class CorpChooserService implements OnInit {
  // Mock data
  private mockCorporates = [
    { id: 1, name: 'Corporate A', accountNumber: '12345' },
    { id: 2, name: 'Corporate B', accountNumber: '67890' },
    { id: 3, name: 'Corporate C', accountNumber: '54321' },
  ];

  constructor(
  private apiService:ApiServiceService,
  ) {}
  ngOnInit(): void {
      
  }

  // Mock API call to get corporates by account number
  getCorporatesByAccountNumber(accountNumber: string): Observable<Corp[]> {
    const result = this.mockCorporates.filter(corp => corp.accountNumber.includes(accountNumber));
    return of(result);
  }

  // Mock API call to get corporates by name
  getCorporatesByName(name: string): Observable<Corp[]> {
    const result = this.mockCorporates.filter(corp => corp.name.toLowerCase().includes(name.toLowerCase()));
    return of(result);
  }
}

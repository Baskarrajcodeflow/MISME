// email.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
//   constructor(private http: HttpClient) {}

  sendEmailWithAttachment(pdfData: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('pdf', pdfData, 'report.pdf');

    // return this.http.post('/api/send-email', formData);
    return new Observable();
  }
}

// file-status.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { FileStatus } from '../file-status.model';
import { SalaryFileStatus } from '../salary-file-status.enum';
import { generateMockFileStatuses } from './file-status.mock-data';


@Injectable({
  providedIn: 'root',
})
export class FileStatusService {
  private apiUrl = '/api/file-status'; // Replace with your actual API URL
  private allFileStatuses: FileStatus[] = generateMockFileStatuses();
  constructor(
    // private http: HttpClient
) {}

  getFileStatusesByState(state: SalaryFileStatus): Observable<FileStatus[]> {
    // return this.http.get<FileStatus[]>(`${this.apiUrl}?state=${state}`);
    const data = this.allFileStatuses.filter((fs) => fs.status === state);
    return of(data).pipe(delay(500)); //
  }
}

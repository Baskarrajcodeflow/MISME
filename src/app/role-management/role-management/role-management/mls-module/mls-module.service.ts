import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MlsModule } from '../entity.types';

@Injectable({
  providedIn: 'root'
})
export class MlsModuleService {

  private apiUrl = 'http://localhost:8072/rmsbo/api/bo/mlsModules';  // Adjust the URL as necessary

  constructor(private http: HttpClient) { }

  getModules(): Observable<MlsModule[]> {
    return this.http.get<MlsModule[]>(this.apiUrl);
  }

  getModuleAccessAuthority(mlsModule: MlsModule): Observable<MlsModule[]> {
    return this.http.get<MlsModule[]>(this.apiUrl);
  }

}

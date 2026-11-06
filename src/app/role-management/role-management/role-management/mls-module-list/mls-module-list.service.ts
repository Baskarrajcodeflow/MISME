import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MlsModule, ModuleAccessAuthority } from '../entity.types';

@Injectable({
    providedIn: 'root'
  })
  export class MslModuleListService {
    private apiUrl = 'http://localhost:8072/rmsbo/api/bo/RoleMgntScreen';  // Your API endpoint
  
    constructor(private http: HttpClient) { } 

    loadAllMlsModule():Observable<MlsModule[]>{
        return this.http.get<MlsModule[]>(`${this.apiUrl}/`);
    }
    loadModuleAccessAuthorityById(id:number):Observable<ModuleAccessAuthority[]>{
        return this.http.get<ModuleAccessAuthority[]>(`${this.apiUrl}/${id  ``}`);
    }
  }  
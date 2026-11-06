import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HasId } from './entity.types';

export class GenericCrudService<T extends HasId> {
  constructor(private http: HttpClient, private apiUrl: string) {}

  getByParentId(parentId: number, endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}/${endpoint}/${parentId}`);
  }

  add(entity: Partial<T>, callback: (result: T) => void): void {
    this.http.post<T>(this.apiUrl, entity).subscribe(callback);
  }

  update(entity: T , endpoint: string, callback: (result: T) => void): void {
    this.http.put<T>(`${this.apiUrl}/${endpoint}/${entity['id']}`, entity).subscribe(callback);
  }

  delete(id: number, endpoint: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${endpoint}/${id}`);
  }
}

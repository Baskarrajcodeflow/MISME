import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError,  of, retry } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http : HttpClient) {
  }

  get<T>(endpoint : string) : Observable<T>{
	  return this.http.get<T>(`${this.apiUrl}${endpoint}`).pipe(
      //retry(3), //to try api 3 times if fails
      catchError(this.handleError<T>(`get ${endpoint}`))
    );
  }
  post<T>(endpoint : string, reqPayload : any):Observable<T>{
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, reqPayload).pipe(
      catchError(this.handleError<T>(`post ${endpoint}`))
    );
   }

   put<T>(endpoint: string, reqPayload: any):Observable<T>{
    return this.http.put<T>(`${this.apiUrl}${endpoint}`,reqPayload).pipe(
      catchError(this.handleError<T>(`post ${endpoint}`))
    );
   }

  delete<T>(endpoint : string):Observable<T>{
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`).pipe(
      catchError(this.handleError<T>(`delete ${endpoint}`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error : any) : Observable<T> => {
      console.error(`${operation} failed : ${error.message}`);
      return of(result as T);
    }
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  log(message: string, data : any): void {
    console.log(message, data);
  }

  error(message: string): void {
    console.error(message);
  }

  warn(message: string): void {
    console.warn(message);
  }

  info(message: string): void {
    console.info(message);
  }
}

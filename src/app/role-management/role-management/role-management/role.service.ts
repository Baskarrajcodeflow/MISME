import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private isTableDisabled = new BehaviorSubject<boolean>(true);
  isTableDisabled$ = this.isTableDisabled.asObservable();

  setIsTableDisabled(value: boolean) {
    this.isTableDisabled.next(value);
  }
}

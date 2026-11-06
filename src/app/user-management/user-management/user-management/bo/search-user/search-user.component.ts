import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { BackOffice, UserManagementService } from '../../openapi';

@Component({
  selector: 'app-search-user',
  standalone: true,
  imports: [NgFor,NgIf,ReactiveFormsModule],
  templateUrl: './search-user.component.html',
  styleUrl: './search-user.component.css'
})
export class SearchUserComponent 

  implements OnInit {
    searchForm: FormGroup;
    results: BackOffice[] = [];
    userTypes:[] = [];
    activeStatus:[] = [];
    @Output() add = new EventEmitter<BackOffice>();

  
    constructor(private fb: FormBuilder, private userManagementService: UserManagementService) {
      this.searchForm = this.fb.group({
        phone: [''],
        email: [''],
        firstName: [''],
        lastName: [''],
        role:[''],
        userTypes: [''],
        activeStatus: [''],
        active: [false],
        deleted: [false]
      });
    }
  
    ngOnInit(): void {
    }
  
    onSearch(): void {
     
    }

    onAdd(){
      this.add.emit()
    }

  }
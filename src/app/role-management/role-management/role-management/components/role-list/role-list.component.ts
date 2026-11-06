import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Role } from '../../entity.types';
import { RoleService } from '../../services/role.service';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [NgFor],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent implements OnInit {
  @Input() roles: Role[] = [];
  @Output() roleSelected = new EventEmitter<Role>();

  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe(data => {
      this.roles = data;
    });
  }

  selectRole(role: Role): void {
    this.roleSelected.emit(role);
  }
}

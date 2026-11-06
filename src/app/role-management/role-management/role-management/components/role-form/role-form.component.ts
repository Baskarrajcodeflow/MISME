import { Component, OnInit } from '@angular/core';
import { Permission, Role } from '../../entity.types';
import { RoleService } from '../../services/role.service';
import { PermissionService } from '../../services/permission.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.css'
})

export class RoleFormComponent implements OnInit {
  permissions: Permission[] = [];
  roles: Role[] = [];
  selectedRole: Role | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}


import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { Permission, Role } from '../../entity.types';
import { PermissionService } from '../../services/permission.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModuleListComponent } from '../module-list/module-list.component';

@Component({
  standalone: true, 
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css'],
  imports:[NgFor, NgIf, FormsModule, ModuleListComponent]
})

export class RoleManagementComponent implements OnInit {
  permissions: Permission[] = [];
  roles: Role[] = [];
  selectedRole: Role | null = null;
  newRoleName: string = '';

  constructor(
    private permissionService: PermissionService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
    this.loadRoles();
  }

  loadPermissions(): void {
    this.permissionService.getPermissions().subscribe(data => {
      this.permissions = data;
      console.log("00000000000", this.permissions.length)
    });
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe(data => {
      this.roles = data;
    });
  }

  onSelectRole(role: Role): void {
    this.selectedRole = { ...role };
    this.newRoleName = ''; // Clear the new role name input if any
  }

  togglePermission(permission: Permission): void {
    if (this.selectedRole) {
      const roles = this.selectedRole.roles ? this.selectedRole.roles.split(',') : [];
      const index = roles.indexOf(permission.id.toString());
      if (index > -1) {
        roles.splice(index, 1);
      } else {
        roles.push(permission.id.toString());
      }
      this.selectedRole.roles = roles.join(',');
    }
  }

  onSaveRole(): void {
    if (this.selectedRole) {
      // Show confirmation dialog before saving
      if (confirm('Are you sure you want to save changes?')) {
        this.roleService.updateRole(this.selectedRole).subscribe(() => {
          this.loadRoles();
          alert('Role updated successfully!');
          this.selectedRole = null; // Reset the form after saving
        });
      }
    } else {
      // Handle creating a new role
      const roleName = this.newRoleName.trim();
      if (roleName) {
        const newRole: Partial<Role> = {
          roleName,
          roles: this.getSelectedPermissions().join(',')
        };
        this.roleService.createRole(newRole).subscribe(response => {
          this.loadRoles();
          alert('Role created successfully!');
          this.newRoleName = ''; // Clear the input after saving
        });
      } else {
        alert('Role name cannot be empty.');
      }
    }
  }

  getSelectedPermissions(): string[] {
    const selectedPermissions: string[] = [];
    for (const permission of this.permissions) {
      if (this.isPermissionSelected(permission)) {
        selectedPermissions.push(permission.id.toString());
      }
    }
    return selectedPermissions;
  }

  isPermissionSelected(permission: Permission): boolean {
    if (this.selectedRole) {
      return this.selectedRole.roles?.split(',').includes(permission.id.toString());
    }
    return false;
  }
}
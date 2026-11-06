
import { NgFor, NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Permission, Role } from '../../entity.types';
import { FeatureListComponent } from '../feature-list/feature-list.component';

@Component({
  standalone:true,
  imports:[NgFor, NgIf,FeatureListComponent],
  selector: 'app-module-list',
  templateUrl: './module-list.component.html',
  // styleUrls: ['./module-list.component.css']
})
export class ModuleListComponent implements OnInit{
  @Input() permissions: Permission[] = [];
  @Input() selectedRole: Role | null = null;
  @Output() togglePermission = new EventEmitter<Permission>();

  openModuleAccordions: { [key: string]: boolean } = {};
  filteredPermissions: { [key: string]: Permission[] } = {};

  ngOnInit(): void {
    this.initializeFilteredPermissions();
  }

  getModuleNames(): string[] {
    return [...new Set(this.permissions.map(p => p.moduleName))];
  }

  toggleModuleAccordion(moduleName: string): void {
    this.openModuleAccordions[moduleName] = !this.openModuleAccordions[moduleName];
  }

  isModuleAccordionOpen(moduleName: string): boolean {
    return this.openModuleAccordions[moduleName];
  }

  onTogglePermission(permission: Permission): void {
    this.togglePermission.emit(permission);
  }

  initializeFilteredPermissions(): void {
    for (const moduleName of this.getModuleNames()) {
      this.filteredPermissions[moduleName] = this.permissions.filter(p => p.moduleName === moduleName);
    }
  }

  getFilteredPermissions(moduleName: string): Permission[] {
    return this.filteredPermissions[moduleName] || [];
  }
}
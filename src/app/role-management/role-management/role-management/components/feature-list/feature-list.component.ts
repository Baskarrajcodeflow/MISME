import { NgFor, NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Permission, Role } from '../../entity.types';

@Component({
  standalone:true,
  imports:[NgFor, NgIf],
  selector: 'app-feature-list',
  templateUrl: './feature-list.component.html',
  // styleUrls: ['./feature-list.component.css']
})
export class FeatureListComponent {
@Input() permissions: Permission[] = [];
@Input() selectedRole: Role | null = null;
@Output() togglePermission = new EventEmitter<Permission>();

openFeatureAccordions: { [key: string]: boolean } = {};
filteredPermissions: { [key: string]: Permission[] } = {};

ngOnInit(): void {
  this.initializeFilteredPermissions();
}

getFeatureNames(): string[] {
  return [...new Set(this.permissions.map(p => p.featureName))];
}

toggleFeatureAccordion(featureName: string): void {
  this.openFeatureAccordions[featureName] = !this.openFeatureAccordions[featureName];
}

isFeatureAccordionOpen(featureName: string): boolean {
  return this.openFeatureAccordions[featureName];
}

emitTogglePermission(permission: Permission): void {
  this.togglePermission.emit(permission);
}

initializeFilteredPermissions(): void {
  for (const featureName of this.getFeatureNames()) {
    this.filteredPermissions[featureName] = this.permissions.filter(p => p.featureName === featureName);
  }
}

getFilteredPermissions(featureName: string): Permission[] {
  return this.filteredPermissions[featureName] || [];
}
}
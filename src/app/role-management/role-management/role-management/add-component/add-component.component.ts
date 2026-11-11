import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ComponentControllerService } from '../openapi';
import { LoaderComponent } from '../../../../loader/loader.component';
import { RoleService } from '../role.service';
import { roleService } from '../../../role.service';
import { showToast } from '../../../../core/toast/toast';

@Component({
  selector: 'app-add-component',
  standalone: true,
  imports: [FormsModule,NgIf,NgFor, LoaderComponent],
  templateUrl: './add-component.component.html',
  styleUrl: './add-component.component.css'
})
export class AddComponentComponent {

  componentName!: string ;
  component: any;
  isLoading: boolean = false;
  @Output() componentCreated = new EventEmitter<boolean>();

  constructor(private componentService: ComponentControllerService,private roleService: roleService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.isLoading = true;
    this.roleService.addComponent(this.componentName).subscribe({
      next: (component: any) => {
        if (component) {
          this.isLoading = false;
          showToast("created successfully");
          this.componentCreated.emit(true);
          this.componentName = '';
          // this.component = this.component.filter(o => o.id !== a.id);
          // this.component.push(component);
        }
      },
      error: () => {
        this.isLoading = false;
        showToast("Something went wrong");
      }
    })
  }
}
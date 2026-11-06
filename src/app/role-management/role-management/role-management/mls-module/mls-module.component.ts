import { Component, Input, OnInit } from '@angular/core';
import { MlsModuleService } from './mls-module.service';
import { MlsModule, ModuleAccessAuthority } from '../entity.types';
import { FormsModule} from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MipayAuthorityListComponent } from '../mipay-authority-list/mipay-authority-list.component';

@Component({
  selector: 'mls-module',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, MipayAuthorityListComponent],
  templateUrl: './mls-module.component.html',
  styleUrl: './mls-module.component.css'
})
export class MlsModuleComponent implements OnInit {
  @Input() mlsModule!: MlsModule
  moduleAccessControls!: ModuleAccessAuthority[]
    constructor(private moduleService: MlsModuleService) { }
  
    ngOnInit(): void {
      this.getModules();
    }
  
    getModules(): void {
      // this.moduleService.
    }
}

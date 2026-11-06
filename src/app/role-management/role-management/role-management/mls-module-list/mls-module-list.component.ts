import { Component, OnInit } from '@angular/core';
import { MlsModuleComponent } from '../mls-module/mls-module.component';

@Component({
  selector: 'mls-module-list',
  standalone: true,
  imports: [MlsModuleComponent],
  templateUrl: './mls-module-list.component.html',
  styleUrl: './mls-module-list.component.css'
})
export class MlsModuleListComponent implements OnInit{
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}

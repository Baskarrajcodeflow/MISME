import { CommonModule, NgIf } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [NgIf, CommonModule    ],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css'
})
export class TabComponent { 
  @Input() title!: string;
  @ContentChild(TemplateRef) content!: TemplateRef<any>;
  }
  
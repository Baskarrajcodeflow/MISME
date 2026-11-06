import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ModuleAccessAuthority } from '../entity.types';
import { AuthorityService } from '../mipay-authority-list/authority.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mipay-authority',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mipay-authority.component.html',
  styleUrl: './mipay-authority.component.css'
})
export class MipayAuthorityComponent  {
  @Input() text: string = '';
  @Input() checked: boolean = false;
}
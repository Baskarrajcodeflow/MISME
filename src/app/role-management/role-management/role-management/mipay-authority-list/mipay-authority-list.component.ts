import { Component, Input } from '@angular/core';
import { MipayAuthorityComponent } from '../mipay-authority/mipay-authority.component';

@Component({
  selector: 'mipay-authority-list',
  standalone: true,
  imports: [MipayAuthorityComponent],
  templateUrl: './mipay-authority-list.component.html',
  styleUrl: './mipay-authority-list.component.css'
})
export class MipayAuthorityListComponent {
// @Input() 
}

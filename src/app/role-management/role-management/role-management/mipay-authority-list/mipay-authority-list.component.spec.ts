import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MipayAuthorityListComponent } from './mipay-authority-list.component';

describe('MipayAuthorityListComponent', () => {
  let component: MipayAuthorityListComponent;
  let fixture: ComponentFixture<MipayAuthorityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MipayAuthorityListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MipayAuthorityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

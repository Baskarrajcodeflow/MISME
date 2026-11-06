import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MipayAuthorityComponent } from './mipay-authority.component';

describe('MipayAuthorityComponent', () => {
  let component: MipayAuthorityComponent;
  let fixture: ComponentFixture<MipayAuthorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MipayAuthorityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MipayAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BOComponent } from './bo.component';

describe('BOComponent', () => {
  let component: BOComponent;
  let fixture: ComponentFixture<BOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BOComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

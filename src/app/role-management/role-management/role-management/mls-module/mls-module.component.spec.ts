import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlsModuleComponent } from './mls-module.component';

describe('MlsModuleComponent', () => {
  let component: MlsModuleComponent;
  let fixture: ComponentFixture<MlsModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MlsModuleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MlsModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

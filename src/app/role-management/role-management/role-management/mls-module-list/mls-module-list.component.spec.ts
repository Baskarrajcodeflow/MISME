import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlsModuleListComponent } from './mls-module-list.component';

describe('MlsModuleListComponent', () => {
  let component: MlsModuleListComponent;
  let fixture: ComponentFixture<MlsModuleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MlsModuleListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MlsModuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

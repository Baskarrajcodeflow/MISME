import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedFilesComponent } from './approved-files.component';

describe('ApprovedFilesComponent', () => {
  let component: ApprovedFilesComponent;
  let fixture: ComponentFixture<ApprovedFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedFilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovedFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

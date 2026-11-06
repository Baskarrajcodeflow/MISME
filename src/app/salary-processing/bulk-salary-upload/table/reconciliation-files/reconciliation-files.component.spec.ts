import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconciliationFilesComponent } from './reconciliation-files.component';

describe('ReconciliationFilesComponent', () => {
  let component: ReconciliationFilesComponent;
  let fixture: ComponentFixture<ReconciliationFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReconciliationFilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReconciliationFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

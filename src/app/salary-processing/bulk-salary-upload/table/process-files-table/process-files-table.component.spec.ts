import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessFilesTableComponent } from './process-files-table.component';

describe('ProcessFilesTableComponent', () => {
  let component: ProcessFilesTableComponent;
  let fixture: ComponentFixture<ProcessFilesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessFilesTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProcessFilesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

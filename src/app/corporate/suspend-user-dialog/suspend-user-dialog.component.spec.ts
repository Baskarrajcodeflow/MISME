import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspendUserDialogComponent } from './suspend-user-dialog.component';

describe('SuspendUserDialogComponent', () => {
  let component: SuspendUserDialogComponent;
  let fixture: ComponentFixture<SuspendUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuspendUserDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuspendUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

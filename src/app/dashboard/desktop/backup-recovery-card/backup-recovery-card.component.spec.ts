import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupRecoveryCardComponent } from './backup-recovery-card.component';

describe('BackupRecoveryCardComponent', () => {
  let component: BackupRecoveryCardComponent;
  let fixture: ComponentFixture<BackupRecoveryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackupRecoveryCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BackupRecoveryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

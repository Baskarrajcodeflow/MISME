import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizePushPullDialogComponent } from './authorize-push-pull-dialog.component';

describe('AuthorizePushPullDialogComponent', () => {
  let component: AuthorizePushPullDialogComponent;
  let fixture: ComponentFixture<AuthorizePushPullDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizePushPullDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorizePushPullDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

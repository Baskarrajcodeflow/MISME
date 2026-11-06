import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmlUploadSdnComponent } from './aml-upload-sdn.component';

describe('AmlUploadSdnComponent', () => {
  let component: AmlUploadSdnComponent;
  let fixture: ComponentFixture<AmlUploadSdnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmlUploadSdnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmlUploadSdnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

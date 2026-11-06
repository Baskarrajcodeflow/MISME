import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmlSdnLogsComponent } from './aml-sdn-logs.component';

describe('AmlSdnLogsComponent', () => {
  let component: AmlSdnLogsComponent;
  let fixture: ComponentFixture<AmlSdnLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmlSdnLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmlSdnLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

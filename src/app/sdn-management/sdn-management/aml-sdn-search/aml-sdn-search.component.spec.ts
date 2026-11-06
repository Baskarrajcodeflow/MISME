import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmlSdnSearchComponent } from './aml-sdn-search.component';

describe('AmlSdnSearchComponent', () => {
  let component: AmlSdnSearchComponent;
  let fixture: ComponentFixture<AmlSdnSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmlSdnSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmlSdnSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

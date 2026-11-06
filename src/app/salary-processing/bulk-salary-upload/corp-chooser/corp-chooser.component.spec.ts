import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpChooserComponent } from './corp-chooser.component';

describe('CorpChooserComponent', () => {
  let component: CorpChooserComponent;
  let fixture: ComponentFixture<CorpChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorpChooserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorpChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

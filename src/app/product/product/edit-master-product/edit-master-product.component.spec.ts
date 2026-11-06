import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMasterProductComponent } from './edit-master-product.component';

describe('EditMasterProductComponent', () => {
  let component: EditMasterProductComponent;
  let fixture: ComponentFixture<EditMasterProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMasterProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditMasterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

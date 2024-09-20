import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlBrandComponent } from './control-brand.component';

describe('ControlBrandComponent', () => {
  let component: ControlBrandComponent;
  let fixture: ComponentFixture<ControlBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlBrandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcResultSellinComponent } from './qc-result-sellin.component';

describe('QcResultSellinComponent', () => {
  let component: QcResultSellinComponent;
  let fixture: ComponentFixture<QcResultSellinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QcResultSellinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QcResultSellinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

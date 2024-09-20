import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPosmComponent } from './dashboard-posm.component';

describe('DashboardPosmComponent', () => {
  let component: DashboardPosmComponent;
  let fixture: ComponentFixture<DashboardPosmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardPosmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPosmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

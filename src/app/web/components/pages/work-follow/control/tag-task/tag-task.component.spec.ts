import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagTaskComponent } from './tag-task.component';

describe('TagTaskComponent', () => {
  let component: TagTaskComponent;
  let fixture: ComponentFixture<TagTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

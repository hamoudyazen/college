import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentassignmentComponent } from './studentassignment.component';

describe('StudentassignmentComponent', () => {
  let component: StudentassignmentComponent;
  let fixture: ComponentFixture<StudentassignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentassignmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

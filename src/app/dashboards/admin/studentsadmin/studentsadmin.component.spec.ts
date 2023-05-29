import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsadminComponent } from './studentsadmin.component';

describe('StudentsadminComponent', () => {
  let component: StudentsadminComponent;
  let fixture: ComponentFixture<StudentsadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentsadminComponent]
    });
    fixture = TestBed.createComponent(StudentsadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

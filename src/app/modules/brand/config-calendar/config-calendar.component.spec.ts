import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigCalendarComponent } from './config-calendar.component';

describe('ConfigCalendarComponent', () => {
  let component: ConfigCalendarComponent;
  let fixture: ComponentFixture<ConfigCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

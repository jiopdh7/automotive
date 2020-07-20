import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAgendaComponent } from './config-agenda.component';

describe('ConfigAgendaComponent', () => {
  let component: ConfigAgendaComponent;
  let fixture: ComponentFixture<ConfigAgendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigAgendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

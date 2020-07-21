import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarClienteAlternoComponent } from './agendar-cliente-alterno.component';

describe('AgendarClienteAlternoComponent', () => {
  let component: AgendarClienteAlternoComponent;
  let fixture: ComponentFixture<AgendarClienteAlternoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendarClienteAlternoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendarClienteAlternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

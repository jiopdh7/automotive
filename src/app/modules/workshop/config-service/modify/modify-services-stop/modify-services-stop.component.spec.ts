import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyServicesStopComponent } from './modify-services-stop.component';

describe('ModifyServicesStopComponent', () => {
  let component: ModifyServicesStopComponent;
  let fixture: ComponentFixture<ModifyServicesStopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyServicesStopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyServicesStopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigServiceComponent } from './config-service.component';

describe('ConfigServiceComponent', () => {
  let component: ConfigServiceComponent;
  let fixture: ComponentFixture<ConfigServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

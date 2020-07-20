import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigServiceModifyComponent } from './config-service-modify.component';

describe('ConfigServiceModifyComponent', () => {
  let component: ConfigServiceModifyComponent;
  let fixture: ComponentFixture<ConfigServiceModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigServiceModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigServiceModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

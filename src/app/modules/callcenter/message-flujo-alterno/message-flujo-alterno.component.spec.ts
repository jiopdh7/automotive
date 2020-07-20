import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFlujoAlternoComponent } from './message-flujo-alterno.component';

describe('MessageFlujoAlternoComponent', () => {
  let component: MessageFlujoAlternoComponent;
  let fixture: ComponentFixture<MessageFlujoAlternoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageFlujoAlternoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageFlujoAlternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

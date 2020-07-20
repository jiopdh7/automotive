import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageQuestionModifyComponent } from './message-question-modify.component';

describe('MessageQuestionModifyComponent', () => {
  let component: MessageQuestionModifyComponent;
  let fixture: ComponentFixture<MessageQuestionModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageQuestionModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageQuestionModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

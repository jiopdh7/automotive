import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageAdvisersComponent } from './message-advisers.component';

describe('MessageAdvisersComponent', () => {
  let component: MessageAdvisersComponent;
  let fixture: ComponentFixture<MessageAdvisersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageAdvisersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageAdvisersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

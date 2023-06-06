import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatFeedComponent } from './chat-feed.component';

describe('ChatFeedComponent', () => {
  let component: ChatFeedComponent;
  let fixture: ComponentFixture<ChatFeedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatFeedComponent]
    });
    fixture = TestBed.createComponent(ChatFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

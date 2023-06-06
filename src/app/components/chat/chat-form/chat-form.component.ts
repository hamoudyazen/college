import { Component } from '@angular/core';
import { ChatMessage, MessageDetails } from 'src/app/models/allModels';
import { AuthService } from 'src/app/services/AuthService';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.css']
})
export class ChatFormComponent {
  myMessages: ChatMessage[] = [];
  messagesForUser1: MessageDetails[] = [
    {
      message: 'Hi there!',
      date: new Date(),
      senderID: 'user1id',
    }
  ];

  messagesForUser2: MessageDetails[] = [
    {
      message: 'Hi there!',
      date: new Date(),
      senderID: 'user2id',
    }
  ];

  chat: ChatMessage = {
    chatID: 'sad',
    user1ID: 'user1id',
    user2ID: 'user2id',
    messagesArray: {
      user1IDMessages: {
        message: this.messagesForUser1,
      },
      user2IDMessages: {
        message: this.messagesForUser2,
      },
    },
  };



  /////


  messageSendTest: MessageDetails[] = [
    {
      message: 'wORK?!',
      date: new Date(),
      senderID: 'user1id',
    }
  ];



  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadData();
    for (let i = 0; i < this.myMessages.length; i++) {
      console.log(this.myMessages[i].messagesArray);
    }
  }

  loadData(): void {
    this.authService.getMessages("user1id", "user2id").subscribe(response => {
      this.myMessages = response;
      console.log(response);
    });
  }
}

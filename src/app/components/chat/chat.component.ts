import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Assignment, Course, Submission, ForgotPasswordResponse, CourseMaterial, LoginRequest, User, ChatMessage, MessageDetails } from 'src/app/models/allModels';
import { SharedService } from 'src/app/services/SharedService';
import { AuthService } from 'src/app/services/AuthService';
import { data } from 'jquery';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('messageBox') messageBoxRef!: ElementRef;

  /*For user creation*/
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

  /*end */

  selectedUserID: string = "";
  userID: string = "";
  message: any;
  currentChatID: string = "";
  talkingToUserName: any;
  userList: User[] = [];
  myMessages: ChatMessage[] = [];
  userDetails: User[] = [];
  messages: MessageDetails[] = [];
  userIDtest = "user1id";
  constructor(private authService: AuthService, private sharedService: SharedService, private renderer: Renderer2) { }

  ngOnInit(): void {
    console.log(this.messages);
    this.loadData();

  }

  async loadData(): Promise<void> {
    try {
      this.userDetails = await this.sharedService.getUserDetails();
      const usersBeforeUpdate = await this.sharedService.getAllUsers();
      this.userID = this.userDetails[0].id!;
      for (let i = 0; i < usersBeforeUpdate.length; i++) {
        if (usersBeforeUpdate[i].id !== this.userID) {
          this.userList.push(usersBeforeUpdate[i]);
        }
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }


  isUserMessage(senderID: string, currentUserId: string): boolean {
    return senderID === currentUserId;
  }

  async userSelected(user: User) {
    this.selectedUserID = user.id!;
    this.talkingToUserName = user.firstname + ' ' + user.lastname;
    await this.getTwoUsersMessages(user.id!, this.userDetails[0].id!);
    if (this.messages.length === 0) {
      await this.getTwoUsersMessages(this.userDetails[0].id!, user.id!);

      if (this.messages.length === 0) {
        this.chat.user1ID = user.id!;
        this.chat.user2ID = this.userDetails[0].id!;
        this.messagesForUser1[0].senderID = user.id!;
        this.messagesForUser2[0].senderID = this.userDetails[0].id!;

        this.authService.createMessage(this.chat).subscribe(res => {
          this.getTwoUsersMessages(user.id!, this.userDetails[0].id!);
        });
      }
    }
  }

  getTwoUsersMessages(id1: string, id2: string) {
    this.authService.getMessages(id1, id2).subscribe(response => {
      if (response.length > 0) {
        this.currentChatID = response[0].chatID!;
        const messagesArray = response[0].messagesArray;
        const user1Messages = messagesArray.user1IDMessages ? messagesArray.user1IDMessages.message : [];
        const user2Messages = messagesArray.user2IDMessages ? messagesArray.user2IDMessages.message : [];

        this.messages = user1Messages.filter(i => i !== null);
        this.messages.push(...user2Messages.filter(i => i !== null));

        this.messages.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateA - dateB;
        });
      }
      setTimeout(() => {
        const messageBox = this.messageBoxRef.nativeElement;
        messageBox.scrollTop = messageBox.scrollHeight;
      });
    });
  }

  sendMessage() {
    this.authService.sendMessage(this.currentChatID, this.userDetails[0].id!, this.message).subscribe(
      res => {
        location.reload();
      },
      error => {
        location.reload();
      }
    );
  }

}  

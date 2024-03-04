import { Component, Input, OnInit } from '@angular/core';
import { MessageI } from '../../model/message.interface';
import { UserI } from '../../model/user.interface';
import { AuthService } from '../../services/auth-service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent {

  @Input() message: MessageI = {
    text: '',
    room: { },
    user: { }
  };
  user: UserI = this.authService.getLoggedInUser();

  constructor(private authService: AuthService) { }

}

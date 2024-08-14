import { Component, Input } from '@angular/core';

@Component({
  selector: 'chatbot-user-message',
  standalone: true,
  imports: [],
  templateUrl: './user-message.component.html',
  styleUrl: './user-message.component.css'
})
export class UserMessageComponent {
@Input()
public question: string = "";
}

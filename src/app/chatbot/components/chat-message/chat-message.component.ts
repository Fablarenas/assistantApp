import { Component, Input } from '@angular/core';
import { TypingEffectPipe } from "../../pipes/typing-effect.pipe";
import { TypingEffectComponent } from '../typping-effect-component/typping-effect-component.component';

@Component({
  selector: 'chatbot-chat-message',
  standalone: true,
  imports: [TypingEffectPipe, TypingEffectComponent],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent {
  @Input()
  public answer: string = "";
}

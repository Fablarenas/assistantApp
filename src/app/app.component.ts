import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainChatBotComponent } from "./chatbot/pages/main-chat-bot/main-chat-bot.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainChatBotComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'assistantApp';
}

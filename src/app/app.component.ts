import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainChatBotComponent } from "./chatbot/pages/main-chat-bot/main-chat-bot.component";
import { FileUploadComponent } from "./chatbot/components/file-upload/file-upload.component";
import { LoginComponent } from "./chatbot/components/login/login.component";
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthCallbackComponent } from './chatbot/components/auth-callback-component/auth-callback-component.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule  ,CommonModule, MainChatBotComponent, ReactiveFormsModule, FileUploadComponent, LoginComponent, AuthCallbackComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'assistantApp';
}

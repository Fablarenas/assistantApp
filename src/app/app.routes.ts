import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './chatbot/components/login/auth.guard';
import { MainChatBotComponent } from './chatbot/pages/main-chat-bot/main-chat-bot.component';
import { FileUploadComponent } from './chatbot/components/file-upload/file-upload.component';
import { LoginComponent } from './chatbot/components/login/login.component';
import { AuthCallbackComponent } from './chatbot/components/auth-callback-component/auth-callback-component.component';
import { HeaderComponent } from './chatbot/components/header/header.component';

export const routes: Routes = [
  { path: 'chat-main-componente', component: MainChatBotComponent, canActivate: [AuthGuard] },
  { path: 'fileupload', component: FileUploadComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

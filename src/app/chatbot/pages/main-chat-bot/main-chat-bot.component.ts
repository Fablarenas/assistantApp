import { Component } from '@angular/core';
import { InputQuestionComponent } from "../../components/input-question/input-question.component";
import { PowerByComponent } from "../../components/power-by/power-by.component";
import { HeaderComponent } from "../../components/header/header.component";
import { ChatMessageComponent } from "../../components/chat-message/chat-message.component";
import { UserMessageComponent } from "../../components/user-message/user-message.component";
import { DefaultQuestionsComponent } from "../../components/default-questions/default-questions.component";
import { CommonModule } from '@angular/common';
import { AssistanServiceService } from '../../services/assistan-service.service';
import { AssistantResponse } from '../../services/interfaces/assistant-response';
import { TypingEffectPipe } from '../../pipes/typing-effect.pipe';

@Component({
  selector: 'app-main-chat-bot',
  standalone: true,
  imports: [InputQuestionComponent, PowerByComponent, HeaderComponent, ChatMessageComponent, UserMessageComponent, DefaultQuestionsComponent, CommonModule, TypingEffectPipe],
  providers: [AssistanServiceService],
  templateUrl: './main-chat-bot.component.html',
  styleUrl: './main-chat-bot.component.css'
})
export class MainChatBotComponent {
 // Lista de preguntas y respuestas
 messages: AssistantResponse[] = [];

 // Booleano para controlar la visibilidad de preguntas predeterminadas
 public defaultQuestionsHide: boolean = false;

 constructor(private assistanService: AssistanServiceService) {}

 // Maneja el evento de hacer una pregunta
 makeQuestion(question: string) {
   this.defaultQuestionsHide = true;

   // Agrega la pregunta a la lista de mensajes
   this.messages.push({ questions: question, answer: 'Buscando respuesta...' });

   // Llama al servicio para obtener la respuesta
   this.assistanService.getAnswer(question).subscribe({
     next: (response) => {
       // Encuentra el índice de la pregunta para actualizar su respuesta
       const index = this.messages.findIndex(msg => msg.questions === question);
       if (index !== -1) {
         this.messages[index].answer = response.answer;
       }
     },
     error: (error) => {
       console.error('Error al obtener la respuesta:', error);
       // Maneja el error mostrando un mensaje de error en la lista
       const index = this.messages.findIndex(msg => msg.questions === question);
       if (index !== -1) {
         this.messages[index].answer = 'Hubo un error al obtener la respuesta.';
       }
     }
   });
 }
}

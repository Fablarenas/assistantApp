import { Component, ChangeDetectorRef } from '@angular/core';
import { InputQuestionComponent } from "../../components/input-question/input-question.component";
import { PowerByComponent } from "../../components/power-by/power-by.component";
import { HeaderComponent } from "../../components/header/header.component";
import { ChatMessageComponent } from "../../components/chat-message/chat-message.component";
import { UserMessageComponent } from "../../components/user-message/user-message.component";
import { DefaultQuestionsComponent } from "../../components/default-questions/default-questions.component";
import { CommonModule } from '@angular/common';
import { AssistanServiceService } from '../../services/assistan-service.service';
import { AssistantResponse } from '../../services/interfaces/assistant-response';

@Component({
  selector: 'app-main-chat-bot',
  standalone: true,
  imports: [InputQuestionComponent, PowerByComponent, HeaderComponent, ChatMessageComponent, UserMessageComponent, DefaultQuestionsComponent, CommonModule],
  providers: [AssistanServiceService],
  templateUrl: './main-chat-bot.component.html',
  styleUrl: './main-chat-bot.component.css'
})
export class MainChatBotComponent {
  // Lista de preguntas y respuestas
  messages: AssistantResponse[] = [];

  // Booleano para controlar la visibilidad de preguntas predeterminadas
  public defaultQuestionsHide: boolean = false;

  constructor(private assistanService: AssistanServiceService, private cdr: ChangeDetectorRef) {}

  makeQuestion(question: string) {
    this.defaultQuestionsHide = true;

    // Agrega la pregunta a la lista de mensajes con un estado inicial vacío
    this.messages.push({ questions: question, answer: ' ' });

    let accumulatedResponse = '';

    // Llama al servicio para obtener la respuesta en streaming
    this.assistanService.getChatResponseStream(question).subscribe({
      next: (responseChunk) => {
        accumulatedResponse += responseChunk; // Acumula todos los chunks
      },
      error: (error) => {
        console.error('Error al obtener la respuesta:', error);
        
        const index = this.messages.findIndex(msg => msg.questions === question);
        if (index !== -1) {
          this.messages[index].answer = 'Hubo un error al obtener la respuesta.';
          this.cdr.detectChanges();
        }
      },
      complete: () => {
        const index = this.messages.findIndex(msg => msg.questions === question);
        if (index !== -1) {
          // Aplicar el efecto de escritura después de recibir toda la respuesta
          this.animateTypingEffect(index, accumulatedResponse);
        }
      }
    });
  }

  // Método para animar el efecto de escritura
  animateTypingEffect(index: number, fullText: string, speed: number = 50) {
    let currentIndex = 0;
    const type = () => {
      if (currentIndex < fullText.length) {
        this.messages[index].answer += fullText.charAt(currentIndex);
        currentIndex++;
        this.cdr.detectChanges(); // Forzar la detección de cambios
        setTimeout(type, speed); // Continuar la animación después del tiempo especificado
      }
    };

    type(); // Inicia la animación de escritura
  }
}

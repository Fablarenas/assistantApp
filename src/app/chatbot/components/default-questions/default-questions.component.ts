import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'chatbot-default-questions',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './default-questions.component.html',
  styleUrl: './default-questions.component.css'
})
export class DefaultQuestionsComponent {
  @Input()
  public defaultQuestionsHide: boolean = false
  
  public defaultQuestions:string[] = [
    '¿Quien es el Coordinador del proyecto curricular de ingenieria telematica?',
    '¿Que son materias electivas y cuales son?',
    '¿Cuales son las fechas de grado para este 2025?',
    '¿Cuales son las materias de quinto semestre?']
    
  @Output()
  private onMakeQuestion = new EventEmitter<string>()

  makeDefautlQuestion(question: string){
    this.onMakeQuestion.emit(question)
  }
}

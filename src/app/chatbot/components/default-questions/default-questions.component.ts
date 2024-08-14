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
    'Are there resources for students interested in creative writing?',
    'Are there courses on environmental sustainability?',
    'Are there any workshops or seminars on entrepreneurship for students?',
    'What kinds of courses will I take as a philosophy major?']
    
  @Output()
  private onMakeQuestion = new EventEmitter<string>()

  makeDefautlQuestion(question: string){
    this.onMakeQuestion.emit(question)
  }
}

import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'chatbot-input-question',
  standalone: true,
  imports: [],
  templateUrl: './input-question.component.html',
  styleUrl: './input-question.component.css'
})
export class InputQuestionComponent {

  public question: string = ""

  @Output()
  private onMakeQuestion = new EventEmitter<string>()
  @ViewChild('txtInputValue') txtInputValue!: ElementRef;
  makeQuestions(question: string){
    this.onMakeQuestion.emit(question)
    this.txtInputValue.nativeElement.value = ''; 
  }
}

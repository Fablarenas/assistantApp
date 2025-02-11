import { ChangeDetectorRef, Component, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
  selector: 'chatbot-typping-effect-component',
  standalone: true,
  template: `
    <span [innerHTML]="displayedText">
    </span>
  `,
  styleUrl: './typping-effect-component.component.css'
})
export class TypingEffectComponent implements OnChanges {


  constructor( private cdRef: ChangeDetectorRef) {}
  ngAfterViewInit() {
    // Si agregas HTML dinámico en el AfterViewInit
    this.cdRef.detectChanges(); // Esto forzará la actualización del DOM.
  }
  @Input() text: string = '';
  @Input() speed: number = 1; // Velocidad de escritura en milisegundos

  displayedText: string = ''; // Texto que se mostrará en pantalla
  private timeoutId: any; // Identificador de setTimeout para cancelar si es necesario
  private currentIndex: number = 0; // Índice actual para continuar la animación desde donde se quedó
  formattedText: SafeHtml = ''; // Texto formateado que incluye HTML
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text'] && changes['text'].currentValue !== changes['text'].previousValue) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId); // Cancela cualquier animación anterior
      }

      // Iniciar o continuar la animación de escritura desde el índice actual
      this.typeText();
    }
  }

  typeText() {
    const type = () => {
      if (this.currentIndex < this.text.length) {
        // Añadir el carácter actual a `displayedText`
        this.displayedText += this.text.charAt(this.currentIndex);
        this.currentIndex++;

        
        // Continuar la animación hasta que se escriba todo el texto
        this.timeoutId = setTimeout(type, this.speed);
      }
    };

    type(); // Inicia la animación de escritura
  }
}

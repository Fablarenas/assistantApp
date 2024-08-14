import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'chatbot-typping-effect-component',
  standalone: true,
  template: `
    <span>{{ displayedText }}</span> <!-- Muestra el texto gradualmente -->
  `
})
export class TypingEffectComponent implements OnChanges {
  @Input() text: string = '';
  @Input() speed: number = 10; // Velocidad de escritura en milisegundos

  displayedText: string = ''; // Texto que se mostrará en pantalla
  private timeoutId: any; // Identificador de setTimeout para cancelar si es necesario

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text']) {
      this.displayedText = '';
      if (this.timeoutId) {
        clearTimeout(this.timeoutId); // Cancela cualquier animación anterior
      }
      this.typeText();
    }
  }

  typeText() {
    let currentIndex = 0;

    const type = () => {
      if (currentIndex < this.text.length) {
        this.displayedText += this.text.charAt(currentIndex); // Añade un carácter a la vez
        currentIndex++;
        this.timeoutId = setTimeout(type, this.speed); // Espera un tiempo antes de añadir el siguiente carácter
      }
    };

    type(); // Inicia la animación de escritura
  }
}

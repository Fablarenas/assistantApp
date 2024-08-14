// typing-effect.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typingEffect',
  standalone: true // Mark the pipe as standalone
})
export class TypingEffectPipe implements PipeTransform {
  transform(value: string, speed: number = 50): string {
    if (!value) return '';

    // Controla la longitud de la respuesta mostrada
    let displayedText = '';
    let currentIndex = 0;

    // Función para mostrar el texto gradualmente
    const type = () => {
      if (currentIndex < value.length) {
        displayedText += value.charAt(currentIndex);
        currentIndex++;
        setTimeout(type, speed);
      }
    };

    type();  // Inicia el efecto de escritura

    return displayedText;
  }
}

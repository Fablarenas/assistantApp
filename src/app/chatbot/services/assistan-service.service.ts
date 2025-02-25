import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssistantResponse } from './interfaces/assistant-response';
import { environment } from '../../../environments/environment';

interface ChatRequest {
  role: string;
  content: string;
}

@Injectable()
export class AssistanServiceService {

  private url: string = `${environment.apiUrl}/question`;
  private uploadUrl: string = `${environment.apiUrl}/upload/`;
  private askUrl: string = `${environment.apiUrl}/chat`;

  constructor(private httpClient: HttpClient) {}

  getAnswer(questions: string): Observable<AssistantResponse> {
    const params = new HttpParams().set('question', questions);
    return this.httpClient.get<AssistantResponse>(this.url, { params });
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      'accept': 'application/json'
    });

    return this.httpClient.post<any>(this.uploadUrl, formData, { headers });
  }

  getChatResponseStream(question: string): Observable<string> {
    return new Observable<string>((observer) => {
      // Acumulador para todo el contenido que llegue
      let accumulatedText = '';

      // Parámetros: ajusta "token" si tu backend lo requiere
      const params = new HttpParams()
        .set('question', question)
        .set('token', 'admin'); // Token quemado como ejemplo

      // Construimos la URL SSE
      const url = `${this.askUrl}?${params.toString()}`;
      // Creamos el EventSource
      const eventSource = new EventSource(url);

      eventSource.onopen = () => {
        console.log('Conexión SSE abierta.');
      };

      eventSource.onmessage = (event) => {
        // Cuando el backend avisa [END], significa que no habrá más chunks
        if (event.data === '[END]') {
          console.log('Fin de la transmisión. Cerrando SSE.');
          observer.next(accumulatedText);
          observer.complete();
          eventSource.close();
        } else {
          // Limpieza del chunk:
          // 1) Quitar el prefijo "data: "
          let chunk = event.data.replace(/^data:\s*/, '');

          // 2) Algunos backends ponen "html " al inicio -> removerlo
          chunk = chunk.replace(/^html\s*/, '');

          // 4) Acumularlo
          accumulatedText += chunk;
        }
      };

      eventSource.onerror = (error) => {
        console.error('Error en SSE:', error);
        observer.error(error);
        eventSource.close();
      };

      // Si el consumidor se desuscribe, cerramos la conexión
      return () => {
        console.log('Cerrando EventSource por desuscripción.');
        eventSource.close();
      };
    });
  }
}

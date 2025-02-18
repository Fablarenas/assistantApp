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
      console.log("Iniciando getChatResponseStream para la pregunta:", question);
  
      // Configuramos los parámetros incluyendo el token
      const params = new HttpParams()
        .set('question', question)
        .set('token', 'admin');
      const url = `${this.askUrl}?${params.toString()}`;
      console.log("URL EventSource:", url);
  
      // Creamos el EventSource
      const eventSource = new EventSource(url);
  
      eventSource.onopen = () => {
        console.log('Conexión con EventSource abierta.');
      };
  
      eventSource.onmessage = (event) => {
        console.log('Evento onmessage recibido:', event);
        console.log('Chunk recibido:', event.data);
  
        if (event.data === '[END]') {
          console.log('Fin de la transmisión recibido. Cerrando EventSource.');
          observer.complete();
          eventSource.close();
        } else {
          observer.next(event.data);
        }
      };
  
      eventSource.onerror = (error) => {
        console.error('Error en EventSource:', error);
        observer.error(new Error('Ocurrió un error con el EventSource.'));
        eventSource.close();
      };
  
      // Cuando se desuscriba, cerramos el EventSource
      return () => {
        console.log('Cerrando conexión con EventSource.');
        eventSource.close();
      };
    });
  }
  
}

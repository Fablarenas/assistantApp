import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssistantResponse } from './interfaces/assistant-response';

interface ChatRequest {
  role: string;
  content: string;
}

@Injectable()
export class AssistanServiceService {

  private url: string = `http://localhost:8000/question`;
  private uploadUrl: string = `http://localhost:8000/upload/`;
  private askUrl: string = `http://localhost:8000/chat/`;

  constructor(private httpClient: HttpClient) {}

  getAnswer(questions: string): Observable<AssistantResponse> {
    const params = new HttpParams()
      .set('question', questions);
    return this.httpClient.get<AssistantResponse>(this.url, { params });
  }

  // Método para subir un archivo
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
      const params = new HttpParams().set('question', question);
      const eventSource = new EventSource(`${this.askUrl}?${params.toString()}`);
  
      eventSource.onopen = () => {
        console.log('Conexión con EventSource abierta.');
      };
  
      eventSource.onmessage = (event) => {
        console.log('Chunk recibido:', event.data);
        
        // Si el backend envía un evento de cierre, cerrar la conexión
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
  
      return () => {
        console.log('Cerrando conexión con EventSource.');
        eventSource.close();
      };
    });
  }
  
  
  
}

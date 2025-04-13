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

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.post<any>(this.uploadUrl, formData, { headers });
  }

  getChatResponseStream(question: string): Observable<string> {
    return new Observable<string>((observer) => {
      let accumulatedText = '';
  
      const token = localStorage.getItem('access_token') || '';
  
      if (!token) {
        console.warn('No hay token. Redirigiendo al login.');
        window.location.href = '/login';
        observer.complete();
        return;
      }
  
      const params = new HttpParams()
        .set('question', question)
        .set('token', token);  // Ahora sí token real
  
      const url = `${this.askUrl}?${params.toString()}`;
      const eventSource = new EventSource(url);
  
      eventSource.onopen = () => {
        console.log('Conexión SSE abierta.');
      };
  
      eventSource.onmessage = (event) => {
        if (event.data === '[END]') {
          console.log('Fin de la transmisión. Cerrando SSE.');
          observer.next(accumulatedText);
          observer.complete();
          eventSource.close();
        } else {
          let chunk = event.data.replace(/^data:\s*/, '');
          chunk = chunk.replace(/^html\s*/, '');
          accumulatedText += chunk;
        }
      };
  
      eventSource.onerror = (error) => {
        console.error('Error en SSE:', error);
  
        // 3. Si hay error, asumir que puede ser token malo
        localStorage.removeItem('access_token');
        window.location.href = '/login';
  
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

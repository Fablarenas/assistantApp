import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AssistantResponse } from './interfaces/assistant-response';
import { environment } from '../../../environments/environment';

interface DocumentInfo {
  source: string;
}

@Injectable()
export class AssistanServiceService {
  private apiBase    = `${environment.apiUrl}`;
  private documentsUrl = `${this.apiBase}/documents`;
  private uploadUrl    = `${this.apiBase}/upload`;
  private askUrl: string = `${environment.apiUrl}/chat`;
  private questionUrl  = `${this.apiBase}/question`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de documentos indexados
   */
  getDocuments(): Observable<DocumentInfo[]> {
    const token = this.ensureToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<string[]>(this.documentsUrl, { headers })
    .pipe(
      map(list => list.map(s => ({ source: s }))),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Sube un archivo PDF para indexar
   */
  uploadFile(file: File): Observable<any> {
    const token = this.ensureToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<any>(this.uploadUrl, formData, { headers })
      .pipe(catchError(err => this.handleError(err)));
  }

  /**
   * Elimina un documento por su source
   */
  deleteDocument(source: string): Observable<any> {
    const token = this.ensureToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const url = `${this.documentsUrl}/${encodeURIComponent(source)}`;
    return this.http
      .delete<any>(url, { headers })
      .pipe(catchError(err => this.handleError(err)));
  }

  /**
   * Hace una consulta puntual al endpoint de preguntas
   */
  getAnswer(question: string): Observable<AssistantResponse> {
    const params = new HttpParams().set('question', question);
    return this.http
      .get<AssistantResponse>(this.questionUrl, { params })
      .pipe(catchError(err => this.handleError(err)));
  }

  /**
   * Obtiene streaming de respuestas SSE para chat
   */
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

  // -----------------------
  // Internals
  // -----------------------

  /** Asegura que haya token, si no redirige a login */
  private ensureToken(): string {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login';
      throw new Error('No hay token');
    }
    return token;
  }

  /** Manejo centralizado de errores HTTP */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401 || error.status === 403) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return throwError(() => error);
  }
}

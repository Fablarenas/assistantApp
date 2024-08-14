import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AssistantResponse } from './interfaces/assistant-response';
import { Observable } from 'rxjs';

@Injectable()
export class AssistanServiceService {
  
  private url: string = `http://localhost:8000/question`

  constructor(private httpClient: HttpClient){}

  getAnswer(questions: string): Observable<AssistantResponse>{
    const params = new HttpParams()
      .set('question', questions);
    return this.httpClient.get<AssistantResponse>(this.url, { params })
  }

}

import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from '../header/header.component';
import { AssistanServiceService } from '../../services/assistan-service.service';

interface DocumentInfo {
  source: string;
}

interface Notification {
  type: 'success' | 'error';
  message: string;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [AssistanServiceService],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  documents: DocumentInfo[] = [];
  isUploadModalOpen = false;
  selectedFile: File | null = null;
  loading = false;
  notification: Notification | null = null;

  constructor(private assistanService: AssistanServiceService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.assistanService.getDocuments().subscribe({
      next: (docs: { source: string }[]) => this.documents = docs,
      error: () => this.notification = { type: 'error', message: 'Error cargando documentos.' }
    });
  }

  openUploadModal(): void { this.isUploadModalOpen = true; }
  closeUploadModal(): void { this.isUploadModalOpen = false; }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files && input.files[0] || null;
  }

  onSubmit(form: NgForm): void {
    this.notification = null;

    if (!this.selectedFile || this.selectedFile.type !== 'application/pdf') {
      this.notification = { type: 'error', message: 'Selecciona un PDF válido.' };
      return;
    }

    this.loading = true;
    this.assistanService.uploadFile(this.selectedFile).subscribe({
      next: () => {
        this.loading = false;
        this.notification = { type: 'success', message: 'Archivo subido exitosamente.' };
        this.closeUploadModal();
        this.loadDocuments();
        form.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('rol');
          window.location.href = '/login';
        } else {
          this.notification = { type: 'error', message: 'Error subiendo archivo. Intenta nuevamente.' };
        }
        form.resetForm();
      }
    });
  }

  deleteDocument(source: string): void {
    this.assistanService.deleteDocument(source).subscribe({
      next: () => this.documents = this.documents.filter(d => d.source !== source),
      error: () => this.notification = { type: 'error', message: 'Error eliminando documento.' }
    });
  }
}
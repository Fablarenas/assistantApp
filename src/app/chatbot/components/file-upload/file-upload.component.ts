import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AssistanServiceService } from '../../services/assistan-service.service';

interface Document {
  id: string;
  name: string;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [HeaderComponent, FormsModule, HttpClientModule, CommonModule], // Importar módulos necesarios
  providers: [AssistanServiceService], // Registrar el servicio
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  documents: Document[] = [];
  selectedFile: File | null = null;

  constructor(private assistanService: AssistanServiceService) {}

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
    }
  }

  onSubmit(): void {
    console.log("Entró a enviar el PDF");
    if (this.selectedFile && this.selectedFile.type === 'application/pdf') {
      this.assistanService.uploadFile(this.selectedFile).subscribe({
        next: (response) => {
          alert('Archivo subido exitosamente');
          const newDocument: Document = {
            id: Date.now().toString(),
            name: this.selectedFile?.name|| ''
          };
          this.documents.push(newDocument);
          this.selectedFile = null;
        },
        error: (error) => {
          if (error.status === 401 || error.status === 403) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
          } else {
            alert('Error subiendo archivo:');
          }
        }
      });
    } else {
      alert('Por favor, selecciona un archivo PDF válido.');
    }
  }

  deleteDocument(id: string): void {
    this.documents = this.documents.filter(doc => doc.id !== id);
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
interface Document {
  id: string;
  name: string;
  isUnique: boolean;
}
@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})


export class FileUploadComponent {
  public uploadForm: FormGroup;
  documents: Document[] = [];
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder) {
    this.uploadForm = this.fb.group({
      documentName: ['', Validators.required],
      isUnique: [false]
    });
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      this.selectedFile = fileList[0];
    }
  }

  onSubmit(): void {
    if (this.uploadForm.valid && this.selectedFile && this.selectedFile.type === 'application/pdf') {
      const newDocument: Document = {
        id: Date.now().toString(),
        name: this.uploadForm.get('documentName')?.value,
        isUnique: this.uploadForm.get('isUnique')?.value
      };
      this.documents.push(newDocument);
      this.uploadForm.reset();
      this.selectedFile = null;
    } else {
      alert('Por favor, selecciona un archivo PDF válido y asigna un nombre.');
    }
  }

  deleteDocument(id: string): void {
    this.documents = this.documents.filter(doc => doc.id !== id);
  }
}

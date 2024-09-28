import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    const rol = localStorage.getItem('rol');
    if (rol) {
      console.log(rol);
      if (rol === 'admin') {
        this.router.navigate(['/fileupload']);
      } else if (rol === 'user') {
        this.router.navigate(['/chat-main-componente']);
      } else {
        console.log('Usuario sin permisos adecuados');
      }
    }
  }
  

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login form submitted', this.loginForm.value);
      // Aquí iría la lógica de autenticación real
    }
  }

  loginWithMicrosoft(): void {
    window.location.href = 'http://localhost:8000/login';
  }
}

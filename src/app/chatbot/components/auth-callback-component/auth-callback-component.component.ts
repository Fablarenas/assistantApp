import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-auth-callback',
  template: `<p>Redirigiendo...</p>`,
})
export class AuthCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Captura el token de los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const rol = params['rol'];
      if (token) {
        // Verifica que el token esté siendo recibido correctamente
        console.log('Token recibido:', token);

        // Guarda el rol y token en localStorage
        localStorage.setItem('access_token', token);
        localStorage.setItem('rol', rol);

        // Redirige al usuario a la página principal
        this.router.navigate(['/']);
      } else {
        // Si no hay token, redirige a login
        this.router.navigate(['/login']);
      }
    });
  }
}

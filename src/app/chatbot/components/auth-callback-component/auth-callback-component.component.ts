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
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const rol = params['rol'];
      if (token) {
        console.log('Token recibido:', token);

        localStorage.setItem('access_token', token);
        localStorage.setItem('rol', rol);

        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}

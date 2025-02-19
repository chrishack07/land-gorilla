import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private router: Router) {}

  // Método para navegar a Home
  navigateToHome() {
    this.router.navigate(['/home']);
  }

  // Método para navegar a About
  navigateToAbout() {
    this.router.navigate(['/about']);
  }
}

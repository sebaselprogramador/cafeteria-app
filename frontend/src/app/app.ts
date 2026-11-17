import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SitioService } from './core/sitio.service';
import { ChatbotComponent } from './components/chatbot.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ChatbotComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Nombre, menú, pie de página y textos: todo sale de la API (tablas configuracion, textos, paginas)
  protected sitio = inject(SitioService);
  protected menuAbierto = signal(false);
  protected anio = new Date().getFullYear();

  alternarMenu(): void {
    this.menuAbierto.update((v) => !v);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }
}

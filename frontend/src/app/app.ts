import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService } from './core/api.service';
import { Configuracion } from './core/models';
import { ChatbotComponent } from './components/chatbot.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ChatbotComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private api = inject(ApiService);

  // Datos del local obtenidos desde la API (nombre, dirección, teléfono, horario)
  protected config = signal<Configuracion | null>(null);
  protected menuAbierto = signal(false);
  protected anio = new Date().getFullYear();

  protected enlaces = [
    { ruta: '/', texto: 'Inicio' },
    { ruta: '/servicios', texto: 'Servicios' },
    { ruta: '/especialidades', texto: 'Especialidades' },
    { ruta: '/nosotros', texto: 'Nosotros' },
    { ruta: '/precios', texto: 'Precios' },
    { ruta: '/contactos', texto: 'Contactos' },
  ];

  ngOnInit(): void {
    this.api.configuracion().subscribe({
      next: (datos) => this.config.set(datos),
      error: () => this.config.set(null),
    });
  }

  alternarMenu(): void {
    this.menuAbierto.update((v) => !v);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }
}

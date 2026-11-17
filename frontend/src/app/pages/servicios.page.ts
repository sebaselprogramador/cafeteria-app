import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Servicio } from '../core/models';

@Component({
  selector: 'app-servicios',
  template: `
    <section class="contenedor seccion">
      <div class="encabezado-seccion">
        <h1>Nuestros servicios</h1>
        <p>Todo lo que puedes disfrutar en Café Aroma, desde tu primer café del día.</p>
      </div>

      @if (cargando()) {
        <p class="cargando">Cargando servicios…</p>
      } @else if (error()) {
        <p class="error">No se pudieron cargar los servicios.</p>
      } @else if (servicios().length === 0) {
        <p class="vacio">Pronto publicaremos nuestros servicios.</p>
      } @else {
        <div class="grid-tarjetas">
          @for (servicio of servicios(); track servicio.id) {
            <article class="tarjeta">
              <span class="icono" aria-hidden="true">{{ iconos[servicio.icono ?? ''] || '✨' }}</span>
              <h3>{{ servicio.nombre }}</h3>
              <p>{{ servicio.descripcion }}</p>
            </article>
          }
        </div>
      }
    </section>
  `,
  styles: `
    .icono {
      font-size: 2rem;
    }

    .tarjeta h3 {
      margin: 0.5rem 0;
    }

    .tarjeta p {
      color: var(--texto-suave);
      margin: 0;
    }
  `,
})
export class ServiciosPage implements OnInit {
  private api = inject(ApiService);

  protected servicios = signal<Servicio[]>([]);
  protected cargando = signal(true);
  protected error = signal(false);

  // Mapa de nombres de icono (guardados en la base de datos) a emojis
  protected iconos: Record<string, string> = {
    coffee: '☕',
    sun: '🌤️',
    cake: '🍰',
    users: '👥',
    bag: '🛍️',
    laptop: '💻',
  };

  ngOnInit(): void {
    this.api.servicios().subscribe({
      next: (datos) => {
        this.servicios.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }
}

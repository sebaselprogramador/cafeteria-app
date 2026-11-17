import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { SitioService } from '../core/sitio.service';
import { Servicio } from '../core/models';
import { EncabezadoComponent } from '../components/encabezado.component';

@Component({
  selector: 'app-servicios',
  imports: [EncabezadoComponent],
  template: `
    <section class="contenedor seccion">
      <app-encabezado ruta="servicios" />

      @if (cargando()) {
        <p class="cargando">{{ sitio.t('cargando') }}</p>
      } @else if (error()) {
        <p class="error">{{ sitio.t('error_carga') }}</p>
      } @else if (servicios().length === 0) {
        <p class="vacio">{{ sitio.t('vacio') }}</p>
      } @else {
        <div class="grid-tarjetas">
          @for (servicio of servicios(); track servicio.id) {
            <article class="tarjeta">
              @if (servicio.icono) {
                <span class="icono" aria-hidden="true">{{ servicio.icono }}</span>
              }
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
  protected sitio = inject(SitioService);

  protected servicios = signal<Servicio[]>([]);
  protected cargando = signal(true);
  protected error = signal(false);

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

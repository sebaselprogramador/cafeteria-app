import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { SitioService } from '../core/sitio.service';
import { Nosotros } from '../core/models';
import { EncabezadoComponent } from '../components/encabezado.component';

@Component({
  selector: 'app-nosotros',
  imports: [EncabezadoComponent],
  template: `
    <section class="contenedor seccion">
      <app-encabezado ruta="nosotros" />

      @if (cargando()) {
        <p class="cargando">{{ sitio.t('cargando') }}</p>
      } @else if (error()) {
        <p class="error">{{ sitio.t('error_carga') }}</p>
      } @else if (datos(); as d) {
        <div class="dos-columnas">
          <div>
            @for (seccion of d.secciones; track seccion.id) {
              <article class="bloque">
                <h2>{{ seccion.titulo }}</h2>
                <p>{{ seccion.contenido }}</p>
              </article>
            }
          </div>

          <aside class="tarjeta datos">
            <h2>{{ sitio.t('nosotros_visita_titulo') }}</h2>
            <p><strong>{{ sitio.t('etiqueta_direccion') }}:</strong> {{ d.direccion }}</p>
            <p><strong>{{ sitio.t('etiqueta_telefono') }}:</strong> {{ d.telefono }}</p>
            <p><strong>{{ sitio.t('etiqueta_horario') }}:</strong> {{ d.horario }}</p>
          </aside>
        </div>

        @if (d.fotos.length) {
          <h2 class="titulo-galeria">{{ sitio.t('nosotros_galeria_titulo') }}</h2>
          <div class="galeria">
            @for (foto of d.fotos; track foto.id) {
              <figure>
                <img [src]="foto.imagenUrl" [alt]="foto.descripcion || ''" loading="lazy" />
                @if (foto.descripcion) {
                  <figcaption>{{ foto.descripcion }}</figcaption>
                }
              </figure>
            }
          </div>
        }
      }
    </section>
  `,
  styles: `
    .dos-columnas {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    .bloque h2,
    .datos h2 {
      font-size: 1.5rem;
      margin: 0 0 0.5rem;
    }

    .bloque p {
      color: var(--texto-suave);
      margin: 0 0 1.5rem;
    }

    .datos p {
      margin: 0.5rem 0;
    }

    .titulo-galeria {
      margin: 2.5rem 0 1rem;
    }

    .galeria {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    figure {
      margin: 0;
    }

    figure img {
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      border-radius: 12px;
    }

    figcaption {
      font-size: 0.9rem;
      color: var(--texto-suave);
      margin-top: 0.35rem;
    }

    @media (max-width: 800px) {
      .dos-columnas {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class NosotrosPage implements OnInit {
  private api = inject(ApiService);
  protected sitio = inject(SitioService);

  protected datos = signal<Nosotros | null>(null);
  protected cargando = signal(true);
  protected error = signal(false);

  ngOnInit(): void {
    this.api.nosotros().subscribe({
      next: (respuesta) => {
        this.datos.set(respuesta);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }
}

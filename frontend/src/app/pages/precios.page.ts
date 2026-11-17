import { Component, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../core/api.service';
import { SitioService } from '../core/sitio.service';
import { GrupoPrecios } from '../core/models';
import { EncabezadoComponent } from '../components/encabezado.component';

@Component({
  selector: 'app-precios',
  imports: [DecimalPipe, EncabezadoComponent],
  template: `
    <section class="contenedor seccion">
      <app-encabezado ruta="precios" />

      @if (cargando()) {
        <p class="cargando">{{ sitio.t('cargando') }}</p>
      } @else if (error()) {
        <p class="error">{{ sitio.t('error_carga') }}</p>
      } @else if (grupos().length === 0) {
        <p class="vacio">{{ sitio.t('vacio') }}</p>
      } @else {
        <div class="grid-precios">
          @for (grupo of grupos(); track grupo.categoria) {
            <article class="tarjeta">
              <h2>{{ grupo.categoria }}</h2>
              <ul>
                @for (item of grupo.items; track item.id) {
                  <li>
                    @if (item.imagenUrl) {
                      <img class="foto" [src]="item.imagenUrl" [alt]="item.nombre" loading="lazy" width="64" height="64" />
                    }
                    <div class="info">
                      <span class="nombre">{{ item.nombre }}</span>
                      @if (item.descripcion) {
                        <small>{{ item.descripcion }}</small>
                      }
                    </div>
                    <span class="precio">{{ item.precio | number: '1.2-2' }} {{ item.moneda }}</span>
                  </li>
                }
              </ul>
            </article>
          }
        </div>
      }
    </section>
  `,
  styles: `
    .grid-precios {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    h2 {
      font-size: 1.3rem;
      margin: 0 0 0.75rem;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.6rem 0;
      border-bottom: 1px dashed var(--borde);
    }

    .foto {
      width: 64px;
      height: 64px;
      flex-shrink: 0;
      object-fit: cover;
      border-radius: 12px;
    }

    .info {
      flex: 1;
      min-width: 0;
    }

    li:last-child {
      border-bottom: none;
    }

    small {
      display: block;
      color: var(--texto-suave);
    }

    .precio {
      font-weight: 700;
      color: var(--cafe);
      white-space: nowrap;
    }
  `,
})
export class PreciosPage implements OnInit {
  private api = inject(ApiService);
  protected sitio = inject(SitioService);

  protected grupos = signal<GrupoPrecios[]>([]);
  protected cargando = signal(true);
  protected error = signal(false);

  ngOnInit(): void {
    this.api.precios().subscribe({
      next: (datos) => {
        this.grupos.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }
}

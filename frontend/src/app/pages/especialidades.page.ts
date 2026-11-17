import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Especialidad } from '../core/models';

@Component({
  selector: 'app-especialidades',
  template: `
    <section class="contenedor seccion">
      <div class="encabezado-seccion">
        <h1>Especialidades</h1>
        <p>Las preparaciones que nos hacen únicos.</p>
      </div>

      @if (cargando()) {
        <p class="cargando">Cargando especialidades…</p>
      } @else if (error()) {
        <p class="error">No se pudieron cargar las especialidades.</p>
      } @else if (especialidades().length === 0) {
        <p class="vacio">Próximamente nuevas especialidades.</p>
      } @else {
        <div class="grid-tarjetas">
          @for (item of especialidades(); track item.id) {
            <article class="tarjeta">
              <img
                class="imagen"
                [src]="item.imagenUrl || '/assets/placeholder.svg'"
                [alt]="item.nombre"
                loading="lazy"
              />
              <h3>{{ item.nombre }}</h3>
              <p>{{ item.descripcion }}</p>
            </article>
          }
        </div>
      }
    </section>
  `,
  styles: `
    .imagen {
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 0.75rem;
    }

    .tarjeta h3 {
      margin: 0 0 0.35rem;
    }

    .tarjeta p {
      color: var(--texto-suave);
      margin: 0;
    }
  `,
})
export class EspecialidadesPage implements OnInit {
  private api = inject(ApiService);

  protected especialidades = signal<Especialidad[]>([]);
  protected cargando = signal(true);
  protected error = signal(false);

  ngOnInit(): void {
    this.api.especialidades().subscribe({
      next: (datos) => {
        this.especialidades.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }
}

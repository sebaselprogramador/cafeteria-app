import { Component, computed, inject, input } from '@angular/core';
import { SitioService } from '../core/sitio.service';

// Título y descripción de una página, tomados de la tabla `paginas`
@Component({
  selector: 'app-encabezado',
  template: `
    <div class="encabezado-seccion">
      <h1>{{ pagina()?.titulo }}</h1>
      @if (pagina()?.descripcion) {
        <p>{{ pagina()?.descripcion }}</p>
      }
    </div>
  `,
})
export class EncabezadoComponent {
  private sitio = inject(SitioService);
  readonly ruta = input.required<string>();
  protected pagina = computed(() => this.sitio.pagina(this.ruta()));
}

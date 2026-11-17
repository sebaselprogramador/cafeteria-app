import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import { Pagina, Sitio } from './models';

// Guarda en memoria los datos generales del sitio (tablas configuracion, textos y paginas).
// Se carga una sola vez al iniciar la app, antes de mostrar la primera página.
@Injectable({ providedIn: 'root' })
export class SitioService {
  private api = inject(ApiService);

  readonly datos = signal<Sitio | null>(null);
  readonly sinConexion = signal(false);
  readonly paginas = computed(() => this.datos()?.paginas ?? []);

  async cargar(): Promise<void> {
    try {
      this.datos.set(await firstValueFrom(this.api.sitio()));
    } catch {
      this.sinConexion.set(true);
    }
  }

  /** Valor de la tabla `configuracion` */
  c(clave: string): string {
    return this.datos()?.configuracion[clave] ?? '';
  }

  /** Valor de la tabla `textos` */
  t(clave: string): string {
    return this.datos()?.textos[clave] ?? '';
  }

  /** Fila de la tabla `paginas` */
  pagina(ruta: string): Pagina | undefined {
    return this.paginas().find((p) => p.ruta === ruta);
  }
}

import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { SitioService } from './sitio.service';

// Título de la pestaña = título de la página (tabla paginas) + nombre del local (tabla configuracion)
@Injectable({ providedIn: 'root' })
export class SitioTitleStrategy extends TitleStrategy {
  private title = inject(Title);
  private sitio = inject(SitioService);

  override updateTitle(estado: RouterStateSnapshot): void {
    let ruta: ActivatedRouteSnapshot | null = estado.root;
    while (ruta?.firstChild) ruta = ruta.firstChild;

    const clave = ruta?.data['pagina'] as string | undefined;
    const pagina = clave !== undefined ? this.sitio.pagina(clave) : undefined;
    const nombre = this.sitio.c('nombre');

    this.title.setTitle([pagina?.titulo, nombre].filter(Boolean).join(' · '));
  }
}

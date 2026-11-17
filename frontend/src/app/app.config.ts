import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, TitleStrategy } from '@angular/router';
import { routes } from './app.routes';
import { SitioService } from './core/sitio.service';
import { SitioTitleStrategy } from './core/sitio-title.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    { provide: TitleStrategy, useExisting: SitioTitleStrategy },
    // Carga configuracion, textos y paginas desde la API antes de mostrar la app
    provideAppInitializer(() => inject(SitioService).cargar()),
  ],
};

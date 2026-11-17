import { Routes } from '@angular/router';
import { InicioPage } from './pages/inicio.page';
import { ServiciosPage } from './pages/servicios.page';
import { EspecialidadesPage } from './pages/especialidades.page';
import { NosotrosPage } from './pages/nosotros.page';
import { PreciosPage } from './pages/precios.page';
import { ContactosPage } from './pages/contactos.page';

// Cada ruta solo indica qué componente se muestra.
// Etiquetas del menú, títulos y descripciones vienen de la tabla `paginas` (clave `pagina`).
export const routes: Routes = [
  { path: '', component: InicioPage, data: { pagina: '' } },
  { path: 'servicios', component: ServiciosPage, data: { pagina: 'servicios' } },
  { path: 'especialidades', component: EspecialidadesPage, data: { pagina: 'especialidades' } },
  { path: 'nosotros', component: NosotrosPage, data: { pagina: 'nosotros' } },
  { path: 'precios', component: PreciosPage, data: { pagina: 'precios' } },
  { path: 'contactos', component: ContactosPage, data: { pagina: 'contactos' } },
  { path: '**', redirectTo: '' },
];

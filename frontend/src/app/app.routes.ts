import { Routes } from '@angular/router';
import { InicioPage } from './pages/inicio.page';
import { ServiciosPage } from './pages/servicios.page';
import { EspecialidadesPage } from './pages/especialidades.page';
import { NosotrosPage } from './pages/nosotros.page';
import { PreciosPage } from './pages/precios.page';
import { ContactosPage } from './pages/contactos.page';

export const routes: Routes = [
  { path: '', component: InicioPage, title: 'Inicio · Café Aroma' },
  { path: 'servicios', component: ServiciosPage, title: 'Servicios · Café Aroma' },
  { path: 'especialidades', component: EspecialidadesPage, title: 'Especialidades · Café Aroma' },
  { path: 'nosotros', component: NosotrosPage, title: 'Nosotros · Café Aroma' },
  { path: 'precios', component: PreciosPage, title: 'Precios · Café Aroma' },
  { path: 'contactos', component: ContactosPage, title: 'Contactos · Café Aroma' },
  { path: '**', redirectTo: '' },
];

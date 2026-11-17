// Contratos de datos que devuelve la API Node.js

export interface Pagina {
  ruta: string;
  etiquetaMenu: string;
  titulo: string;
  descripcion: string | null;
  resumen: string | null;
  mostrarEnInicio: boolean;
}

// Respuesta de GET /api/sitio: tablas configuracion, textos y paginas
export interface Sitio {
  configuracion: Record<string, string>;
  textos: Record<string, string>;
  paginas: Pagina[];
}

export interface Inicio {
  nombre: string;
  slogan: string;
  heroTitulo: string;
  heroSubtitulo: string;
  video: { id: number; titulo: string; urlVideo: string; urlPoster: string | null; fuente: string | null } | null;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
}

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagenUrl: string | null;
}

export interface SeccionNosotros {
  id: number;
  titulo: string;
  contenido: string;
}

export interface FotoTienda {
  id: number;
  imagenUrl: string;
  descripcion: string | null;
}

export interface Nosotros {
  secciones: SeccionNosotros[];
  fotos: FotoTienda[];
  direccion: string;
  telefono: string;
  horario: string;
}

export interface ItemPrecio {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  moneda: string;
}

export interface GrupoPrecios {
  categoria: string;
  items: ItemPrecio[];
}

export interface ContactoPayload {
  nombre: string;
  email: string;
  telefono?: string;
  asunto?: string;
  mensaje: string;
}

export interface MensajeChat {
  rol: 'user' | 'assistant';
  texto: string;
}

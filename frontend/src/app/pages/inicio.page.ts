import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { SitioService } from '../core/sitio.service';
import { Inicio } from '../core/models';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  template: `
    <section class="hero">
      @if (inicio()?.video; as video) {
        <video
          class="hero-video"
          [src]="video.urlVideo"
          [poster]="video.urlPoster || ''"
          autoplay
          muted
          loop
          playsinline
          aria-hidden="true"
        ></video>
      }
      <div class="hero-velo"></div>

      <div class="contenedor hero-contenido" [class.con-foto]="inicio()?.heroImagen && !fotoFallo()">
        <div class="hero-texto">
          @if (cargando()) {
            <p>{{ sitio.t('cargando') }}</p>
          } @else if (error()) {
            <p>{{ sitio.t('error_carga') }}</p>
          } @else {
            <p class="eyebrow">{{ inicio()?.slogan }}</p>
            <h1>{{ inicio()?.heroTitulo }}</h1>
            <p class="subtitulo">{{ inicio()?.heroSubtitulo }}</p>
            <div class="acciones">
              @if (sitio.t('hero_boton_primario')) {
                <a class="boton" [routerLink]="sitio.t('hero_boton_primario_ruta')">{{ sitio.t('hero_boton_primario') }}</a>
              }
              @if (sitio.t('hero_boton_secundario')) {
                <a class="boton secundario" [routerLink]="sitio.t('hero_boton_secundario_ruta')">{{ sitio.t('hero_boton_secundario') }}</a>
              }
            </div>
          }
        </div>

        <!-- Foto de portada: ruta guardada en configuracion.hero_imagen -->
        @if (inicio()?.heroImagen && !fotoFallo()) {
          <figure class="hero-foto">
            <img [src]="inicio()?.heroImagen" [alt]="inicio()?.heroImagenAlt || ''" fetchpriority="high" (error)="fotoFallo.set(true)" />
          </figure>
        }
      </div>
    </section>

    @if (atajos().length) {
      <section class="contenedor seccion atajos">
        @for (pagina of atajos(); track pagina.ruta) {
          <a class="tarjeta" [routerLink]="'/' + pagina.ruta">
            <h3>{{ pagina.titulo }}</h3>
            <p>{{ pagina.resumen }}</p>
          </a>
        }
      </section>
    }
  `,
  styles: `
    .hero {
      position: relative;
      min-height: 80vh;
      display: flex;
      align-items: center;
      color: #fff;
      background: linear-gradient(135deg, #3b2416, #a47551);
      overflow: hidden;
    }

    .hero-video {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-velo {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgb(0 0 0 / 0.25), rgb(0 0 0 / 0.65));
    }

    .hero-contenido {
      position: relative;
      z-index: 1;
      padding-top: 3rem;
      padding-bottom: 3rem;
    }

    .hero-texto {
      max-width: 620px;
    }

    .hero-contenido.con-foto {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 3rem;
      align-items: center;
    }

    .hero-foto {
      margin: 0;
      justify-self: end;
      width: 100%;
      max-width: 400px;
      border-radius: 24px;
      overflow: hidden;
      border: 6px solid rgb(245 236 223 / 0.9);
      box-shadow: 0 24px 50px rgb(0 0 0 / 0.45);
      transform: rotate(1.5deg);
    }

    .hero-foto img {
      width: 100%;
      aspect-ratio: 4 / 5;
      object-fit: cover;
      object-position: center 30%;
    }

    @media (max-width: 800px) {
      .hero-contenido.con-foto {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .hero-foto {
        justify-self: center;
        max-width: 320px;
        transform: none;
      }
    }

    .hero h1 {
      color: #fff;
      font-size: clamp(2rem, 6vw, 3.5rem);
      margin: 0.25rem 0 1rem;
    }

    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-size: 0.85rem;
      color: var(--acento);
      margin: 0;
    }

    .subtitulo {
      font-size: 1.15rem;
      opacity: 0.92;
      max-width: 560px;
    }

    .acciones {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .atajos {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
    }

    .atajos a {
      text-decoration: none;
      color: var(--texto);
      transition: transform 0.2s ease;
    }

    .atajos a:hover {
      transform: translateY(-3px);
    }

    .atajos h3 {
      margin-top: 0;
    }
  `,
})
export class InicioPage implements OnInit {
  private api = inject(ApiService);
  protected sitio = inject(SitioService);

  protected inicio = signal<Inicio | null>(null);
  protected cargando = signal(true);
  protected error = signal(false);
  // Si el archivo de la foto no existe, se oculta en vez de mostrar una imagen rota
  protected fotoFallo = signal(false);

  // Tarjetas de acceso rápido: páginas marcadas con mostrar_en_inicio = 1
  protected atajos = computed(() => this.sitio.paginas().filter((p) => p.mostrarEnInicio));

  ngOnInit(): void {
    this.api.inicio().subscribe({
      next: (datos) => {
        this.inicio.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }
}

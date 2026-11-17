import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
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

      <div class="contenedor hero-contenido">
        @if (cargando()) {
          <p class="hero-cargando">Cargando…</p>
        } @else if (error()) {
          <h1>Bienvenido</h1>
          <p class="error">No pudimos cargar el contenido. Revisa que la API esté activa.</p>
        } @else {
          <p class="eyebrow">{{ inicio()?.slogan }}</p>
          <h1>{{ inicio()?.heroTitulo }}</h1>
          <p class="subtitulo">{{ inicio()?.heroSubtitulo }}</p>
          <div class="acciones">
            <a class="boton" routerLink="/precios">Ver precios</a>
            <a class="boton secundario" routerLink="/contactos">Contáctanos</a>
          </div>
        }
      </div>
    </section>

    <section class="contenedor seccion atajos">
      <a class="tarjeta" routerLink="/servicios"><h3>Servicios</h3><p>Lo que ofrecemos cada día.</p></a>
      <a class="tarjeta" routerLink="/especialidades"><h3>Especialidades</h3><p>Nuestras bebidas y postres favoritos.</p></a>
      <a class="tarjeta" routerLink="/nosotros"><h3>Nosotros</h3><p>Historia, dirección y fotos del local.</p></a>
    </section>
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
      max-width: 720px;
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

    .hero-cargando,
    .hero .error {
      color: #fff;
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

  protected inicio = signal<Inicio | null>(null);
  protected cargando = signal(true);
  protected error = signal(false);

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

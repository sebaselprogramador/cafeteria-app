import { Component, ElementRef, inject, signal, viewChild, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { SitioService } from '../core/sitio.service';
import { MensajeChat } from '../core/models';

// Widget flotante del chatbot (backend Node.js → Ollama con gemma3).
// Título, saludo, placeholder y mensajes vienen de la tabla `textos`.
@Component({
  selector: 'app-chatbot',
  template: `
    <button class="lanzador" type="button" (click)="alternar()" [attr.aria-expanded]="abierto()" [attr.aria-label]="sitio.t('chatbot_titulo')">
      {{ abierto() ? '✕' : '💬' }}
    </button>

    @if (abierto()) {
      <section class="panel" [attr.aria-label]="sitio.t('chatbot_titulo')">
        <header>
          <strong>{{ sitio.t('chatbot_titulo') }}</strong>
          @if (!disponible()) {
            <small>{{ sitio.t('chatbot_no_disponible') }}</small>
          }
        </header>

        <div class="mensajes" #contenedor>
          <div class="burbuja">{{ sitio.t('chatbot_saludo') }}</div>
          @for (m of mensajes(); track $index) {
            <div class="burbuja" [class.usuario]="m.rol === 'user'">{{ m.texto }}</div>
          }
          @if (enviando()) {
            <div class="burbuja escribiendo">{{ sitio.t('chatbot_escribiendo') }}</div>
          }
        </div>

        <!-- (submit) + preventDefault: evita que el navegador recargue la página al enviar -->
        <form class="entrada" (submit)="$event.preventDefault(); enviar()">
          <input
            type="text"
            name="mensaje"
            [value]="borrador()"
            (input)="borrador.set($any($event.target).value)"
            [placeholder]="sitio.t('chatbot_placeholder')"
            maxlength="500"
            autocomplete="off"
          />
          <button class="boton" type="submit" [disabled]="enviando() || !borrador().trim()">{{ sitio.t('chatbot_boton') }}</button>
        </form>
      </section>
    }
  `,
  styles: `
    .lanzador {
      position: fixed;
      right: 20px;
      bottom: 20px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      background: var(--cafe);
      color: #fff;
      font-size: 1.5rem;
      box-shadow: var(--sombra);
      cursor: pointer;
      z-index: 100;
    }

    .panel {
      position: fixed;
      right: 20px;
      bottom: 90px;
      width: min(360px, calc(100vw - 32px));
      max-height: 70vh;
      display: flex;
      flex-direction: column;
      background: var(--blanco);
      border: 1px solid var(--borde);
      border-radius: 16px;
      box-shadow: 0 12px 30px rgb(0 0 0 / 0.25);
      overflow: hidden;
      z-index: 100;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: var(--cafe-oscuro);
      color: var(--claro);
    }

    .mensajes {
      flex: 1;
      overflow-y: auto;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-height: 220px;
    }

    .burbuja {
      align-self: flex-start;
      max-width: 85%;
      padding: 0.55rem 0.8rem;
      border-radius: 14px 14px 14px 4px;
      background: var(--crema);
      color: var(--texto);
      white-space: pre-wrap;
      font-size: 0.95rem;
    }

    .burbuja.usuario {
      align-self: flex-end;
      border-radius: 14px 14px 4px 14px;
      background: var(--cafe);
      color: #fff;
    }

    .escribiendo {
      opacity: 0.7;
      font-style: italic;
    }

    .entrada {
      display: flex;
      gap: 0.5rem;
      padding: 0.6rem;
      border-top: 1px solid var(--borde);
    }

    .entrada input {
      flex: 1;
      min-width: 0;
      font: inherit;
      padding: 0.55rem 0.7rem;
      border-radius: 10px;
      border: 1px solid var(--borde);
      background: var(--blanco);
      color: var(--texto);
    }
  `,
})
export class ChatbotComponent implements OnInit {
  private api = inject(ApiService);
  protected sitio = inject(SitioService);
  private contenedor = viewChild<ElementRef<HTMLDivElement>>('contenedor');

  protected abierto = signal(false);
  protected enviando = signal(false);
  protected borrador = signal('');
  protected disponible = signal(true);
  protected mensajes = signal<MensajeChat[]>([]);

  private sesionId = this.obtenerSesion();

  ngOnInit(): void {
    this.api.estadoChat().subscribe({
      next: (e) => this.disponible.set(e.disponible && e.modeloListo !== false),
      error: () => this.disponible.set(false),
    });
  }

  alternar(): void {
    this.abierto.update((v) => !v);
  }

  enviar(): void {
    const texto = this.borrador().trim();
    if (!texto || this.enviando()) return;

    this.mensajes.update((lista) => [...lista, { rol: 'user', texto }]);
    this.borrador.set('');
    this.enviando.set(true);
    this.desplazarAlFinal();

    this.api.enviarChat(this.sesionId, texto).subscribe({
      next: (r) => {
        this.mensajes.update((lista) => [...lista, { rol: 'assistant', texto: r.respuesta }]);
        this.enviando.set(false);
        this.desplazarAlFinal();
      },
      error: () => {
        this.mensajes.update((lista) => [...lista, { rol: 'assistant', texto: this.sitio.t('chatbot_error') }]);
        this.enviando.set(false);
        this.desplazarAlFinal();
      },
    });
  }

  private desplazarAlFinal(): void {
    setTimeout(() => {
      const el = this.contenedor()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  // Identificador de sesión del visitante, para mantener el contexto del chat
  private obtenerSesion(): string {
    const clave = 'cafe-chat-sesion';
    try {
      const existente = sessionStorage.getItem(clave);
      if (existente) return existente;
      const nueva = crypto.randomUUID();
      sessionStorage.setItem(clave, nueva);
      return nueva;
    } catch {
      return crypto.randomUUID();
    }
  }
}

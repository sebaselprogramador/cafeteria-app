import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { SitioService } from '../core/sitio.service';
import { Mesa, ZonaMesas } from '../core/models';
import { EncabezadoComponent } from '../components/encabezado.component';

type EstadoMesa = 'libre' | 'ocupada' | 'pequena' | 'seleccionada';

// Página de reservas: elige día/hora/personas → mesa en el plano de zonas → datos personales.
// Zonas, mesas, horarios y textos vienen de MySQL (zonas_mesas, mesas, configuracion, textos).
@Component({
  selector: 'app-reservas',
  imports: [ReactiveFormsModule, EncabezadoComponent],
  template: `
    <section class="contenedor seccion">
      <app-encabezado ruta="reservas" />

      <!-- Paso 1: fecha, hora y personas -->
      <div class="tarjeta paso">
        <h2>{{ sitio.t('reserva_paso1') }}</h2>
        <div class="filtros">
          <label>
            {{ sitio.t('reserva_fecha') }}
            <input type="date" [value]="fecha()" [min]="hoy" [max]="fechaMax()" (change)="cambiarFecha($any($event.target).value)" />
          </label>
          <label>
            {{ sitio.t('reserva_hora') }}
            <select [value]="hora()" (change)="cambiarHora($any($event.target).value)" [disabled]="!horas().length">
              @for (h of horas(); track h) {
                <option [value]="h" [selected]="h === hora()">{{ h }}</option>
              }
            </select>
          </label>
          <label>
            {{ sitio.t('reserva_personas') }}
            <select [value]="personas()" (change)="cambiarPersonas(+$any($event.target).value)">
              @for (n of opcionesPersonas(); track n) {
                <option [value]="n" [selected]="n === personas()">{{ n }}</option>
              }
            </select>
          </label>
        </div>
        @if (!horas().length) {
          <p class="aviso">{{ sitio.t('reserva_sin_horarios') }}</p>
        }
      </div>

      <!-- Paso 2: plano de zonas de mesas -->
      @if (horas().length) {
        <div class="paso">
          <div class="titulo-paso">
            <h2>{{ sitio.t('reserva_paso2') }}</h2>
            <ul class="leyenda">
              <li><span class="punto libre"></span>{{ sitio.t('reserva_leyenda_libre') }}</li>
              <li><span class="punto seleccionada"></span>{{ sitio.t('reserva_leyenda_seleccionada') }}</li>
              <li><span class="punto ocupada"></span>{{ sitio.t('reserva_leyenda_ocupada') }}</li>
              <li><span class="punto pequena"></span>{{ sitio.t('reserva_leyenda_pequena') }}</li>
            </ul>
          </div>

          @if (cargandoMesas()) {
            <p class="cargando">{{ sitio.t('cargando') }}</p>
          } @else if (errorMesas()) {
            <p class="error">{{ sitio.t('error_carga') }}</p>
          } @else {
            <div class="zonas">
              @for (zona of zonas(); track zona.id) {
                <article class="tarjeta zona">
                  <header>
                    <span class="zona-icono" aria-hidden="true">{{ zona.icono }}</span>
                    <div>
                      <h3>{{ zona.nombre }}</h3>
                      <p>{{ zona.descripcion }}</p>
                    </div>
                  </header>
                  <div class="plano">
                    @for (mesa of zona.mesas; track mesa.id) {
                      <button
                        type="button"
                        class="mesa"
                        [class]="'mesa ' + mesa.forma + ' ' + estado(mesa)"
                        [disabled]="estado(mesa) === 'ocupada' || estado(mesa) === 'pequena'"
                        [attr.aria-pressed]="estado(mesa) === 'seleccionada'"
                        [attr.aria-label]="sitio.t('reserva_mesa') + ' ' + mesa.codigo + ', ' + mesa.capacidad + ' ' + sitio.t('reserva_capacidad')"
                        (click)="elegir(mesa, zona)"
                      >
                        <strong>{{ mesa.codigo }}</strong>
                        <small>{{ mesa.capacidad }} {{ sitio.t('reserva_capacidad') }}</small>
                      </button>
                    }
                  </div>
                </article>
              }
            </div>
          }
        </div>

        <!-- Paso 3: datos de quien reserva -->
        <form class="tarjeta paso formulario" [formGroup]="form" (ngSubmit)="reservar()" novalidate>
          <h2>{{ sitio.t('reserva_paso3') }}</h2>

          @if (seleccion(); as s) {
            <p class="resumen">
              {{ sitio.t('reserva_resumen') }}: <strong>{{ sitio.t('reserva_mesa') }} {{ s.mesa.codigo }}</strong>
              · {{ s.zona }} · {{ fecha() }} · {{ hora() }} · {{ personas() }} {{ sitio.t('reserva_capacidad') }}
            </p>
          } @else {
            <p class="aviso">{{ sitio.t('reserva_sin_mesa') }}</p>
          }

          <div class="campos">
            <label>
              {{ sitio.t('form_nombre') }}
              <input type="text" formControlName="nombre" autocomplete="name" />
              @if (form.controls.nombre.touched && form.controls.nombre.invalid) {
                <small class="error">{{ sitio.t('form_error_nombre') }}</small>
              }
            </label>
            <label>
              {{ sitio.t('form_email') }}
              <input type="email" formControlName="email" autocomplete="email" />
              @if (form.controls.email.touched && form.controls.email.invalid) {
                <small class="error">{{ sitio.t('form_error_email') }}</small>
              }
            </label>
            <label>
              {{ sitio.t('form_telefono') }}
              <input type="tel" formControlName="telefono" autocomplete="tel" />
            </label>
            <label class="ancho">
              {{ sitio.t('reserva_comentario') }}
              <textarea rows="3" formControlName="comentario" maxlength="500"></textarea>
            </label>
          </div>

          <button class="boton" type="submit" [disabled]="enviando() || !seleccion()">
            {{ enviando() ? sitio.t('reserva_enviando') : sitio.t('reserva_boton') }}
          </button>

          @if (exito()) {
            <p class="exito" role="status">{{ exito() }}</p>
          }
          @if (error()) {
            <p class="error" role="alert">{{ error() }}</p>
          }
        </form>
      }
    </section>
  `,
  styles: `
    .paso {
      margin-bottom: 1.5rem;
    }

    .paso h2 {
      font-size: 1.3rem;
      margin: 0 0 1rem;
    }

    .filtros {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 1rem;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      font-weight: 600;
    }

    input,
    select,
    textarea {
      font: inherit;
      padding: 0.6rem 0.75rem;
      border-radius: 10px;
      border: 1px solid var(--borde);
      background: var(--blanco);
      color: var(--texto);
    }

    .titulo-paso {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .titulo-paso h2 {
      margin: 0;
    }

    .leyenda {
      display: flex;
      flex-wrap: wrap;
      gap: 0.9rem;
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: 0.9rem;
      color: var(--texto-suave);
    }

    .leyenda li {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .punto {
      width: 14px;
      height: 14px;
      border-radius: 4px;
      display: inline-block;
    }

    .zonas {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.25rem;
    }

    .zona header {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .zona-icono {
      font-size: 1.8rem;
    }

    .zona h3 {
      margin: 0;
    }

    .zona p {
      margin: 0.2rem 0 0;
      color: var(--texto-suave);
      font-size: 0.9rem;
    }

    /* Plano: suelo de madera clara con las mesas encima */
    .plano {
      display: flex;
      flex-wrap: wrap;
      gap: 0.9rem;
      padding: 1rem;
      border-radius: 12px;
      background: repeating-linear-gradient(90deg, rgb(164 117 81 / 0.12) 0 22px, rgb(164 117 81 / 0.2) 22px 24px);
      border: 1px dashed var(--borde);
    }

    .mesa {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.1rem;
      width: 72px;
      height: 72px;
      border: 2px solid transparent;
      font: inherit;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .mesa.redonda {
      border-radius: 50%;
    }

    .mesa.cuadrada {
      border-radius: 12px;
    }

    .mesa.larga {
      width: 132px;
      border-radius: 14px;
    }

    .mesa small {
      font-size: 0.75rem;
    }

    .mesa.libre,
    .punto.libre {
      background: #e3f1e6;
      color: #1f5130;
      border-color: #7bb58a;
    }

    .mesa.libre:hover {
      transform: translateY(-2px);
      box-shadow: var(--sombra);
    }

    .mesa.seleccionada,
    .punto.seleccionada {
      background: var(--acento);
      color: var(--cafe-oscuro);
      border-color: var(--cafe);
      box-shadow: 0 0 0 3px rgb(217 164 65 / 0.35);
    }

    .mesa.ocupada,
    .punto.ocupada {
      background: #ead3d3;
      color: #7a2e2e;
      border-color: #c98f8f;
      cursor: not-allowed;
      text-decoration: line-through;
    }

    .mesa.pequena,
    .punto.pequena {
      background: #e5e1dc;
      color: #7d746b;
      border-color: #c9c1b8;
      cursor: not-allowed;
      opacity: 0.75;
    }

    .campos {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .campos .ancho {
      grid-column: 1 / -1;
    }

    .resumen {
      padding: 0.75rem 1rem;
      border-radius: 10px;
      background: var(--crema);
    }

    .aviso {
      color: var(--texto-suave);
    }

    small.error,
    p.error {
      color: #9b2c2c;
    }

    .exito {
      color: var(--exito);
      font-weight: 600;
    }
  `,
})
export class ReservasPage implements OnInit {
  private api = inject(ApiService);
  protected sitio = inject(SitioService);

  protected readonly hoy = new Date().toLocaleDateString('sv-SE');

  protected fecha = signal(this.hoy);
  protected hora = signal('');
  protected personas = signal(2);

  protected zonas = signal<ZonaMesas[]>([]);
  protected cargandoMesas = signal(false);
  protected errorMesas = signal(false);
  protected seleccion = signal<{ mesa: Mesa; zona: string } | null>(null);

  protected enviando = signal(false);
  protected exito = signal('');
  protected error = signal('');

  protected form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    telefono: new FormControl('', { nonNullable: true }),
    comentario: new FormControl('', { nonNullable: true }),
  });

  // Último día reservable (configuracion.reserva_dias_max)
  protected fechaMax = computed(() => {
    const d = new Date();
    d.setDate(d.getDate() + (Number(this.sitio.c('reserva_dias_max')) || 60));
    return d.toLocaleDateString('sv-SE');
  });

  // 1..reserva_personas_max
  protected opcionesPersonas = computed(() =>
    Array.from({ length: Number(this.sitio.c('reserva_personas_max')) || 12 }, (_, i) => i + 1)
  );

  // Horarios entre apertura y cierre cada `intervalo` minutos; si es hoy, solo los futuros
  protected horas = computed(() => {
    const aMin = (h: string) => {
      const [hh, mm] = h.split(':').map(Number);
      return hh * 60 + mm;
    };
    const apertura = aMin(this.sitio.c('reserva_hora_apertura') || '08:00');
    const cierre = aMin(this.sitio.c('reserva_hora_cierre') || '20:00');
    const paso = Number(this.sitio.c('reserva_intervalo_min')) || 30;
    const ahora = new Date();
    const minimo = this.fecha() === this.hoy ? ahora.getHours() * 60 + ahora.getMinutes() + 1 : 0;

    const lista: string[] = [];
    for (let m = apertura; m <= cierre; m += paso) {
      if (m >= minimo) {
        lista.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
      }
    }
    return lista;
  });

  ngOnInit(): void {
    this.ajustarHora();
  }

  cambiarFecha(valor: string): void {
    if (!valor) return;
    this.fecha.set(valor);
    this.ajustarHora();
  }

  cambiarHora(valor: string): void {
    this.hora.set(valor);
    this.cargarMesas();
  }

  cambiarPersonas(valor: number): void {
    this.personas.set(valor);
    const s = this.seleccion();
    if (s && s.mesa.capacidad < valor) this.seleccion.set(null);
  }

  // Mantiene la hora elegida si sigue disponible; si no, toma la primera libre
  private ajustarHora(): void {
    const lista = this.horas();
    if (!lista.includes(this.hora())) this.hora.set(lista[0] ?? '');
    this.cargarMesas();
  }

  private cargarMesas(): void {
    this.seleccion.set(null);
    if (!this.hora()) {
      this.zonas.set([]);
      return;
    }
    this.cargandoMesas.set(true);
    this.errorMesas.set(false);
    this.api.mesas(this.fecha(), this.hora()).subscribe({
      next: (zonas) => {
        this.zonas.set(zonas);
        this.cargandoMesas.set(false);
      },
      error: () => {
        this.errorMesas.set(true);
        this.cargandoMesas.set(false);
      },
    });
  }

  protected estado(mesa: Mesa): EstadoMesa {
    if (this.seleccion()?.mesa.id === mesa.id) return 'seleccionada';
    if (mesa.disponible === false) return 'ocupada';
    if (mesa.capacidad < this.personas()) return 'pequena';
    return 'libre';
  }

  elegir(mesa: Mesa, zona: ZonaMesas): void {
    if (this.estado(mesa) === 'libre') {
      this.seleccion.set({ mesa, zona: zona.nombre });
      this.exito.set('');
      this.error.set('');
    }
  }

  reservar(): void {
    this.exito.set('');
    this.error.set('');
    const s = this.seleccion();

    if (!s) {
      this.error.set(this.sitio.t('reserva_sin_mesa'));
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.api
      .reservar({
        mesaId: s.mesa.id,
        fecha: this.fecha(),
        hora: this.hora(),
        personas: this.personas(),
        ...this.form.getRawValue(),
      })
      .subscribe({
        next: (r) => {
          this.exito.set(`${r.mensaje} ${this.sitio.t('reserva_mesa')} ${s.mesa.codigo} · ${this.fecha()} · ${this.hora()}`);
          this.form.reset();
          this.enviando.set(false);
          this.cargarMesas();
        },
        error: (err) => {
          const codigo = err?.error?.codigo;
          this.error.set((codigo && this.sitio.t(`reserva_error_${codigo}`)) || this.sitio.t('reserva_error'));
          this.enviando.set(false);
          if (codigo === 'ocupada') this.cargarMesas();
        },
      });
  }
}

import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { SitioService } from '../core/sitio.service';
import { EncabezadoComponent } from '../components/encabezado.component';

@Component({
  selector: 'app-contactos',
  imports: [ReactiveFormsModule, EncabezadoComponent],
  template: `
    <section class="contenedor seccion">
      <app-encabezado ruta="contactos" />

      <div class="dos-columnas">
        <form class="tarjeta formulario" [formGroup]="form" (ngSubmit)="enviar()" novalidate>
          <label>
            {{ sitio.t('form_nombre') }}
            <input type="text" formControlName="nombre" autocomplete="name" />
          </label>
          @if (form.controls.nombre.touched && form.controls.nombre.invalid) {
            <small class="error">{{ sitio.t('form_error_nombre') }}</small>
          }

          <label>
            {{ sitio.t('form_email') }}
            <input type="email" formControlName="email" autocomplete="email" />
          </label>
          @if (form.controls.email.touched && form.controls.email.invalid) {
            <small class="error">{{ sitio.t('form_error_email') }}</small>
          }

          <label>
            {{ sitio.t('form_telefono') }}
            <input type="tel" formControlName="telefono" autocomplete="tel" />
          </label>

          <label>
            {{ sitio.t('form_asunto') }}
            <input type="text" formControlName="asunto" />
          </label>

          <label>
            {{ sitio.t('form_mensaje') }}
            <textarea rows="5" formControlName="mensaje"></textarea>
          </label>
          @if (form.controls.mensaje.touched && form.controls.mensaje.invalid) {
            <small class="error">{{ sitio.t('form_error_mensaje') }}</small>
          }

          <button class="boton" type="submit" [disabled]="enviando()">
            {{ enviando() ? sitio.t('form_enviando') : sitio.t('form_boton') }}
          </button>

          @if (exito()) {
            <p class="exito" role="status">{{ exito() }}</p>
          }
          @if (errorEnvio()) {
            <p class="error" role="alert">{{ errorEnvio() }}</p>
          }
        </form>

        <aside class="tarjeta">
          <h2>{{ sitio.t('contacto_aside_titulo') }}</h2>
          <p>{{ sitio.t('contacto_aside_texto') }}</p>
          <p><strong>{{ sitio.t('etiqueta_direccion') }}:</strong> {{ sitio.c('direccion') }}</p>
          <p><strong>{{ sitio.t('etiqueta_telefono') }}:</strong> {{ sitio.c('telefono') }}</p>
          <p><strong>{{ sitio.t('etiqueta_email') }}:</strong> {{ sitio.c('email') }}</p>
        </aside>
      </div>
    </section>
  `,
  styles: `
    .dos-columnas {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    .formulario {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      font-weight: 600;
      margin-top: 0.4rem;
    }

    input,
    textarea {
      font: inherit;
      padding: 0.6rem 0.75rem;
      border-radius: 10px;
      border: 1px solid var(--borde);
      background: var(--blanco);
      color: var(--texto);
    }

    .formulario .boton {
      margin-top: 0.75rem;
      align-self: flex-start;
    }

    small.error,
    p.error {
      color: #9b2c2c;
    }

    .exito {
      color: var(--exito);
      font-weight: 600;
    }

    aside h2 {
      font-size: 1.3rem;
    }

    @media (max-width: 800px) {
      .dos-columnas {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class ContactosPage {
  private api = inject(ApiService);
  protected sitio = inject(SitioService);

  protected form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    telefono: new FormControl('', { nonNullable: true }),
    asunto: new FormControl('', { nonNullable: true }),
    mensaje: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] }),
  });

  protected enviando = signal(false);
  protected exito = signal('');
  protected errorEnvio = signal('');

  enviar(): void {
    this.exito.set('');
    this.errorEnvio.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.api.enviarContacto(this.form.getRawValue()).subscribe({
      next: (respuesta) => {
        this.exito.set(respuesta.mensaje);
        this.form.reset();
        this.enviando.set(false);
      },
      error: () => {
        this.errorEnvio.set(this.sitio.t('form_error_envio'));
        this.enviando.set(false);
      },
    });
  }
}

import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../core/api.service';

@Component({
  selector: 'app-contactos',
  imports: [ReactiveFormsModule],
  template: `
    <section class="contenedor seccion">
      <div class="encabezado-seccion">
        <h1>Contactos</h1>
        <p>¿Tienes una consulta, quieres reservar un evento o tienes una sugerencia? Escríbenos.</p>
      </div>

      <div class="dos-columnas">
        <form class="tarjeta formulario" [formGroup]="form" (ngSubmit)="enviar()" novalidate>
          <label>
            Nombre *
            <input type="text" formControlName="nombre" autocomplete="name" />
          </label>
          @if (form.controls.nombre.touched && form.controls.nombre.invalid) {
            <small class="error">Ingresa tu nombre (mínimo 2 caracteres).</small>
          }

          <label>
            Correo electrónico *
            <input type="email" formControlName="email" autocomplete="email" />
          </label>
          @if (form.controls.email.touched && form.controls.email.invalid) {
            <small class="error">Ingresa un correo válido.</small>
          }

          <label>
            Teléfono
            <input type="tel" formControlName="telefono" autocomplete="tel" />
          </label>

          <label>
            Asunto
            <input type="text" formControlName="asunto" />
          </label>

          <label>
            Mensaje *
            <textarea rows="5" formControlName="mensaje"></textarea>
          </label>
          @if (form.controls.mensaje.touched && form.controls.mensaje.invalid) {
            <small class="error">El mensaje debe tener al menos 5 caracteres.</small>
          }

          <button class="boton" type="submit" [disabled]="enviando()">
            {{ enviando() ? 'Enviando…' : 'Enviar mensaje' }}
          </button>

          @if (exito()) {
            <p class="exito" role="status">{{ exito() }}</p>
          }
          @if (errorEnvio()) {
            <p class="error" role="alert">{{ errorEnvio() }}</p>
          }
        </form>

        <aside class="tarjeta">
          <h2>También puedes visitarnos</h2>
          <p>Te esperamos con café recién preparado. Si llegas con un grupo, avísanos y reservamos tu mesa.</p>
          <p>Para pedidos especiales o eventos privados, escríbenos con anticipación.</p>
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
      color: #276749;
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
      error: (err) => {
        this.errorEnvio.set(err?.error?.detalles?.join(' ') || err?.error?.error || 'No se pudo enviar el mensaje. Intenta más tarde.');
        this.enviando.set(false);
      },
    });
  }
}

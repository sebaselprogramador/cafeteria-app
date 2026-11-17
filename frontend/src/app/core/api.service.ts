import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Configuracion,
  ContactoPayload,
  Especialidad,
  GrupoPrecios,
  Inicio,
  Nosotros,
  Servicio,
} from './models';

// Único punto de acceso del frontend a datos: todo sale de la API Node.js.
// En desarrollo, /api se redirige al backend con proxy.conf.json.
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly base = '/api';

  inicio(): Observable<Inicio> {
    return this.http.get<Inicio>(`${this.base}/inicio`);
  }

  configuracion(): Observable<Configuracion> {
    return this.http.get<Configuracion>(`${this.base}/configuracion`);
  }

  servicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.base}/servicios`);
  }

  especialidades(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${this.base}/especialidades`);
  }

  nosotros(): Observable<Nosotros> {
    return this.http.get<Nosotros>(`${this.base}/nosotros`);
  }

  precios(): Observable<GrupoPrecios[]> {
    return this.http.get<GrupoPrecios[]>(`${this.base}/precios`);
  }

  enviarContacto(datos: ContactoPayload): Observable<{ id: number; mensaje: string }> {
    return this.http.post<{ id: number; mensaje: string }>(`${this.base}/contactos`, datos);
  }

  enviarChat(sesionId: string, mensaje: string): Observable<{ respuesta: string; modelo: string }> {
    return this.http.post<{ respuesta: string; modelo: string }>(`${this.base}/chatbot`, {
      sesionId,
      mensaje,
    });
  }

  estadoChat(): Observable<{ disponible: boolean; modeloListo?: boolean; modelo: string }> {
    return this.http.get<{ disponible: boolean; modeloListo?: boolean; modelo: string }>(
      `${this.base}/chatbot/estado`
    );
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, timeout} from 'rxjs/operators';
import { environment } from 'src/environments/environment';



/*
  Generated class for the ApiRestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiRestProvider {

  contentHeaders = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(public http: HttpClient) {
  }

  /**
   * IMplementación del método post de http para consumo de servicios con autenticación
   * @param path url a consumir
   * @param body información a enviar en body
   */
  async post(path,body): Promise<any> {
    this.configBasicHeader();
    return this.http
      .post(`${environment.serveUrl}${path}`,body,{ headers: this.contentHeaders.headers })
      .pipe(    
        timeout(10000),     
        catchError(this.handleError)
      ).toPromise()
      .then(response => {
        return response;
      })
      .catch(this.handleError);
  }

  /**
   * Configuración de Headers para servicio que no necessitan autenticación
   */
  async configBasicHeader() {
    this.contentHeaders.headers = await new HttpHeaders({});
    this.contentHeaders.headers = await this.contentHeaders.headers.append('Content-Type', 'application/json');
  }
  /**
   * Método encargado del reporte de errores en el consumo de servicios
   * @param error erorr a reportar
   */
  private handleError(error: any): Promise<any> {
    // return Promise.reject(error.message || error);
    return Promise.reject(error);
  }


}

import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiURL: string = environment.apiURL;
  apiVersion: string = environment.apiVersion

  constructor(private httpClient: HttpClient) { }

  get(resource: string, id?: any): Observable<any> {

    let endpoint = resource
    if (id) {
      endpoint = resource + '/' + id
    }

    let params = new HttpParams()

    return this.httpClient.get(this.apiURL + this.apiVersion + '/' + endpoint, { params })
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }

  getAll(resource: string, params?: any, auth: boolean = true): Observable<any> {

    let search = new URLSearchParams();

    for (let k in params) {
      if (k == 'fields' || k == 'filters') {
        search.set(k, JSON.stringify(params[k]));
      } else {
        search.set(k, params[k]);
      }
    }

    return this.httpClient.get(this.apiURL + this.apiVersion + '/' + resource, { params })
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }


  /**
   * 
   * @param resource 
   * @param reqParams i.e. body = { email: 'data@data.com' }
   */
  post(resource: string, reqParams?: any, headers?: HttpHeaders) {

    let params = new HttpParams()

    return this.httpClient.post(this.apiURL + this.apiVersion + '/' + resource, reqParams, { params })
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }

  put(resource: any, id?: number, reqParams?: any) {

    let params = new HttpParams()

    if (id) {
      resource = resource + '/' + id
    }

    return this.httpClient.put(this.apiURL + this.apiVersion + '/' + resource, reqParams, { params })
      .pipe(
        retry(1),
        catchError(this.handleError)
      )

  }

  patch(resource: any, id: number, params) {

  }

  delete(resource: any, id: number, params) {

  }

  handleError(error) {
    let errorMessage = '';
    // debugger
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      return throwError(error);
    }
    
    console.error(errorMessage);
    console.log('errorstatus', error.status)
    
    return throwError(errorMessage);
  }
}

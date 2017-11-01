import { Platform } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';


/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  url: string = 'http://138.219.42.157:8080/api/e4132f28-bb2b-4fc7-9da8-0cca9de8bfa3';

  constructor(public http: Http, private transfer: FileTransfer, private file: File,
    private device: Device, private platform: Platform) {
  }

  get(endpoint: string, params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }


    // Support easy query params for GET requests
    if (params) {
      let p = new URLSearchParams();
      for (let k in params) {
        p.set(k, params[k]);
      }
      // Set the search field if we have params and don't already have
      // a search field set in options.
      options.search = !options.search && p || options.search;
    }

    return this.http.get(this.url + '/' + endpoint, options);
  }

  post(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.post(this.url + '/' + endpoint, body, options);
  }

  put(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + '/' + endpoint, body, options);
  }

  delete(endpoint: string, options?: RequestOptions) {
    return this.http.delete(this.url + '/' + endpoint, options);
  }

  patch(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + '/' + endpoint, body, options);
  }

  estadisticas(url) {

    return new Promise((reseolve, reject) => {
      console.log(typeof this.device.uuid);
      if ((this.platform.is('android') || this.platform.is('ios')) && this.device.uuid) {

        url += "/" + this.device.uuid;


        this.http.get(url).subscribe((res) => {
          reseolve(res.json());
        }, (err) => {
          reject(err)
        });


      } else {
        reject(new Error('No es el dispositivo correcto o no tiene uuid'));
      }


    });
  }

  download(url, name, extension) {

    const fileTransfer: FileTransferObject = this.transfer.create();
    this.file.checkFile(this.file.dataDirectory, name + '.' + extension).then((exist) => {
      if (!exist) {
        fileTransfer.download(url, this.file.dataDirectory + name + '.' + extension).then((entry) => {
          console.log('download complete: ' + entry.toURL());
        }, (error) => {
          // handle error
        });
      }
    }).catch((err) => {
      console.log(err);
      fileTransfer.download(url, this.file.dataDirectory + name + '.' + extension).then((entry) => {
        console.log('download complete: ' + entry.toURL());
      }, (error) => {
        // handle error
      });
    })

  }

  checkFile(name, extension) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    return this.file.checkFile(this.file.dataDirectory, name + '.' + extension);

  }
  async getFile(name, extension) {

    let rootDir = await this.file.resolveDirectoryUrl(this.file.dataDirectory);

    return this.file.getFile(rootDir, name + '.' + extension, { create: false });



  }
}
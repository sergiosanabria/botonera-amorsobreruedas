import { LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the MsgProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MsgProvider {

  loader: any;
  constructor(public http: Http,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController


  ) {
    console.log('Hello MsgProvider Provider');
  }


  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  presentLoading(msg) {
    this.loader = this.loadingCtrl.create({
      content: msg
    });
    this.loader.present();
  }

  dismissLoading() {
    if (this.loader) {
      this.loader.dismiss();
    }
  }

  presentConfirm(title, message, sucessFn, cancelFn?) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            if (typeof cancelFn !== "undefined") {
              cancelFn();
            }
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            sucessFn();
            console.log('Aceptar clicked');
          }
        }
      ]
    });
    alert.present();
  }
}

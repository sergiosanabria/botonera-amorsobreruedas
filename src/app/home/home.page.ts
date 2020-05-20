import { LoadingService } from './../services/loading.service';
import { ApiService } from './../services/api.service';
import { Platform, ToastController, AlertController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PlayerService } from '../services/player.service';
import { Plugins } from '@capacitor/core';
const { Device, Share } = Plugins;

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';





@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers: [FileTransfer, File]
})
export class HomePage implements OnInit {

  audiosShow: any;
  audios: any;
  audio: any;
  searchText = "";
  enabledSearch = false;
  errorInternet = false;
  favoritos = [];
  device: any;

  @ViewChild('searchbar') searchbar: any;


  constructor(private platform: Platform, private api: ApiService, private storage: Storage, public toastController: ToastController,
    public alertController: AlertController, public loadingService: LoadingService, private player: PlayerService, private transfer: FileTransfer,
    private file: File) { }

  async ngOnInit() {
    const info = await Device.getInfo();
    console.log(info);
    this.device = info;

    this.cargarAudios();

    if (this.platform.is('android') || this.platform.is('ios')) {

      this.storage.get('favoritos')
        .then((favs) => {

          this.favoritos = favs;
          this.checkFavoritos();

        })
        .catch((err) => {
          console.log(err);
        });

    }
  }

  checkNotificaciones() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.api.get('notifications/' + this.device.uuid).subscribe((res) => {
        let msgs = res.json();

        // Para poder probar nomas
        // msgs = [
        //   {
        //     id: 1,
        //     created_at: "2017-11-08T16:42:48+00:00",
        //     titulo: "Ayyy Roooliii!!!",
        //     // subtitulo: "subtitulo",
        //     texto: "Subimos nuevos audios de Rolando y todos los personajes de Amor sobre ruedes"
        //   }
        // ];

        for (let msg of msgs) {

          this.presentAlert(msg.titulo, msg.subtitulo, msg.texto, ['Listo listo, mató mató'])
        }


      }, (err) => {
        console.log(err);
      })
    }

  }

  cargarAudios(refresher?) {
    this.loadingService.present('Cargando los audios de Roly');
    this.api.get("archivos").subscribe((res) => {
      this.errorInternet = false;
      this.audios = res.json();

      this.storage.set('audios', this.audios);

      this.audiosShow = res.json();

      this.checkNotificaciones();

      if (this.platform.is('android') || this.platform.is('ios')) {

        this.storage.get('favoritos')
          .then((favs) => {

            this.favoritos = favs;
            this.checkFavoritos();
            this.loadingService.dismiss();

            if (refresher) {
              refresher.complete();
            }
          })
          .catch((err) => {
            console.log(err);
            this.loadingService.dismiss();
            if (refresher) {
              refresher.complete();
            }
          });

      }

    }, (err) => {
      console.log(err);

      this.errorInternet = true;

      if (this.platform.is('android') || this.platform.is('ios')) {
        this.storage.get('audios').then((audios) => {
          if (audios) {
            this.audios = audios;

            this.audiosShow = [].concat(audios);

            this.storage.get('favoritos')
              .then((favs) => {

                this.favoritos = favs;
                this.checkFavoritos();
                this.loadingService.dismiss();
                if (refresher) {
                  refresher.complete();
                }
              })
              .catch((err) => {
                console.log(err);
                this.loadingService.dismiss();
                if (refresher) {
                  refresher.complete();
                }
              });

          }
        });

      }

    });
  }

  play(a) {

    if (a.played) {
      this.pause(a);
    } else {
      this.player.play(a, this.audio);
      this.audio = a;
    }
  }

  pause(a) {

    this.player.pause(a);
  }

  async download(a) {
    // this.api.download(a.url, a.nombre, 'mp3');

    let url = a.url
    let name = a.nombre
    let extension = 'mp3'

    const fileTransfer: FileTransferObject = this.transfer.create();
    this.file.checkDir(this.file.dataDirectory, name + '.' + extension).then((exist) => {
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

  async share(a) {
    this.loadingService.present('Compartiendo Rolando');
    let shareRet = await Share.share({
      title: 'Botonera de Amor sobre ruedas',
      text: a.nombre,
      url: a.url,
      dialogTitle: 'Angaaa...'
    }).then((data) => {
      console.log('then', data)
    })

    Share.addListener('success', (data) => { console.log('success', data) })




    // this.socialSharing.share(a.nombre, 'Botonera de Amor sobre ruedas', a.url).then(() => {
    //   // Success!
    //   this.loadingService.dismiss();

    //   this.api.post('estadisticas', a.links._shared).subscribe((res) => {
    //     console.log(res)
    //   }, (err) => {
    //     console.log(err);
    //   });

    // }).catch(() => {
    //   // Error!
    //   this.loadingService.dismiss();
    // });

  }

  agregarQuitarFavorito(a) {
    if (a.favorito) {
      this.popItem(a, this.favoritos);
      a.favorito = false;
      this.presentToast('Quitado de favoritos');

      this.api.post('estadisticas', a.links._unfav).subscribe((res) => {
        console.log(res)
      }, (err) => {
        console.log(err);
      });

    } else {
      let obj = Object.assign({}, a);

      obj.played = false;

      this.favoritos.push(obj);

      this.api.post('estadisticas', a.links._fav).subscribe((res) => {
        console.log(res)
      }, (err) => {
        console.log(err);
      });

      a.favorito = true;

      this.presentToast('Agregado a favoritos');
    }
    this.storage.set('favoritos', this.favoritos).catch((err) => {
      console.log(err);
    });
  }

  buscarAudios() {

    if (this.searchText) {
      this.audiosShow = [];
      for (let a of this.audios) {
        let nombre = a.nombre.toLowerCase();
        let text = this.searchText.toLowerCase();

        if (nombre.indexOf(text) > -1) {
          this.audiosShow.push(a);
        }
      }
    } else {
      this.audiosShow = [];
      this.audiosShow = [].concat(this.audios);
    }

    this.checkFavoritos();
  }

  showSearch(): void {
    this.enabledSearch = true;
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 150);
  }

  hideSearch() {
    this.enabledSearch = false;
    this.audiosShow = [];
    this.audiosShow = [].concat(this.audios);

    this.checkFavoritos();
  }

  checkFavoritos() {
    if (this.favoritos && this.favoritos.length > 0) {
      for (let a of this.audiosShow) {
        if (this.idInArray(a.id, this.favoritos)) {
          a.favorito = true;
        } else {
          a.favorito = false;
        }
      }
    } else {
      this.favoritos = [];
    }
  }

  popItem(item, array) {
    for (let k in array) {
      if (item.id == array[k].id) {
        array.splice(k, 1);
      }
    }

    return array;
  }

  idInArray(id, array) {
    if (typeof array != "undefined" && array.length > 0) {
      for (let f of array) {
        if (f.id == id) {
          return true;
        }
      }
    }
    return false;
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async presentAlert(title, subTitle, message, buttons) {
    const alert = await this.alertController.create({
      header: title,
      subHeader: subTitle,
      message: message,
      buttons: buttons
    });

    await alert.present();
  }



}

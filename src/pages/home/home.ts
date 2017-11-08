import { Device } from '@ionic-native/device';
import { PlayerProvider } from './../../providers/player/player';
import { MsgProvider } from './../../providers/msg/msg';
import { Api } from './../../providers/api/api';
import { Component, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NativeStorage } from '@ionic-native/native-storage';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  audiosShow: any;
  audios: any;
  audio: any;
  searchText = "";
  enabledSearch = false;
  errorInternet = false;

  @ViewChild('searchbar') searchbar: any;

  favoritos = [];

  constructor(public navCtrl: NavController, private api: Api, private platform: Platform, private player: PlayerProvider,
    private socialSharing: SocialSharing, private nativeStorage: NativeStorage, private msg: MsgProvider, private device: Device) {

  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.cargarAudios();

    }, 150);
  }

  ionViewDidEnter() {
    setTimeout(() => {
      if (this.platform.is('android') || this.platform.is('ios')) {

        this.nativeStorage.getItem('favoritos')
          .then((favs) => {

            this.favoritos = favs;
            this.checkFavoritos();

          })
          .catch((err) => {
            console.log(err);
          });

      }
    }, 350);
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
          let alert = this.msg.alertCtrl.create({
            title: msg.titulo,
            subTitle: msg.subtitulo,
            message: msg.texto,
            buttons: ['Listo listo, mató mató']
          });
          alert.present();
        }


      }, (err) => {
        console.log(err);
      })
    }

  }

  cargarAudios(refresher?) {
    this.msg.presentLoading('Cargando los audios de Roly');
    this.api.get("audios").subscribe((res) => {
      this.errorInternet = false;
      this.audios = res.json();

      this.nativeStorage.setItem('audios', this.audios);

      this.audiosShow = res.json();

      this.checkNotificaciones();

      if (this.platform.is('android') || this.platform.is('ios')) {

        this.nativeStorage.getItem('favoritos')
          .then((favs) => {

            this.favoritos = favs;
            this.checkFavoritos();
            this.msg.dismissLoading();
            
            if (refresher) {
              refresher.complete();
            }
          })
          .catch((err) => {
            console.log(err);
            this.msg.dismissLoading();
            if (refresher) {
              refresher.complete();
            }
          });

      }

    }, (err) => {
      console.log(err);

      this.errorInternet = true;

      if (this.platform.is('android') || this.platform.is('ios')) {
        this.nativeStorage.getItem('audios').then((audios) => {
          if (audios) {
            this.audios = audios;

            this.audiosShow = [].concat(audios);

            this.nativeStorage.getItem('favoritos')
              .then((favs) => {

                this.favoritos = favs;
                this.checkFavoritos();
                this.msg.dismissLoading();
                if (refresher) {
                  refresher.complete();
                }
              })
              .catch((err) => {
                console.log(err);
                this.msg.dismissLoading();
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
    this.api.download(a.url, a.nombre, 'mp3');
  }

  share(a) {
    this.msg.presentLoading('Compartiendo Rolando');
    this.socialSharing.share(a.nombre, 'Botonera de Amor sobre ruedas', a.url).then(() => {
      // Success!
      this.msg.dismissLoading();

      this.api.estadisticas(a.links._shared).then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err);
      });

    }).catch(() => {
      // Error!
      this.msg.dismissLoading();
    });

  }

  agregarQuitarFavorito(a) {
    if (a.favorito) {
      this.popItem(a, this.favoritos);
      a.favorito = false;
      this.msg.presentToast('Quitado de favoritos');

      this.api.estadisticas(a.links._unfav).then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err);
      });

    } else {
      let obj = Object.assign({}, a);

      obj.played = false;

      this.favoritos.push(obj);

      this.api.estadisticas(a.links._fav).then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err);
      });

      a.favorito = true;

      this.msg.presentToast('Agregado a favoritos');
    }
    this.nativeStorage.setItem('favoritos', this.favoritos).catch((err) => {
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

}

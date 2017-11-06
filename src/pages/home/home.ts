import { PlayerProvider } from './../../providers/player/player';
import { MsgProvider } from './../../providers/msg/msg';
import { Api } from './../../providers/api/api';
import { Component } from '@angular/core';
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

  favoritos = [];

  constructor(public navCtrl: NavController, private api: Api, private platform: Platform, private player: PlayerProvider,
    private socialSharing: SocialSharing, private nativeStorage: NativeStorage, private msg: MsgProvider) {

  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.cargarAudios();
    }, 500);
  }

  cargarAudios(refresher?) {
    this.msg.presentLoading('Cargando los audios de Roly');
    this.api.get("audios").subscribe((res) => {
      this.audios = res.json();
      this.audiosShow = res.json();


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
      this.msg.dismissLoading();
      if (refresher) {
        refresher.complete();
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
      this.favoritos.push(Object.assign({}, a));

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

  showSearch() {
    this.enabledSearch = true;
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

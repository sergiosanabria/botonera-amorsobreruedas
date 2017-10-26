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

  favoritos = [];

  constructor(public navCtrl: NavController, private api: Api, private platform: Platform,
    private socialSharing: SocialSharing, private nativeStorage: NativeStorage, private msg: MsgProvider) {

  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.cargarAudios();
    }, 500);
  }

  cargarAudios() {
    this.api.get("audios.json").subscribe((res) => {
      this.audios = res.json();
      this.audiosShow = res.json();


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

    });
  }

  play(a) {
    this.audio = new Audio(a.url);

    this.audio.play();

    this.audio.addEventListener("ended", () => {
      a.played = false;

    });

    a.played = true;
  }

  pause(a) {

    this.audio.pause();

    a.played = false;
  }

  async download(a) {
    this.api.download(a.url, a.nombre, 'mp3');
  }

  share(a) {
    this.socialSharing.share(a.nombre, 'Botonera de Amor sobre ruedas', a.url);

  }

  agregarQuitarFavorito(a) {
    if (a.favorito) {
      this.popItem(a, this.favoritos);
      a.favorito = false;
      this.msg.presentToast('Quitado de favoritos');
    } else {
      this.favoritos.push(Object.assign({}, a));

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

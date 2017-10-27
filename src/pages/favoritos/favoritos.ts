import { PlayerProvider } from './../../providers/player/player';
import { MsgProvider } from './../../providers/msg/msg';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NativeStorage } from '@ionic-native/native-storage';
import { Api } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

/**
 * Generated class for the FavoritosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favoritos',
  templateUrl: 'favoritos.html',
})
export class FavoritosPage {

  favoritos: any;
  audio: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private msg: MsgProvider, private player: PlayerProvider,
    private socialSharing: SocialSharing, private api: Api, private platform: Platform, private nativeStorage: NativeStorage) {
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.cargarAudios();
    }, 500);
  }

  cargarAudios() {
    if (this.platform.is('android') || this.platform.is('ios')) {

      this.nativeStorage.getItem('favoritos')
        .then((favs) => {
          this.favoritos = favs;
        })
        .catch((err) => {
          console.log(err);
        });

    }
  }

  play(a) {

    this.player.play(a, this.audio);

    this.audio = a;
  }

  pause(a) {
    
    this.player.pause(a);
  }

  share(a) {
    this.msg.presentLoading('Compartiendo Roly');
    this.socialSharing.share(a.nombre, 'Botonera de Amor sobre ruedas', a.url).then(() => {
      // Success!
      this.msg.dismissLoading();
    }).catch(() => {
      // Error!
      this.msg.dismissLoading();
    });

  }

  quitarFavorito(a) {
    this.popItem(a, this.favoritos);
    this.msg.presentToast('Quitado de favoritos');
    this.nativeStorage.setItem('favoritos', this.favoritos).catch((err) => {
      console.log(err);
    });
  }

  popItem(item, array) {
    for (let k in array) {
      if (item.id == array[k].id) {
        array.splice(k, 1);
      }
    }

    return array;
  }

}

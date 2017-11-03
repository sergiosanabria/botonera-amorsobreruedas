import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AcercaDePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-acerca-de',
  templateUrl: 'acerca-de.html',
})
export class AcercaDePage {

  contributors = [
    {
      name: 'Sergio Sanabria',
      position: 'Desarrollo de app móvil',
      urlImg: 'https://pbs.twimg.com/profile_images/732548853879070720/zFzX7xd4_400x400.jpg',
      twitter: 'https://twitter.com/sergioLilos',
      mail: 'sergioj.sanabria@gmail.com',
    },
    {
      name: 'Matías Solís de la Torre',
      position: 'Desarrollo de app móvil',
      urlImg: 'https://pbs.twimg.com/profile_images/907355391511683072/TKxCcIgY_400x400.jpg',
      twitter: 'https://twitter.com/matudelatower',
      mail: 'matias.delatorre89@gmail.com',
    },
    {
      name: 'Raúl Neis',
      position: 'Desarrollo del back-end',
      urlImg: 'https://pbs.twimg.com/profile_images/869180906950545412/6oUsxvCX_400x400.jpg',
      twitter: 'https://twitter.com/raulneis',
      mail: 'raulneis@gmail.com',
    },
    {
      name: 'Nicolás Sabater',
      position: 'Diseño de logos y splash',
      urlImg: 'https://pbs.twimg.com/profile_images/631470734947303425/RNAWQueo_400x400.jpg',
      twitter: 'https://twitter.com/nicolassabater',
      mail: 'raulneis@gmail.com',
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AcercaDePage');
  }

  openUrl(url) {
    window.open(url, "_system")
  }

}

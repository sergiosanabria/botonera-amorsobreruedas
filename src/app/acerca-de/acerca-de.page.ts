import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.page.html',
  styleUrls: ['./acerca-de.page.scss'],
})
export class AcercaDePage implements OnInit {

  contributors = [
    {
      name: 'Sergio Sanabria',
      position: 'Desarrollo de app móvil',
      urlImg: 'https://pbs.twimg.com/profile_images/937045124529446914/Lci_B0LO_400x400.jpg',
      twitter: 'https://twitter.com/sergioLilos',
      mail: 'sergioj.sanabria@gmail.com',
    },
    {
      name: 'Matías Solís de la Torre',
      position: 'Desarrollo de app móvil',
      urlImg: 'https://pbs.twimg.com/profile_images/1072232127083765763/wPXft70-_400x400.jpg',
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

  constructor(private platform: Platform) { }

  ngOnInit() {
  }

  openUrl(url) {
    if (this.platform.is('ios')) {
      window.open(url, "_self");
    }

    if (this.platform.is('android')) {
      window.open(url, "_system");
    }
  }

}

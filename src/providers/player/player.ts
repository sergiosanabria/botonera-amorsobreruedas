import { Api } from './../api/api';
import { MsgProvider } from './../msg/msg';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the PlayerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PlayerProvider {

  audio: any;

  constructor(public http: Http, private msg: MsgProvider, private api: Api) {
    console.log('Hello PlayerProvider Provider');
  }

  play(a, prev?) {
    this.msg.presentLoading('Cargando audio');

    if (this.audio && prev) {
      this.pause(prev);
    }

    this.audio = new Audio(a.url);

    this.audio.play();

    this.audio.addEventListener("ended", () => {
      a.played = false;

    });

    this.audio.addEventListener("error", () => {
      a.played = false;
      this.msg.dismissLoading();
    });


    this.audio.addEventListener("abort", () => {
      a.played = false;
      this.msg.dismissLoading();
    });

    this.audio.addEventListener("playing", () => {
      a.played = true;
      this.api.estadisticas(a.links._play).then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err);
      });
      this.msg.dismissLoading();
    });

  }

  pause(a) {

    this.audio.pause();

    a.played = false;
  }

}

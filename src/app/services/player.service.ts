import { ApiService } from './api.service';
import { LoadingService } from './loading.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  audio: any;

  constructor(private loadingService: LoadingService, private api: ApiService) { }

  play(a, prev?) {
    this.loadingService.present('Cargando audio');

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
      this.loadingService.dismiss();
    });


    this.audio.addEventListener("abort", () => {
      a.played = false;
      this.loadingService.dismiss();
    });

    this.audio.addEventListener("playing", () => {
      a.played = true;
      this.api.post('estadisticas', a.links._play).subscribe((res) => {
        console.log(res)
      }, (err) => {
        console.log(err);
      });
      this.loadingService.dismiss();
    });

  }

  pause(a) {

    this.audio.pause();

    a.played = false;
  }
}

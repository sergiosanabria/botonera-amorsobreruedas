import { Device } from '@ionic-native/device';
import { AcercaDePageModule } from './../pages/acerca-de/acerca-de.module';
import { MsgProvider } from './../providers/msg/msg';
import { FavoritosPageModule } from './../pages/favoritos/favoritos.module';
import { NativeStorage } from '@ionic-native/native-storage';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Http, HttpModule } from '@angular/http';

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Api } from '../providers/api/api';
import { PlayerProvider } from '../providers/player/player';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FavoritosPageModule,
    AcercaDePageModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage
  ],
  providers: [
    StatusBar,
    FileTransfer,
    NativeStorage,
    File,
    SocialSharing,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Api,
    MsgProvider,
    PlayerProvider,
    Device
  ]
})
export class AppModule { }

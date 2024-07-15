import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FirstPageComponent } from './first-page/first-page.component';
import { BuzzComponent } from './buzz/buzz.component';
import { RoomComponent } from './room/room.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,         
    FirstPageComponent, 
    BuzzComponent, RoomComponent        
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent] 
})
export class AppModule { }

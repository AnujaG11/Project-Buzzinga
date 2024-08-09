import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css']
})
export class FirstPageComponent {
  audioPath = 'assets/Addict (Instrumental).mp3';
  constructor(private router: Router) {}
  

  navigateToApp() {
    this.router.navigate(['/buzz']);
    const audio = new Audio(this.audioPath);
    audio.play();
    audio.loop = true; 
    setTimeout(() => {
         audio.pause();
         audio.currentTime = 0;
       }, 10000);
  }
}

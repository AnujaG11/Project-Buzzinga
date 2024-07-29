import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome-modal',
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.css']
})
export class WelcomeModalComponent implements OnInit {

  @Input() userName !: string;
  showModal: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.showModal = true;
    setTimeout(() => {
      this.showModal = false;
    }, 4000);
  }

}

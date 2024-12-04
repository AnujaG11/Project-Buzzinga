import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-welcome-modal',
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.css']
})
export class WelcomeModalComponent implements OnInit {

  @Input() userName !: string;
  @Input() modalType: 'welcome' | 'roomSelection' = 'welcome'; // Add a new input for modal type
  @Output() roomTypeSelected = new EventEmitter<'single' | 'multiple'>();
  showModal: boolean = false;
 
  constructor() { }


  ngOnInit(): void {
    console.log("in init of modal");
    this.showModal = true;
    setTimeout(() => {
        this.showModal = false;
    }, 4000);
  }

  createRoom(roomType: 'single' | 'multiple') {
    this.roomTypeSelected.emit(roomType);
    this.showModal = false;
  }

  closeModalAction() {
    this.showModal = false;
  }

}

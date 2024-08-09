import { Component, OnInit, OnDestroy } from '@angular/core';
import { BuzzService } from '../buzz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-buzz',
  templateUrl: './buzz.component.html',
  styleUrls: ['./buzz.component.css']
})
export class BuzzComponent implements OnInit, OnDestroy {
  newMessage = '';
  messageList: string[] = [];
  users: { id: string; name: string; isHost: boolean }[] = [];
  buzzerEvents: any[] = [];
  userName = '';
  roomId = '';
  joinRoomId = ''; // For joining a room
  notifications: string[] = [];
  showWelcomeModal: boolean = false;
  showRoomSelectionModalFlag: boolean = false;
  setUserName: boolean = true;
  audioPath = 'https://notificationsounds.com/storage/sounds/file-sounds-881-look-this-is-what-i-was-talking-about.mp3';

  private subscriptions: Subscription[] = [];

  constructor(
    private buzzService: BuzzService, 
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Room ID from URL
    this.subscriptions.push(
      this.route.paramMap.subscribe(params => {
        const roomIdFromRoute = params.get('roomId');
        if (roomIdFromRoute) {
          this.roomId = roomIdFromRoute;
          this.joinRoom();
        }
      })
    );

    // Subscribe to message stream
    this.subscriptions.push(
      this.buzzService.getNewMessage().subscribe(message => {
        this.messageList.push(message);
      })
    );

    // Subscribe to users stream
    this.subscriptions.push(
      this.buzzService.getUsers().subscribe(users => {
        this.users = users;
      })
    );

    // Subscribe to buzzer events stream
    this.subscriptions.push(
      this.buzzService.getBuzzerEvents().subscribe(events => {
        this.buzzerEvents = events;
      })
    );

    // Subscribe to room changes
    this.subscriptions.push(
      this.buzzService.getRoom().subscribe(roomId => {
        if (roomId) {
          this.roomId = roomId;
          if (this.route.snapshot.paramMap.get('roomId') !== roomId) {
            this.router.navigate(['buzz', 'room', roomId]);
          }
        }
      })
    );

    // Subscribe to notifications
    this.subscriptions.push(
      this.buzzService.getNotifications().subscribe(notification => {
        if (!this.notifications.includes(notification)) {
          alert(notification);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.buzzService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }

  pressBuzzer() {
    this.buzzService.pressBuzzer();
  }

  setName() {
    if (this.userName.trim()) {
      this.buzzService.setName(this.userName);
      this.setUserName = true;
      this.showWelcomeModal = true;
      setTimeout(() => {
        this.setUserName = false;
        this.showWelcomeModal = false;
      }, 5000);
    } else if (this.newMessage.trim() == '') {
      alert('Username cannot be set to empty!');
    }
  }

  showRoomSelectionModal() {
    this.showRoomSelectionModalFlag = true;
    setTimeout(()=>{
      this.showRoomSelectionModalFlag = false;
    },2000);
  }

  createRoom(roomType: 'single' | 'multiple') {
    this.showRoomSelectionModalFlag = false;
    this.buzzService.createRoom(roomType);
  }

  joinRoom() {
    if (this.joinRoomId.trim()) {
      this.buzzService.joinRoom(this.joinRoomId).then(success => {
        if (success) {
          this.router.navigate(['buzz', 'room', this.joinRoomId]);
        } else {
          alert("Something went wrong!");
          console.error("Failed to join the room");
        }
      }).catch(err => {
        alert("Something went wrong!");
        console.error("Error joining room:", err);
      });
    } else if (this.joinRoomId.trim() == '') {
      alert("Please enter roomId!")
    }
  }
}






// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { BuzzService } from '../buzz.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-buzz',
//   templateUrl: './buzz.component.html',
//   styleUrls: ['./buzz.component.css']
// })

// export class BuzzComponent implements OnInit, OnDestroy {
//   newMessage = '';
//   messageList: string[] = [];
//   users: { id: string; name: string; isHost: boolean }[] = [];
//   buzzerEvents: any[] = [];
//   userName = '';
//   roomId = '';
//   joinRoomId = ''; // For joining a room
//   notifications: string[] = [];
//   showWelcomeModal: boolean = false;
//   setUserName : boolean = true;
//   audioPath =
//   'https://notificationsounds.com/storage/sounds/file-sounds-881-look-this-is-what-i-was-talking-about.mp3';


//   private subscriptions: Subscription[] = [];

//   constructor(
//     private buzzService: BuzzService, 
//     private route: ActivatedRoute,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     // Room ID from URL
//     this.subscriptions.push(
//       this.route.paramMap.subscribe(params => {
//         const roomIdFromRoute = params.get('roomId');
//         if (roomIdFromRoute) {
//           this.roomId = roomIdFromRoute;
//           this.joinRoom();
//         }
//       })
//     );

//     // Subscribe to message stream
//     this.subscriptions.push(
//       this.buzzService.getNewMessage().subscribe(message => {
//         this.messageList.push(message);
//       })
//     );

//     // Subscribe to users stream
//     this.subscriptions.push(
//       this.buzzService.getUsers().subscribe(users => {
//         this.users = users;
//       })
//     );

//     // Subscribe to buzzer events stream
//     this.subscriptions.push(
//       this.buzzService.getBuzzerEvents().subscribe(events => {
//         this.buzzerEvents = events;
//       })
//     );

//     // Subscribe to room changes
//     this.subscriptions.push(
//       this.buzzService.getRoom().subscribe(roomId => {
//         if (roomId) {
//           this.roomId = roomId;
//           if (this.route.snapshot.paramMap.get('roomId') !== roomId) {
//             this.router.navigate(['buzz', 'room', roomId]);
//           }
//         }
//       })
//     );

//     // Subscribe to notifications
//     this.subscriptions.push(
//       this.buzzService.getNotifications().subscribe(notification => {
//         if (!this.notifications.includes(notification)) {
//           alert(notification);
//         }
//       })
//     );
//   }

//   ngOnDestroy() {
//     // Clean up subscriptions
//     this.subscriptions.forEach(sub => sub.unsubscribe());
//   }

//   sendMessage() {
//     if (this.newMessage.trim()) {
//       this.buzzService.sendMessage(this.newMessage);
//       this.newMessage = '';
//     }
//   }

//   pressBuzzer() {
//     this.buzzService.pressBuzzer();
//   }

//   setName() {
//     if (this.userName.trim()) {
//       this.buzzService.setName(this.userName);
//       this.showWelcomeModal = true;
//       this.setUserName = true;
//       setTimeout(() => {
//         this.setUserName = false;
//         this.showWelcomeModal = false;
//       }, 1000);
//     }else if(this.newMessage.trim()==''){
//       alert('Username cannot be set to empty!');
//     }
//   }

//   createRoom(buzzMode: 'single' | 'multiple') {
//     this.buzzService.createRoom(buzzMode);
//   }

//   joinRoom() {
//     if (this.joinRoomId.trim()) {
//       this.buzzService.joinRoom(this.joinRoomId).then(success => {
//         if (success) {
//           this.router.navigate(['buzz', 'room', this.joinRoomId]);
//         } else {
//           alert("Something went wrong!");
//           console.error("Failed to join the room");
//         }
//       }).catch(err => {
//         alert("Something went wrong!");
//         console.error("Error joining room:", err);
//       });
//     }else if(this.joinRoomId.trim()==''){
//        alert("Please enter roomId!")
//     }
//   }
// }
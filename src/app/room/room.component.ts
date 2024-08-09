import { Component, OnInit } from '@angular/core';
import { BuzzService } from '../buzz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard'; // Ensure this import is correct


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  users: { id: string; name: string; isHost: boolean }[] = [];
  buzzerEvents: any[] = [];
  userName = '';
  roomId: string | null = null;
  notifications: string[] = [];
  audioPath =
  'https://notificationsounds.com/storage/sounds/file-sounds-881-look-this-is-what-i-was-talking-about.mp3';

  constructor(
    private buzzService: BuzzService,
    private route: ActivatedRoute,
    private router: Router,
   private clipboard: Clipboard
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.roomId = params.get('roomId');
      if (this.roomId) {
        this.buzzService.joinRoom(this.roomId).then(success => {
          if (!success) {
            console.log("Failed to join the room");
          }
        }).catch(err => {
          console.error(err);
        });
      }
    });

    this.buzzService.getUsers().subscribe((users: { id: string; name: string; isHost: boolean }[]) => {      
      this.users = users;
    });

    this.buzzService.getBuzzerEvents().subscribe((events: any[]) => {
      this.buzzerEvents = events;
    });

    this.buzzService.getNotifications().subscribe((notification: string) => {
      this.notifications.push(notification);
    });
  }

  pressBuzzer() {
    this.buzzService.pressBuzzer();
    const audio = new Audio(this.audioPath);
     audio.play();
     audio.loop = true; 
     setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
        }, 3000);
  }


  setName() {
    if (this.userName.trim()) {
      this.buzzService.setName(this.userName);
    }
  }

  copyRoomId() {
    if (this.roomId) {
      this.clipboard.copy(this.roomId);
      alert('Room ID copied to clipboard!');
    } else {
      alert('Room ID is not available.');
    }
  }

  leaveRoom() {
    const currentUser = this.users.find(user => user.id === this.buzzService.socket.id);
    if (currentUser?.isHost) {
      alert(`${currentUser.name}, you are the host. You cannot leave the room without closing it.`);
      if (confirm("Do you want to close the room?")) {
        this.buzzService.closeRoom();
        this.router.navigate(['buzz']);
      }
    } else {
      if (confirm("Do you really want to leave the room?")) {
        this.router.navigate(['buzz']);
        this.buzzService.leaveRoom().then(() => {
          this.router.navigate(['buzz']);
        })
      }
    }
  }
}

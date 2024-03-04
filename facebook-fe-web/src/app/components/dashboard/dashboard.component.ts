import { AfterViewInit, Component, NgModule, OnInit } from '@angular/core';
import {
  MatListModule,
  MatSelectionListChange,
} from '@angular/material/list';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Observable, catchError, tap } from 'rxjs';
import { RoomPaginateI } from '../../model/room.interface';
import { UserI } from '../../model/user.interface';
import { AuthService } from '../../services/auth-service/auth.service';
import { ChatService } from '../../services/chat-service/chat.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatRoomComponent } from '../chat-room/chat-room.component';
import { CommonModule } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ChatRoomComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDivider,
    MatListModule,
    MatCardModule,
    ReactiveFormsModule,
    MatPaginator,
    CommonModule,
    RouterModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  rooms$: Observable<RoomPaginateI> = this.chatService.getMyRooms().pipe(
    catchError(() => {
      return [];
    }),
    tap((rooms) => rooms)
  );
  selectedRoom = {};
  user: UserI = this.authService.getLoggedInUser();

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.chatService.emitPaginateRooms(10, 0);
  }

  ngAfterViewInit() {
    this.chatService.emitPaginateRooms(10, 0);
  }

  onSelectRoom(event: MatSelectionListChange) {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  onPaginateRooms(pageEvent: PageEvent) {
    this.chatService.emitPaginateRooms(pageEvent.pageSize, pageEvent.pageIndex);
  }
}

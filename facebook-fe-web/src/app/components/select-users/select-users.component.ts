import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { UserI } from '../../model/user.interface';
import { UserService } from '../../services/user-service/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-select-users',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatOptionModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    CommonModule,
  ],
  templateUrl: './select-users.component.html',
  styleUrls: ['./select-users.component.scss'],
})
export class SelectUsersComponent implements OnInit {
  @Input() users: UserI[] = [];
  @Output() addUser: EventEmitter<UserI> = new EventEmitter<UserI>();
  @Output() removeuser: EventEmitter<UserI> = new EventEmitter<UserI>();

  searchUsername = new FormControl();
  filteredUsers: UserI[] = [];
  selectedUser: UserI = {};

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.searchUsername.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((username: string) =>
          this.userService
            .findByUsername(username)
            .pipe(tap((users: UserI[]) => (this.filteredUsers = users)))
        )
      )
      .subscribe();
  }

  addUserToForm() {
    if (this.selectedUser) {
      console.log(this.selectedUser);
    }
    this.addUser.emit(this.selectedUser);
    this.filteredUsers = [];
    // this.selectedUser = {};
    // this.searchUsername.setValue(null);
  }

  removeUserFromForm(user: UserI) {
    this.removeuser.emit(user);
  }

  setSelectedUser(user: UserI) {
    this.selectedUser = user;
  }

  displayFn(user: UserI) {
    if (user) {
      return user.username ?? '';
    } else {
      return '';
    }
  }
}

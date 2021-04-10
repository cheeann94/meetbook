import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from './API.service';
import { Hub } from 'aws-amplify';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CreateEventDialogComponent } from './create-event-dialog/create-event-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'meetbook-amplify-app';

  public createForm: FormGroup = this.fb.group({});

  eventList: any[] = [];
  userName: string = '';
  viewEventList = false;
  readonly SIGN_IN = 'signIn';
  readonly SIGN_OUT = 'signOut';

  cols = [
    {field: 'name', header: 'Event Name'},
    {field: 'type', header: 'Type'},
    {field: 'venue', header: 'Venue'},
    {field: 'hostName', header: 'Host Name'},
    {field: 'startDt', header: 'Start Date'},
    {field: 'endDt', header: 'End Date'},
    {field: 'description', header: 'Description'}
  ];

  constructor(
    private api: APIService, 
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }

  async ngOnInit() {
    this.createForm = this.fb.group({
      'name': ['', Validators.required],
      'type': ['', Validators.required],
      'venue': ['', Validators.required],
      'hostName': ['', Validators.required],
      'startDt': ['', Validators.required],
      'endDt': ['', Validators.required],
      'description': ['']
    });

     /* fetch events when app loads */
     this.api.ListEvents().then(event => {
      if (event.items) {
        this.eventList = event.items;
      }
      console.log(this.eventList);
    });

    /* subscribe to new events being created */
    this.api.OnCreateEventListener.subscribe((event: any) => {
    const newEvent = event.value.data.onCreateEvent;
    if (this.eventList) {
      this.eventList = [newEvent, ...this.eventList];
    } else {
      this.eventList = [newEvent];
    }
  });

    /* listen for user sign in or sign out */
    Hub.listen('auth', (data) => {
      this.onAuthEvent(data);           
      console.log('A new auth event has happened: ', data.payload.data.username + ' has ' + data.payload.event);
    })
  }

  onAuthEvent(data: any) {
    if (this.SIGN_IN === data.payload.event) {
      this.userName = data.payload.data.username;
      this.viewEventList = true;
    } else if (this.SIGN_OUT === data.payload.event) {
      this.userName = '';
      this.viewEventList = false;
    }
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      hostName: this.userName
    }

    this.dialog.open(CreateEventDialogComponent, dialogConfig);
  }

}

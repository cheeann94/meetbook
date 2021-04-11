import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from './API.service';
import { Hub } from 'aws-amplify';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CreateEventDialogComponent } from './create-event-dialog/create-event-dialog.component';
import { ViewChild } from '@angular/core';

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

  @ViewChild('auth') input: any;

  constructor(
    private api: APIService, 
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private zone: NgZone
  ) { }

  async ngOnInit() {
    /* listen for user sign in or sign out */
    Hub.listen('auth', (data) => {         
      console.log('A new auth event has happened: ', data.payload.data.username + ' has ' + data.payload.event);

      if (this.SIGN_IN === data.payload.event) {
        console.log('payload data: ' + data.payload.data);
        this.userName = data.payload.data.username;
        this.zone.run(() => {
          this.router.navigate(['view-event-list', {userName: this.userName}]);
          this.input.nativeElement.remove();
        });
      } else if (this.SIGN_OUT === data.payload.event) {
        this.userName = '';
        this.zone.run(() => {
          this.router.navigate(['sign-in']);
        });
      }
    })
  }
}

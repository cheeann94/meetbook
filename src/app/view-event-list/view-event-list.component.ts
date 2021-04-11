import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from '../API.service';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CreateEventDialogComponent } from '../create-event-dialog/create-event-dialog.component';
import { NgZone } from '@angular/core';
import { Router, ActivatedRoute, ParamMap  } from '@angular/router';

@Component({
  selector: 'app-view-event-list',
  templateUrl: './view-event-list.component.html',
  styleUrls: ['./view-event-list.component.scss']
})
export class ViewEventListComponent implements OnInit {

  public createForm: FormGroup = this.fb.group({});

  eventList: any[] = [];
  userName: string | null = '';
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
    private dialog: MatDialog,
    private zone: NgZone,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log('loading view-event-list');
    this.createForm = this.fb.group({
      'name': ['', Validators.required],
      'type': ['', Validators.required],
      'venue': ['', Validators.required],
      'hostName': ['', Validators.required],
      'startDt': ['', Validators.required],
      'endDt': ['', Validators.required],
      'description': ['']
    });

     /* fetch events*/
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

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      console.log('params: ' + params.get('userName'));
      this.userName = params.get('userName');
    });
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

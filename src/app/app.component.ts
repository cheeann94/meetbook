import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from './API.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'meetbook-amplify-app';

  public createForm: FormGroup = this.fb.group({});

  eventList: any[] = [];

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
    private fb: FormBuilder
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
  }

  public onCreate(event: any) {
    this.api.CreateEvent(event).then(event => {
      console.log('item created!');
      this.createForm.reset();
    })
    .catch(e => {
      console.log('error creating event...', e);
    });
  }
}

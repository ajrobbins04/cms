import { Component, OnInit } from '@angular/core';
import { Contact } from './contact.model';

@Component({
  selector: 'cms-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})

export class ContactsComponent implements OnInit {

  // will be sent by ContactListsComponent to
  // be passed on to ContactDetailsComponent
  selectedContact: Contact;
  
  constructor() {}
  ngOnInit(): void {
  }
}

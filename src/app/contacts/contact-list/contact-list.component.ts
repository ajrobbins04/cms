import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: [
    '../../app.component.css',    
    './contact-list.component.css'
  ]
})

export class ContactListComponent implements OnInit {

  // ContactsComponent will listen for this event to receive 
  // selectedContact to pass it on to ContactDetailsComponent
  @Output() selectedContactEvent = new EventEmitter<Contact>();

  contacts: Contact[] = [
    new Contact('1', 'R. Kent Jackson', 'jacksonk@byui.edu', '208-496-3771', '../../assets/images/jacksonk.jpg', null),
    new Contact('2', 'Rex Barzee', 'barzeer@byui.edu', '208-496-3768', '../../assets/images/barzeer.jpg', null),
  ];
  constructor() {}
  ngOnInit() {}

  // called when its child component emits an event to 
  // retrieve the contact and then emit it to its own parent
  onSelectedContact(contact: Contact) {
    this.selectedContactEvent.emit(contact);
  }
}

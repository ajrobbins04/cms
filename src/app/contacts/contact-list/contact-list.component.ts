import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  // The @Output decorator allows the component to emit events w/data to the parent component
  @Output() selectedContactEvent = new EventEmitter<Contact>();

  contacts: Contact[] = [
    new Contact('1', 'R. Kent Jackson', 'jacksonk@byui.edu', '208-496-3771', '../../assets/images/jacksonk.jpg', null),
    new Contact('2', 'Rex Barzee', 'barzeer@byui.edu', '208-496-3768', '../../assets/images/barzeer.jpg', null),
  ];
  constructor() {}
  ngOnInit() {}

  // This method is called when a contact is selected in the contact-item component
  onSelectedContact(contact: Contact) {
    this.selectedContactEvent.emit(contact);
  }
}
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';   
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',   
  styleUrls: [
    '../../app.component.css',
    './contact-list.component.css'
  ]
})
export class ContactListComponent implements OnInit {

  contacts: Contact[] = [];
  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.contacts = this.contactService
    .getContacts()
    .filter(contact => !contact.group);
  }

  // This method is called when a contact is selected in the contact-item component
  onSelectedContact(contact: Contact) {
    this.contactService.contactSelectedEvent.emit(contact);
  }
}
import { Component, OnInit, Injectable} from '@angular/core';
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
    this.contacts = this.contactService.getContacts();

  }

  // called when its child component emits an event to 
  // retrieve the contact and then emit it to its own parent
  onSelectedContact(contact: Contact) {
    this.contactService.contactSelectedEvent.emit(contact);
  }
}

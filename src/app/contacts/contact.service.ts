import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();

  contacts: Contact[] = [];
  constructor() { 
    this.contacts = MOCKCONTACTS;
  }
  getContacts(): Contact[] {
    return this.contacts.slice(); // Return a copy of the contacts array
  }

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact; // Return the contact with the matching ID
      }
    }
    return null; // Return null if no contact with the given ID is found
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    this.contactChangedEvent.emit(this.contacts.slice());
  }
}

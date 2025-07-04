import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();

  maxContactId: number;
  contacts: Contact[] = [];

  constructor() { 
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;
    for (let contact of this.contacts) {
        const currentId = parseInt(contact.id);
        if (currentId > maxId) {
            maxId = currentId;
        }
    }

    return maxId;
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

  getDepartmentContacts(): Contact[] {
    return this.contacts.filter(contact =>
      contact.group && contact.email.trim() === '' && contact.phone.trim() === ''
    );
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }
    // Increment to ensure the new contact has a unique ID
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();

    this.contacts.push(newContact);

    // Emit a copy of the updated contacts list
    const contactsListClone = this.getContacts();
    this.contactListChangedEvent.next(contactsListClone);
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
        return;
    }
    // Find the index (position) of the original contact in the contacts array
    const pos = this.contacts.findIndex(c => c.id === originalContact.id);
    if (pos < 0) {
      return;
    }
    // Set the new contact's ID to the original contact's ID to simulate an update
    newContact.id = originalContact.id;

    // Update the contact at the found position with the new contact
    this.contacts[pos] = newContact;

    // Update contact references inside any groups
    this.contacts.forEach(contact => {
      if (contact.group && Array.isArray(contact.group)) {
        const groupIndex = contact.group.findIndex(c => c.id === originalContact.id);
        if (groupIndex !== -1) {
          contact.group[groupIndex] = newContact;
        }
      }
    });

    // Emit a copy of the updated contacts list
    this.contactListChangedEvent.next(this.getContacts());
}

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }

    // Remove the contact from the contacts array by its position
    this.contacts.splice(pos, 1);
    
    // Remove from any group arrays
    this.contacts.forEach(c => {
      if (Array.isArray(c.group)) {
        c.group = c.group.filter(groupMember => groupMember.id !== contact.id);
      }
    });

    this.contactListChangedEvent.next(this.getContacts());
  }
}

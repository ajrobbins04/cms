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
  
  getGroupedContacts() {
      // retrieve each non-null group
      const teams = this.contacts.filter(contact => contact.group);

      // map each group to an object with its name and members
      const groups = teams.map(team => ({
          name: team.name,
          members: team.group
      }));

      return groups;
  }

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact; // Return the contact with the matching ID
      }
    }
    return null; // Return null if no contact with the given ID is found
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
    const pos = this.contacts.indexOf(originalContact)
    if (pos < 0) {
        return;
    }
    // Set the new contact's ID to the original contact's ID to simulate an update
    newContact.id = originalContact.id;

    // Update the contact at the found position with the new contact
    this.contacts[pos] = newContact;

    // Emit a copy of the updated contacts list
    const contactsListClone = this.getContacts();
    this.contactListChangedEvent.next(contactsListClone);
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
    
    const contactsListClone = this.getContacts();
    this.contactListChangedEvent.next(contactsListClone);
  }
}

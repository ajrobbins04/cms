import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();

  maxContactId: number; // number b/c must be able to increment
  unspecifiedContactId: string;
  contacts: Contact[] = [];

  constructor(private http: HttpClient) { 
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

  // Returns the ID of the contact named 'Unspecified'
  // This is used to assign a default department when no specific department is selected
  getUnspecifiedID(): string {
    const defaultDept = this.contacts.find(c => c.name === 'Unspecified');
    return defaultDept?.id;
  }

  getContacts() {
    this.http
      .get<Contact[]>('https://wdd430-cms-ajrobbins-default-rtdb.firebaseio.com/contacts.json')
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts || [];
          this.maxContactId = this.getMaxId();
          this.unspecifiedContactId = this.getUnspecifiedID();
  
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error) => {
          console.error('Error fetching contacts:', error);
        }
      );
  }
  

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact; // Return the contact with the matching ID
      }
    }
    return null; // Return null if no contact with the given ID is found
  }
  
  storeContacts() {
    console.log('Storing contacts to Firebase', this.contacts);
    const contactsJson = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    this.http
      .put('https://wdd430-cms-ajrobbins-default-rtdb.firebaseio.com/contacts.json', contactsJson, { headers })
      .subscribe(() => {
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }
  
  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }
    console.log('addContact called', newContact);

    // Increment to ensure the new contact has a unique ID
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();

    this.contacts.push(newContact);

    const defaultDept = this.getContact(this.unspecifiedContactId);

    // Ensure the default department group array exists
    if (defaultDept) {
      if (!Array.isArray(defaultDept.group)) {
        defaultDept.group = [];
      }
    }
    
    defaultDept.group.push(newContact); // Add the new contact to the 'Unspecified' department
    
    this.storeContacts(); // Store the updated contacts list and emit the change
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

    this.storeContacts(); // Store the updated contacts list and emit the change
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

    this.storeContacts(); // Store the updated contacts list and emit the change
  }
}

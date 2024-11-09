import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';  

@Injectable({
    providedIn: 'root'  // makes service globally available
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

    getContacts() {
        // returns copy of contacts array
        return this.contacts.slice();
    }

    getContact(id: string) {
        for (let contact of this.contacts) {
            if (contact.id === id) {
                return contact;
            }
        }
        return null;
    }
    addContact(newContact: Contact) {
        if (!newContact) {
            return;
        }
        this.maxContactId += 1;
        newContact.id = this.maxContactId.toString();
        this.contacts.push(newContact);
        const contactsListClone = this.getContacts();
        this.contactListChangedEvent.next(contactsListClone);
    }
    updateContact(originalContact: Contact, newContact: Contact) {
        if (!originalContact || !newContact) {
            return;
        }
        const pos = this.contacts.indexOf(originalContact)
        if (pos < 0) {
            return;
        }
        newContact.id = originalContact.id;
        this.contacts[pos] = newContact;
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
        this.contacts.splice(pos, 1);
        const contactsListClone = this.getContacts();
        this.contactListChangedEvent.next(contactsListClone);
    }
}
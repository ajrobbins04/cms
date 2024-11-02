import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';  

@Injectable({
    providedIn: 'root'  // makes service globally available
})

export class ContactService {
    contactSelectedEvent = new EventEmitter<Contact>();
    contactChangedEvent = new EventEmitter<Contact[]>();
    
    contacts: Contact[] = [];
    constructor() {
        this.contacts = MOCKCONTACTS;
    }

    getContacts() {
        // returns copy of contacts array
        return this.contacts.slice(0,11);
    }

    getContact(id: string) {
        for (let contact of this.contacts) {
            if (contact.id === id) {
                return contact;
            }
        }
        return null;
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
        this.contactChangedEvent.emit(this.getContacts());
    }
}
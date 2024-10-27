import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from "./contact.model";
import { MOCKCONTACTS } from './MOCKCONTACTS';  

@Injectable({
    providedIn: 'root'  // makes service globally available
})

export class ContactService {
    contacts: Contact[] = [];
    constructor() {
        this.contacts = MOCKCONTACTS;
    }
}
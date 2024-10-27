import { Component, OnInit, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';

@Injectable()

@Component({
  selector: 'cms-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})

export class ContactsComponent implements OnInit {

  // will be sent by ContactListsComponent to
  // be passed on to ContactDetailsComponent
  selectedContact: Contact;
  
  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.contactService.contactSelectedEvent
    .subscribe(
      (contact: Contact) => {
      this.selectedContact = contact;
      }
    );
  }
}

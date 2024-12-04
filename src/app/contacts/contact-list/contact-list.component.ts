import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
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

export class ContactListComponent implements OnInit, OnDestroy {

  contacts: Contact[] = [];
  //groupedContacts: { name: string, members: Contact[] }[] = [];
  private subscription: Subscription;

  constructor(private contactService: ContactService) {}

  ngOnInit() {

    // get all individual contacts
    this.contacts = this.contactService
      .getContacts()
      .filter(contact => !contact.group);

    this.subscription = this.contactService
      .contactListChangedEvent
      .subscribe((contacts: Contact[]) => {
        this.contacts = contacts.filter(contact => !contact.group); 
    })
  }

  // called when its child component emits an event to 
  // retrieve the contact and then emit it to its own parent
  onSelectedContact(contact: Contact) {
    this.contactService.contactSelectedEvent.emit(contact);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

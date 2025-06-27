import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['../../app.component.css', './contact-list.component.css'],
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  deptGroupedContacts: { name: string; members: Contact[] }[] = [];
  private subscription: Subscription;

  constructor(
    private contactService: ContactService
  ) {}

  ngOnInit() {
    this.deptGroupedContacts = this.contactService.getGroupedContacts();

    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      }
    );
  }

  // This method is called when a contact is selected in the contact-item component
  onSelectedContact(contact: Contact) {
    this.contactService.contactSelectedEvent.emit(contact);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

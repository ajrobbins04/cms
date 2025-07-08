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

  searchTerm: string;
  private subscription: Subscription;

  constructor(
    private contactService: ContactService
  ) {}

  ngOnInit() {
    this.contactService.getContacts();
  
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (updatedContacts: Contact[]) => {
        this.contacts = updatedContacts;
      }
    );
  }

  findDepartments(): Contact[] {
    return this.contacts.filter(contact =>
      contact.isDept && contact.group && contact.group.length > 0
    );
  }
  
  // This method is called when a contact is selected in the contact-item component
  onSelectedContact(contact: Contact) {
    this.contactService.contactSelectedEvent.emit(contact);
  }

  // Called by keyup event from the searchBox input field
  search(value: string) {
    this.searchTerm = value;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

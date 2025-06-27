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
    this.contacts = this.contactService.getContacts();
    this.buildGroupedContacts();
  

    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (updatedContacts: Contact[]) => {
        this.contacts = updatedContacts;
        this.buildGroupedContacts();
      }
    );
  }

  buildGroupedContacts(): void {

    const departments = this.contactService.getDepartmentContacts();
    // Identify all department-like groups
    const deptGroups = departments.map(dept => ({
        name: dept.name,
        members: dept.group!
      }));
  
    // Collect all member IDs from department groups
    const memberIds = new Set(deptGroups.flatMap(g => g.members.map(m => m.id)));
  
    // Find ungrouped contacts (not in any dept group)
    const otherMembers = this.contacts.filter(c => !memberIds.has(c.id) && (!c.group || c.group.length === 0));
  
    // Build the final grouped list
    this.deptGroupedContacts = [...deptGroups];
  
    if (otherMembers.length > 0) {
      this.deptGroupedContacts.push({ name: 'Other', members: otherMembers });
    }
  }
  

  // This method is called when a contact is selected in the contact-item component
  onSelectedContact(contact: Contact) {
    this.contactService.contactSelectedEvent.emit(contact);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

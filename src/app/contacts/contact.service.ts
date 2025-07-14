import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();

  contacts: Contact[] = [];

  constructor(private http: HttpClient) {}

  getContacts() {
    this.http.get<Contact[]>('http://localhost:3000/contacts').subscribe({
      next: (contacts: Contact[]) => {
        if (!contacts) {
          console.log('No contacts found');
          return;
        }
        this.contacts = contacts;
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      error: (error) => { 
        console.error('Error fetching contacts:', error);
      }
    });
  }
  
  
  getContact(id: string): Contact {
    return this.contacts.find(contact => contact['id'] === id) || null;
  }
 
  addContact(contact: Contact) {
    if (!contact) {
      return;
    }
  
    contact.id = ''; // Let the backend assign the ID
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    this.http
      .post<{ message: string; contact: Contact }>(
        'http://localhost:3000/contacts',
        contact,
        { headers }
      )
      .subscribe({
        next: (responseData) => {
          const savedContact = responseData.contact;
          this.contacts.push(savedContact);
  
          // Add the new contact to the 'Unspecified' department if no team is set
          const defaultDept = this.contacts.find(c => c.name === 'Unspecified');

          // If the contact is a department, ensure it has a group array
          if (defaultDept) {
            if (!Array.isArray(defaultDept.group)) {
              defaultDept.group = [];
            }
            defaultDept.group.push(savedContact);
  
            // Update the Unspecified contact group via PUT request
            this.http
              .put(
                'http://localhost:3000/contacts/' + defaultDept.id,
                defaultDept,
                { headers }
              )
              .subscribe({
                next: () => {
                  console.log('Default department updated');
                  this.contactListChangedEvent.next(this.contacts.slice());
                },
                error: (error) => {
                  console.error('Failed to update department group:', error);
                }
              });
          }
        },
        error: (error) => {
          console.error('Failed to add contact:', error);
        }
      });
  }
  

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
    // Find the index (position) of the original contact in the contacts array
    const pos = this.contacts.findIndex((c) => c.id === originalContact.id);
    if (pos < 0) {
      return;
    }
    // Ensure newContact retains original id
    newContact.id = originalContact.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put<{ message: string }>(
        'http://localhost:3000/contacts/' + originalContact.id,
        newContact,
        { headers }
      )
      .subscribe({
        next: () => {
          // Update the contact at the found position with the new contact
          this.contacts[pos] = newContact;

          // If the contact is part of a group, update the group members
          this.contacts.forEach((contact) => {
            if (Array.isArray(contact.group)) {
              const groupIndex = contact.group.findIndex(
                (c) => c.id === originalContact.id
              );
              if (groupIndex !== -1) {
                contact.group[groupIndex] = newContact; // Update the group member with the new contact
              }
            }
          });
          this.contactListChangedEvent.next(this.contacts.slice()); // Emit the updated contacts list
        },
        error: (error) => {
          console.error('Error updating contact:', error);
        },
      });
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    this.http
      .delete<{ message: string }>(
        'http://localhost:3000/contacts/' + contact.id
      )
      .subscribe({
        next: () => {
          // Remove the contact from the contacts array
          const pos = this.contacts.findIndex((c) => c.id === contact.id);
          if (pos < 0) {
            return; // Contact not found in the array
          }
          this.contacts.splice(pos, 1);

          // Remove from any group arrays
          this.contacts.forEach((c) => {
            if (Array.isArray(c.group)) {
              c.group = c.group.filter(
                (groupMember) => groupMember.id !== contact.id
              );
            }
          });

          // Emit updated list
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        error: (error) => {
          console.error('Error deleting contact:', error);
        },
      });
  }
}

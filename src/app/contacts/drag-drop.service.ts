import { Injectable } from '@angular/core';
import { Contact } from './contact.model';

@Injectable({ providedIn: 'root' })

export class DragDropService {
  private draggedContact: Contact | null;

  setDraggedContact(contact: Contact) {
    console.log('Setting dragged contact:', contact);
    this.draggedContact = contact;
  }

  getDraggedContact(): Contact | null {
    return this.draggedContact; 
  }

  clear() {
    this.draggedContact = null;
  }
}

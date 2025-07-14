import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css',
})
export class ContactEditComponent implements OnInit {

  originalContact: Contact; // unedited contact
  contact: Contact; // edited
  groupContacts: Contact[] = [];
  editMode: boolean = false;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];

      // an invalid ID means it's in "new contact" mode
      if (!id) {
        this.editMode = false;
        return;
      }
      // try to fetch existing contact using its ID
      this.originalContact = this.contactService.getContact(id);

      // return if no contact is found
      if (!this.originalContact) {
        return;
      }

      // must enable edit mode if contact is found and
      // then clone it
      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));

      if (this.contact.group) {
        this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
      }
    });
  }

  // helper method for the addToGroup method
  isInvalidContact(newContact: Contact): boolean {
    // check if newContact is invalid
    if (!newContact) {
      return true;
    }

    // check if newContact is the same as the current contact being edited
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }

    // check if newContact already exists in groupContacts
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    // the contact is valid if it reaches this point in the function
    return false;
  }

  onDrop(event: CdkDragDrop<Contact>) {
    const draggedContact = event.item.data

    if (this.isInvalidContact(draggedContact)) {
      return;
    }

    this.groupContacts.push(draggedContact);
  }

  onRemoveItem(index: number): void {
    // must validate index before attempting removal
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }

    // Remove the contact at the specified index
    this.groupContacts.splice(index, 1);
  }

  onSubmit(form: NgForm) {
    console.log('Submitting contact form...');
    // get values from form's value object
    const value = form.value;

    // create a new Contact object
    const newContact = new Contact(
      null, // ID will be set later
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts
    );

    // check edit mode
    if (this.editMode) {
      // update existing contact
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      // add a new contact
      this.contactService.addContact(newContact);
    }

    // go back to the contacts list
    this.onCancel();
  }

  onCancel() {
    // go back to the documents list
    this.router.navigate(['/contacts']);
  }
}

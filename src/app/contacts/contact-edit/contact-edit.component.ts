import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css'
})
export class ContactEditComponent implements OnInit {

  originalContact: Contact; // unedited contact
  contact: Contact;         // edited
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  
  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id']

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
          this.groupContacts = JSON.parse(JSON.stringify(this.groupContacts));
        }
      }
    )
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

  addToGroup(event: any): void {
    // extract dragged contact
    const selectedContact: Contact = event.dragData;

    // helper method returns true if contact is invalid
    if (this.isInvalidContact(selectedContact)) {
      return; 
    }
  
    // add the valid contact to groupContacts
    this.groupContacts.push(selectedContact);
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

    // get values from form's value object
    const value = form.value;

    // create a new Contact object
    const newContact = new Contact(
      value.id, 
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      value.group
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

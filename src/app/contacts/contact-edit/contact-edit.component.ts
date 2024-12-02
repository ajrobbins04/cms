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

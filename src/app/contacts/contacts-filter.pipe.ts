import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';
import { filter } from 'rxjs';

@Pipe({
  name: 'contactsFilter'
})
export class ContactsFilterPipe implements PipeTransform {

  transform(contacts: Contact[], term: string): any {
    let filteredContacts: Contact[] = [];

    // If the search term is valid, filter the contacts
    if (term && term.length > 0) {
      filteredContacts = contacts.filter((contact: Contact) =>
        contact.name.toLowerCase().includes(term.toLowerCase())
      );
    }

    // If no contacts match the filter, return the original contacts array
    if (filteredContacts.length < 1) {
      return contacts;
    } 
    
    return filteredContacts;

  }

}

import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../message.model';
import { Contact } from '../../../contacts/contact.model';
import { ContactService } from '../../../contacts/contact.service';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.css'
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  messageSender: string;

  constructor(private contactService: ContactService) { }
  
  ngOnInit(): void {
    const contact = this.contactService.getContact(this.message.sender);
  
    if (contact) {
      this.messageSender = contact.name;
    } else {
      // Wait for contact list to load if it's not ready yet
      this.contactService.contactListChangedEvent
        .subscribe(() => {
          const fallbackContact = this.contactService.getContact(this.message.sender);
          this.messageSender = fallbackContact ? fallbackContact.name : 'Unknown';
      });
    }
  }
  

}

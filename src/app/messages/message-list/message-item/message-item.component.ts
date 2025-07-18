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
      // Fetch the sender's name embedded in the message
      this.messageSender = this.message.sender.name || 'Unknown';
  }
}

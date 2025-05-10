import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent implements OnInit {

  messages: Message[] = [
    new Message('1', 'Hello World', 'This is a sample message from Alice.', 'Alice'),
    new Message('2', 'Angular Help', 'Can you help me with Angular?', 'Bob'),
    new Message('3', 'Meeting Reminder', 'Don\'t forget about the meeting tomorrow at 10 AM.', 'Charlie'),
    new Message('4', 'Lunch Plan', 'Let\'s meet for lunch at 12 PM today.', 'David')
  ];

  constructor() {}

  ngOnInit(): void {}

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}

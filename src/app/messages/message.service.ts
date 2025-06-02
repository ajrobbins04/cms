import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];

  messageChangedEvent = new EventEmitter<Message[]>();
  constructor() {
    this.messages = MOCKMESSAGES;
   }

   getMessages(): Message[] {
    return this.messages.slice(); // Return a copy of the messages array
   }

    getMessage(id: string): Message {
      for (let message of this.messages) {
        if (message.id === id) {
          return message; // Return the message with the matching ID
        }
      }
      return null; // Return null if no message with the given ID is found
    }

    addMessage(message: Message) {
      this.messages.push(message); // Add the new message to the messages array
      this.messageChangedEvent.emit(this.messages.slice()); // Emit the updated messages array
    }
}

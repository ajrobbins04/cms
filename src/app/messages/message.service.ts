import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  maxMessageId: number = 0; 

  messageChangedEvent = new EventEmitter<Message[]>();

  constructor(private http: HttpClient) {
    this.getMessages(); 
  }

  getMaxId(): number {
    let maxId = 0;
    for (let message of this.messages) {
      const currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId; 
  }

  getMessages() {
    this.http
      .get<Message[]>('https://wdd430-cms-ajrobbins-default-rtdb.firebaseio.com/messages.json')
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages || [];
          this.maxMessageId = this.getMaxId();
  
          this.messageChangedEvent.emit(this.messages.slice());
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
      );
  }

  getMessage(id: string): Message {
    for (let message of this.messages) {
      if (message.id === id) {
        return message; // Return the message with the matching ID
      }
    }
    return null; // Return null if no message with the given ID is found
  }

  storeMessages() {
    const messagesJson = JSON.stringify(this.messages);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    this.http
      .put('https://wdd430-cms-ajrobbins-default-rtdb.firebaseio.com/messages.json', messagesJson, { headers })
      .subscribe(() => {
        this.messageChangedEvent.emit(this.messages.slice());
      });
  }
  

  addMessage(message: Message) {
    if (!message) {
      return; 
    }

    this.maxMessageId++;
    message.id = this.maxMessageId.toString(); // Assign the new ID to the message
    this.messages.push(message);
    this.storeMessages(); // Store the updated messages array and emit the change
  }
}

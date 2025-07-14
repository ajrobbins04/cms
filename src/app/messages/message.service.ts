import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from './message.model';
import { ContactService } from '../contacts/contact.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];

  messageChangedEvent = new EventEmitter<Message[]>();

  constructor(private http: HttpClient, private contactService: ContactService) {
    this.getMessages();
  }

  getMessages() {
    this.http.get<Message[]>('http://localhost:3000/messages').subscribe(
      (messages: Message[]) => {
        this.messages = messages || [];

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

  addMessage(msg: Message) {
    if (!msg) {
      return;
    }

    msg.id = ''; // Will be set using the sequence generator in the backend
    
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; msg: Message }>(
        'http://localhost:3000/messages',
        msg,
        { headers: headers }
      )
      .subscribe({
        next: (responseData) => {
          // Add new message to local array
          const savedMessage = responseData.msg;
          this.messages.push(savedMessage);

          this.messageChangedEvent.next(this.messages.slice());
        },
        error: (error) => {
          console.error('Failed to add contact:', error);
        },
      });
  }
}

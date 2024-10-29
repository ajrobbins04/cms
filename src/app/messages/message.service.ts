import { EventEmitter, OnInit } from '@angular/core';
import { Message } from './message.model';

import { MOCKMESSAGES } from './MOCKMESSAGES'; 

export class MessageService {
    private messages: Message[] = [];
    
    messageChangedEvent = new EventEmitter<Message[]>();
    messageSelectedEvent = new EventEmitter<Message>();
    
    constructor() {
        this.messages = MOCKMESSAGES;
    }
    
    getMessages() {
        return this.messages.slice();
    }

    getMessage(id: string) {
        for (let message of this.messages) {
            if (message.id === id) {
                return message;
            }
        }
        return null;
    }

    addMessage(message: Message) {
        this.messages.push(message);
        this.messageChangedEvent.emit(this.getMessages());
    }
}
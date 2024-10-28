import { EventEmitter } from '@angular/core';
import { Message } from './message.model';

import { MOCKMESSAGES } from './MOCKMESSAGES'; 

export class MessageService {
    messages: Message[] = [];
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


}
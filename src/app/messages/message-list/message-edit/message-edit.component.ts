import { Component, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Message } from '../../message.model';
import { MessageService } from '../../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {

  @Output() addMessageEvent = new EventEmitter<Message>();

  // Using ViewChild to get a reference to the input elements from the DOM
  @ViewChild('subject', { static: false}) subjectRef: ElementRef;
  @ViewChild('msgText', { static: false}) msgTextRef: ElementRef;

  constructor(private messageService: MessageService) {}
 
  onSendMessage(event: Event) {
    // So the form doesn't refresh the page when submitted
    event.preventDefault();
    const subjectVal = this.subjectRef.nativeElement.value;
    const msgTextVal = this.msgTextRef.nativeElement.value;
    const newMessage = new Message('6', subjectVal, msgTextVal, '1');

    this.messageService.addMessage(newMessage);
  }

  onClear() {
    this.subjectRef.nativeElement.value = '';
    this.msgTextRef.nativeElement.value = '';
  }
}

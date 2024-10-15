import { Component, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Message } from '../../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: [
    '../../../app.component.css',
    './message-edit.component.css']
})
export class MessageEditComponent {
  currentSender = 'Amber';
  @Output() addMessageEvent = new EventEmitter<Message>();

  @ViewChild('subject', { static: false}) subjectRef: ElementRef;
  @ViewChild('msgText', { static: false}) msgTextRef: ElementRef;

  constructor() {}
 
  onSendMessage(event: Event) {
    event.preventDefault();
    const subjectVal = this.subjectRef.nativeElement.value;
    const msgTextVal = this.msgTextRef.nativeElement.value;
    const message = new Message('1', subjectVal, msgTextVal, this.currentSender);

    this.addMessageEvent.emit(message);
  }

  onClear() {
    this.subjectRef.nativeElement.value = '';
    this.msgTextRef.nativeElement.value = '';
  }
}

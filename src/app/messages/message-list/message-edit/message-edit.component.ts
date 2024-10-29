import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { Message } from '../../message.model';
import { MessageService } from '../../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: [
    '../../../app.component.css',
    './message-edit.component.css']
})

export class MessageEditComponent implements OnInit {

  @ViewChild('subject') subjectRef: ElementRef;
  @ViewChild('msgText') msgTextRef: ElementRef;

  constructor(private messageService: MessageService) {}
  ngOnInit() {}
 
  onSendMessage(event: Event) {
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

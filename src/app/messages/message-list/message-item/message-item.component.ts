import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../message.model';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.css'
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;

  constructor() { }
  ngOnInit(): void {}
  
}

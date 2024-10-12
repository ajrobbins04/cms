import { Component, OnInit, Input} from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: [
    '../../app.component.css',    
    './contact-detail.component.css'
  ]
})
export class ContactDetailComponent implements OnInit{

  // is sent by its parent, ContactsComponent, to render
  @Input() contact: Contact; 

  constructor() {}

  ngOnInit(): void {
    // Initialization logic, if needed
  }
}

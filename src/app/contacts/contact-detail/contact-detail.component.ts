import { Component, OnInit} from '@angular/core';
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
  contact: Contact;

  constructor() {}

  ngOnInit(): void {
    // Initialization logic, if needed
  }
}

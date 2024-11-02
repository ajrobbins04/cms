import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

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

  constructor(private contactService: ContactService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        const id = params['id'];
        this.contact = this.contactService.getContact(id);
      }
    );
  }

  onDelete() {
    this.contactService.deleteContact(this.contact)
    this.router.navigateByUrl('contacts');
  }
}

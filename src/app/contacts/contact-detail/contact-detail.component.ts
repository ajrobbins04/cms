import { Component, OnInit, Input} from '@angular/core';
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
  @Input() contact: Contact;

  constructor(private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params) => {
        const id = params['id'];
        if (id) {
          this.contact = this.contactService.getContact(id);
        } else {
          this.contact = null;
        }
      }
    );

  }
}
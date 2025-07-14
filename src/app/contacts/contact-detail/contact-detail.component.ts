import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
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
export class ContactDetailComponent implements OnInit, OnChanges {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contact'] && changes['contact'].currentValue) {
      const updatedContact = changes['contact'].currentValue;
      console.log('Contact changed to:', updatedContact);
      // You could add more logic here if needed, like refreshing local display values
    }
  }

  onDelete() {
    this.contactService.deleteContact(this.contact);
    this.router.navigateByUrl('/contacts');
  }
}
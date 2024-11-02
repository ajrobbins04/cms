import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: [
    '../../app.component.css',
    './document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  document: Document;
  
  constructor(private documentService: DocumentService,
              private route: ActivatedRoute,
              private router: Router) {}
  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        const id = params['id'];
        this.document = this.documentService.getDocument(id);
      }
    );
  }
}

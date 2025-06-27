import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrl: './document-edit.component.css'
})

export class DocumentEditComponent implements OnInit {
  originalDocument: Document; // unedited document
  document: Document;         // edited 
  editMode: boolean = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id']

        // an invalid ID means it's in "new document" mode
        if (!id) {
          this.editMode = false;
          return;
        } 
        // try to fetch existing document using its ID
        this.originalDocument = this.documentService.getDocument(id);

        // return if no document is found
        if (!this.originalDocument) {
          return;
        }

        // must enable edit mode if document is found and
        // then clone it
        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
      }
    )
}

  onSubmit(form: NgForm) {

    // get values from form's value object
    const value = form.value;

    // create a new Document object
    const newDocument = new Document(
      value.id, 
      value.name,
      value.description,
      value.url,
      value.children
    );

    // check edit mode
    if (this.editMode) {
      // update existing document
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      // add a new document
      this.documentService.addDocument(newDocument);
    }

    // go back to the documents list
    this.onCancel();
  }
  onCancel() {
    // go back to the documents list
    this.router.navigate(['/documents']);
  }
}

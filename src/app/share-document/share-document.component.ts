import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { myDocument } from '../DTO/my-document';
import { SharedDocument } from '../DTO/shared-documents';
import { DocumentService } from '../Services/document.service';
import { ShareService } from '../Services/share.service';

@Component({
  selector: 'app-share-document',
  templateUrl: './share-document.component.html',
  styleUrls: ['./share-document.component.css']
})
export class ShareDocumentComponent implements OnInit {
  userForm:FormGroup;
  currentDocument: myDocument;
    
  constructor(private documentService:DocumentService,
    private shareService:ShareService) { }
  @Input() DocumentId: string;
  @Output() onStopShare = new EventEmitter();
  ngOnInit(): void {
    this.userForm = new FormGroup({
      UserId: new FormControl('', [Validators.required]),
      UserName: new FormControl('', [Validators.required])
    })
      this.currentDocument = this.documentService.documents.find((c) => c.DocumentId == this.DocumentId);
      this.SubscribeOnSubjects() 
      
    }
    SubscribeOnSubjects(){
      this.shareService.onCreateShareResponseOK().subscribe(data=>{
     
          this.shareService.sharedDocuments.push(new SharedDocument(data.userId,
            data.docId))
            this.onStopShare.next();})
     
      this.shareService.onCreateShareResponseInvalidDocidOrUserid().subscribe(res=>
          alert("Response Invalid Docid Or Userid")
      )
    
      this.shareService.onCreateShareResponseError().subscribe
      (
         message=>
       {console.log("Error",message)
       }
      )
  }

  onSubmit() {
    if (!this.userForm.valid) return;
    this.shareService.CreateShare({
      "user":{
        "emailAddress": this.userForm.value.UserId,
        "userName":this.userForm.value.UserName
          }
        ,
        "DocId": this.currentDocument.DocumentId
       
      })

}
}

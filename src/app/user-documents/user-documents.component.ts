import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { myDocument } from '../DTO/my-document';
import { User } from '../DTO/user';
import { DocumentService } from '../Services/document.service';
import { SocketService } from '../Services/socket.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-user-documents',
  templateUrl: './user-documents.component.html',
  styleUrls: ['./user-documents.component.css']
})
export class UserDocumentsComponent implements OnInit {
  user: User;
  documents= new Array<myDocument>()
  shareDocument = { id: null, show: false };
  document:myDocument;
  showNewDocument: boolean;
  newDocumentForm: FormGroup;
  

  constructor(
    private userService: UserService,
    private documentService: DocumentService,
    private router: Router
    
  ) {}
  
  onSubmit() {}

  ngOnInit(): void {
    this.user = this.userService.user;
    this.userService.userChanged.subscribe((user) => (this.user = user));
    this.documentService.changedDocuments.subscribe((documents) => (this.documents = documents));
    this.documentService
      .getDocumentsOfUser({userId:this.user.emailAddress})
      this.SubscribeOnSubjects() 
  }
  SubscribeOnSubjects(){
    this.documentService.onGetAllDocumentResponseOK().subscribe(data=>{
    var length=data.array.length;
    this.documents=new Array<myDocument>()
    this.documentService.documents=new Array<myDocument>()
    for(var i=0;i<length;i++){
        this.document=new myDocument(data.array[i].userID,
          data.array[i].imageURL,data.array[i].documentName,data.array[i].documentId,
        )             
                      this.documents.push(this.document)
                      this.documentService.documents.push(this.document) 
                
     }
     
                
    }
    )
   
    this.documentService.onGetAllDocumentsUserNotExist().subscribe(res=>
        alert("There are no documents for this user")
    )
  
    this.documentService.onGetAllResponseError().subscribe
    (
       message=>
     {console.log("Error",message)
       this.router.navigate(['']);
     }
    )
    
    this.documentService.onRemoveDocumentResponseOK().subscribe(data=>{
     
          var document=new myDocument(data.document.userID,
            data.document.imageURL,data.document.documentName,data.document.documentId
          )
          var index = this.documents.findIndex(x => x.DocumentId === document.DocumentId);
          if (index !== -1) {
              this.documents.splice(index, 1);
              this.documentService.changedDocuments.next(this.documents)

          }  
                  
       })
       this.documentService.onRemoveDocumentIsNotExist().subscribe(res=>
        alert("Document Id Not Exists, please try again")
    )
  
    this.documentService.onRemoveResponseError().subscribe
    (
       message=>
     {console.log("Error",message)
       this.router.navigate(['']);
     }
    )    
  }
 allShares(documentId){
    this.router.navigate(['/all-shares/' + documentId]);
  }

 deleteDocument(DocId: string) {
    this.documentService
      .removeDocument({ DocId: DocId })
      
  }
  
  
  toggleShare(show: boolean, documentId?: string) {
    this.shareDocument.show = show;
    this.shareDocument.id = documentId;
    
  }
  editDocument(documentId: string)
  {
    this.router.navigate(['/edit/'+ documentId]);
      
  }
  createNewDocument()
  {
    this.router.navigate(['/create']);
  }
 
  unsubscribe(){
    this.router.navigate(['../unsubscribe', this.user.emailAddress]);
  }
  
}

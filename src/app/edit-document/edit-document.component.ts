import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { myDocument } from '../DTO/my-document';
import { User } from '../DTO/user';
import { DocumentService } from '../Services/document.service';
import { SocketService } from '../Services/socket.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.css']
})
export class EditDocumentComponent implements OnInit, OnDestroy {
 
  currentDocument: myDocument;
  newDocumentForm: FormGroup;
  selectedFile: File = null;
  document:myDocument
  
  documents=new Array<myDocument>()
  users=new Array<string>()
 
    
  constructor(private documentService:DocumentService,private userService:UserService,
    private http:HttpClient,private router:Router, private socketService: SocketService,
    private route:ActivatedRoute) { }
  
  
  
  ngOnInit(): void {
    
    this.users[0]=this.userService.user.emailAddress
    this.currentDocument = this.documentService.documents.find((c) => c.DocumentId == 
    this.route.snapshot.paramMap.get('docId'));
    this.newDocumentForm = new FormGroup({
      Name: new FormControl(this.currentDocument.DocumentName||null),
      ChangeImage: new FormControl(''||null),
           
    });
   this.socketService.StartOrStop(this.currentDocument.DocumentId,"connect");
   this.documentService.changedDocuments.subscribe((doc)=>this.documents=doc)
   this.SubscribeOnSubjects()

  }
  
  SubscribeOnSubjects() {
    this.documentService.onUpdateDocumentResponseOK().subscribe(data=>{
    var docIndex = this.documentService.documents.findIndex(x => x.DocumentId === data.document.documentId);
        if (docIndex !== -1) {
          this.documentService.documents.splice(docIndex, 1);}
          this.documentService.documents.push(new myDocument(data.document.userID,
            data.document.imageURL,data.document.documentName,data.document.documentId))
          
            this.documentService.changedDocuments.next(this.documentService.documents)
            this.router.navigate(['/user-documents/'+ this.currentDocument.UserID])})
    
     
      this.documentService.onUpdateDocumentDocNotExist().subscribe(res=>{
          alert('Update Document Not Succes, DocId Not Exists')
          this.documentService.changedDocuments.next(this.documentService.documents)
          this.router.navigate(['/user-documents/'+ this.currentDocument.UserID])})
 
    
      this.documentService.onUpdateResponseError().subscribe
      (
         message=>
       {console.log("Error",message)
       this.router.navigate(['']);
       }
      
      )
      this.socketService.onSocketUserConnected().subscribe(data=>{
        if(!this.users.includes(data))
        this.users.push(data)
      })
      this.socketService.onSocketUserDisconnected().subscribe(data=>{
        var userIndex = this.users.findIndex(x => x === data);
        if (userIndex !== -1) {
          this.users.splice(userIndex, 1);}
      })
      
  }
  onSelectFile(fileInput: any) {
    this.selectedFile = <File>fileInput.target.files[0];
  }
  
  onSubmit(data) {
  if(this.selectedFile==null)
  this.documentService.updateDocument({DocumentName:this.newDocumentForm.value.Name
  ,ImageUrl:this.currentDocument.ImageURL,DocumentId:this.currentDocument.DocumentId})
  else{
  const formData = new FormData();
  formData.append('Name', data.Name);
  formData.append('ChangeImage', this.selectedFile);
  formData.append('DocId', this.currentDocument.DocumentId);
  this.http.post('https://localhost:44317/api/Document/UpdateDocumentLoadImage', formData)
  
   .subscribe(res => {
    
      if ((res["responseType"] =="UpdateDocumentResponseOK")){
        var document=new myDocument(res["document"].userID,
        res["document"].imageURL,res["document"].documentName,res["document"].documentId)
       var docIndex = this.documentService.documents.findIndex(x => x.DocumentId === res["document"].documentId);
        if (docIndex !== -1) {
          this.documentService.documents.splice(docIndex, 1);}
          this.documentService.documents.push(document)
       this.documentService.changedDocuments.next(this.documentService.documents)
       this.router.navigate(['/user-documents/'+ this.currentDocument.UserID])
      }
       else if((res["responseType"] =="UpdateDocumentResponseDocIdNotExists"))
       alert('Update Document Not Succes, DocId Not Exists');
       this.router.navigate(['/user-documents/'+ this.currentDocument.UserID])
       error=>console.log( error)
      
   
  });

  this.newDocumentForm.reset();
}
}

ngOnDestroy() {
  this.socketService.StartOrStop(this.currentDocument.DocumentId,"disconect");
}
  
}


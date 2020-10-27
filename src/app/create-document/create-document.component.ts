import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import { myDocument } from '../DTO/my-document';
import { User } from '../DTO/user';
import { DocumentService } from '../Services/document.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-create-document',
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.css']
})
export class CreateDocumentComponent  implements OnInit {
 user:User
 selectedFile: File = null;
 newDocumentForm: FormGroup;
 document:myDocument
 documents=new Array<myDocument>()
 error:any
constructor(private http: HttpClient,private userService:UserService,
  private documentService:DocumentService,private router:Router) { }

ngOnInit() {
  this.user = this.userService.user;
  this.userService.userChanged.subscribe((user) => (this.user = user));
  this.documents=this.documentService.documents 
  this.documentService.changedDocuments.subscribe((doc)=>this.documents=doc)
  this.newDocumentForm = new FormGroup({
    Name: new FormControl(null),
    SelectedImage: new FormControl(null),
    
    
  });
  
}

onSelectFile(fileInput: any) {
  this.selectedFile = <File>fileInput.target.files[0];
}

onSubmit(data) {
  
  const formData = new FormData();
  formData.append('Name', data.Name);
  formData.append('SelectedImage', this.selectedFile);
  formData.append('userId', this.user.emailAddress );
  this.http.post('https://localhost:44317/api/Document/CreateDocument', formData)
  
   .subscribe(res => {
    
      if ((res["responseType"] =="CreateDocumentResponseOK")){
        var document=new myDocument(res["document"].userID,
        res["document"].imageURL,res["document"].documentName,res["document"].documentId
       )
       if(this.documents==null)
       this.documents=new Array<myDocument>()
       this.documents.push(document)
       this.documentService.changedDocuments.next(this.documents)
      }
       else if((res["responseType"] =="CreateDocumentResponseDocIdExists"))
       alert('Document Id Exists,please try again');
     
       error=>this.error=error
       this.router.navigate(['/user-documents', this.user.emailAddress]);
      
   
  });

  this.newDocumentForm.reset();
}

 
}

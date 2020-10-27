import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetAllDocumentsResponseOK } from '../DTO/response/get-all-documents-response-ok';
import { GetAllDocumentsUserNotExist } from '../DTO/response/get-all-documents-user-not-exist';
import { myDocument } from '../DTO/my-document';
import { GetDocumentDocNotExist } from '../DTO/response/get-document-doc-not-exist';
import { GetDocumentResponseOK } from '../DTO/response/get-document-response-ok';
import { CommService } from './comm.service';
import { GetAllDocumentsRequest } from '../DTO/response/get-all-documents-request';
import { RemoveDocumentRequest } from '../DTO/response/remove-document-request';
import { RemoveDocumentResponseOK } from '../DTO/response/remove-document-response-ok';
import { RemoveDocumentIsNotExist } from '../DTO/response/remove-document-is-not-exist';
import { UpdateDocumentRequest } from '../DTO/response/update-document-request';
import { UpdateDocumentResponseOK } from '../DTO/response/update-document-response';
import { UpdateDocumentResponseDocIdNotExists } from '../DTO/response/update-document-response-doc-id-not-exists';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  
 

  documents=new Array<myDocument>()
  changedDocuments=new Subject<Array<myDocument>>()
  
  
  getResponseSubjects: { [responseID: string]: Subject<any> } = {
    GetDocumentResponseOK: new Subject<GetDocumentResponseOK>(),
    GetDocumentDocNotExist: 
    new Subject<GetDocumentDocNotExist>(),
    ResponseError: new Subject<any>()
  }
  getAllResponseSubjects: { [responseID: string]: Subject<any> } = {
    GetAllDocumentsResponseOK: new Subject<GetAllDocumentsResponseOK>(),
    GetAllDocumentsUserNotExist: 
    new Subject<GetAllDocumentsUserNotExist>(),
    ResponseError: new Subject<any>()
  }
  removeResponseSubjects: { [responseID: string]: Subject<any> } = {
    RemoveDocumentResponseOK: new Subject<RemoveDocumentResponseOK>(),
    RemoveDocumentIsNotExist: 
    new Subject<RemoveDocumentIsNotExist>(),
    ResponseError: new Subject<any>()
  }

  updateResponseSubjects: { [responseID: string]: Subject<any> } = {
    UpdateDocumentResponseOK: new Subject<UpdateDocumentResponseOK>(),
    UpdateDocumentResponseDocIdNotExists: 
    new Subject<UpdateDocumentResponseDocIdNotExists>(),
    ResponseError: new Subject<any>()
  }
  onUpdateDocumentResponseOK() {
    return this.updateResponseSubjects.UpdateDocumentResponseOK
  }
  onUpdateDocumentDocNotExist() {
    return this.updateResponseSubjects.UpdateDocumentResponseDocIdNotExists
  }
  onUpdateResponseError() {
    return this.updateResponseSubjects.ResponseError
  }

  
  onGetDocumentResponseOK() {
    return this.getResponseSubjects.GetDocumentResponseOK
  }
  onGetDocumentDocNotExist() {
    return this.getResponseSubjects.GetDocumentDocNotExist
  }
  onGetResponseError() {
    return this.getResponseSubjects.ResponseError
  }

  onGetAllDocumentResponseOK() {
    return this.getAllResponseSubjects.GetAllDocumentsResponseOK
  }
  onGetAllDocumentsUserNotExist() {
    return this.getAllResponseSubjects.GetAllDocumentsUserNotExist
  }
  onGetAllResponseError() {
    return this.getAllResponseSubjects.ResponseError
  }
  onRemoveDocumentResponseOK() {
    return this.removeResponseSubjects.RemoveDocumentResponseOK
  }
  onRemoveDocumentIsNotExist() {
    return this.removeResponseSubjects.RemoveDocumentIsNotExist
  }
  onRemoveResponseError() {
    return this.removeResponseSubjects.ResponseError
  }

  constructor(private commService:CommService) { }
  

      getDocumentsOfUser(request:GetAllDocumentsRequest) {
        return this.commService.getDocumentsOfUser(request).pipe(
         map(data => [data, this.getAllResponseSubjects[data.responseType]])
         ).
         subscribe(       
           ([data, subject]) => 
           {
            this.documents=data.array
            this.changedDocuments.next(this.documents);
            subject.next(data),
           error=>this.onGetAllResponseError().next(error)
           }
         )};
         removeDocument(request:RemoveDocumentRequest) {
          return this.commService.removeDocument(request).pipe(
            map(data => [data, this.removeResponseSubjects[data.responseType]])
            ).
            subscribe(       
              ([data, subject]) => 
              {
                subject.next(data),
              error=>this.onRemoveResponseError().next(error)
              }
            )};
            updateDocument(request:UpdateDocumentRequest) {
              return this.commService.updateDocument(request).pipe(
                map(data => [data, this.updateResponseSubjects[data.responseType]])
                ).
                subscribe(       
                  ([data, subject]) => 
                  {
                    subject.next(data),
                  error=>this.onUpdateResponseError().next(error)
                  }
                )};
}
           

            
      


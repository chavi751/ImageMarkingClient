import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { myDocument } from '../DTO/my-document';
import { CreateShareRequest } from '../DTO/response/create-share-request';
import { CreateShareResponseInvalidDocidOrUserid } from '../DTO/response/create-share-response-invalid-docid-or-userid';
import { CreateShareResponseOK } from '../DTO/response/create-share-response-ok';
import { GetSharesRequest } from '../DTO/response/get-shares-request';
import { GetSharesResponseNoShares } from '../DTO/response/get-shares-response-no-shares';
import { GetSharesResponseOK } from '../DTO/response/get-shares-response-ok';
import { RemoveShareIsNotExist } from '../DTO/response/remove-share-is-not-exist';
import { RemoveShareRequest } from '../DTO/response/remove-share-request';
import { RemoveShareResponseOK } from '../DTO/response/remove-share-response-ok';
import { SharedDocument } from '../DTO/shared-documents';
import { CommService } from './comm.service';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  sharedDocuments=new Array<SharedDocument>();
  sharedDocumentsChanged = new Subject<Array<SharedDocument>>();
  constructor(private commService:CommService) { }
  CreateShare(request:CreateShareRequest) {
    return this.commService.CreateShareDocument(request).pipe(
      map(data => [data, this.createShareResponseSubjects[data.responseType]])
      ).
      subscribe(       
        ([data, subject]) => 
        {
          
          subject.next(data),
        error=>this.onCreateShareResponseError().next(error)
        }
      )
  }
  RemoveShare(request:RemoveShareRequest) {
    return this.commService.RemoveRShare(request).pipe(
      map(data => [data, this.removeShareResponseSubjects[data.responseType]])
      ).
      subscribe(       
        ([data, subject]) => 
        {
          
          subject.next(data),
        error=>this.onCreateShareResponseError().next(error)
        }
      )
  }
  getShares(request:GetSharesRequest) {
    return this.commService.getShares(request).pipe(
      map(data => [data, this.getShareResponseSubjects[data.responseType]])
      ).
      subscribe(       
        ([data, subject]) => 
        {
          
          subject.next(data),
        error=>this.onCreateShareResponseError().next(error)
        }
      )
  }
  onCreateShareResponseOK() {
    return this.createShareResponseSubjects.CreateShareResponseOK
  }
  onCreateShareResponseInvalidDocidOrUserid() {
    return this.createShareResponseSubjects.CreateShareResponseInvalidDocidOrUserid
  }
  onCreateShareResponseError() {
    return this.createShareResponseSubjects.ResponseError
  }
  onRemoveShareResponseOK() {
    return this.removeShareResponseSubjects.RemoveShareResponseOK
  }
  onRemoveShareIsNotExist() {
    return this.removeShareResponseSubjects.RemoveShareIsNotExist
  }
  onRemoveShareResponseError() {
    return this.removeShareResponseSubjects.ResponseError
  }
  onGetShareResponseOK() {
    return this.getShareResponseSubjects.GetSharesResponseOK
  }
  onGetSharesResponseNoShares() {
    return this.getShareResponseSubjects.GetSharesResponseNoShares
  }
  onGetShareResponseError() {
    return this.getShareResponseSubjects.ResponseError
  }
  createShareResponseSubjects: { [responseID: string]: Subject<any> } = {
    CreateShareResponseOK: new Subject<CreateShareResponseOK>(),
    CreateShareResponseInvalidDocidOrUserid: 
    new Subject<CreateShareResponseInvalidDocidOrUserid>(),
    ResponseError: new Subject<any>()
  }
  removeShareResponseSubjects: { [responseID: string]: Subject<any> } = {
    RemoveShareResponseOK: new Subject<RemoveShareResponseOK>(),
    RemoveShareIsNotExist: 
    new Subject<RemoveShareIsNotExist>(),
    ResponseError: new Subject<any>()
  }
  getShareResponseSubjects: { [responseID: string]: Subject<any> } = {
    GetSharesResponseOK: new Subject<GetSharesResponseOK>(),
    GetSharesResponseNoShares: 
    new Subject<GetSharesResponseNoShares>(),
    ResponseError: new Subject<any>()
  }
}

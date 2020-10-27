import { Injectable } from '@angular/core';
import { User } from '../DTO/user';
import { Observable } from 'rxjs';
import { SignUpRequest } from '../DTO/response/sign-up-request';
import { SignInRequest } from '../DTO/response/sign-in-request';
import { CreateDocumentRequest } from '../DTO/response/create-document-request';
import { GetDocumentRequest } from '../DTO/response/get-document-request';
import { GetAllDocumentsRequest } from '../DTO/response/get-all-documents-request';
import { RemoveDocumentRequest } from '../DTO/response/remove-document-request';
import { CreateShareRequest } from '../DTO/response/create-share-request';
import { GetMarkersRequest } from '../DTO/response/get-markers-request';
import { RemoveMarkerRequest } from '../DTO/response/remove-marker-request';
import { CreateMarkerRequest } from '../DTO/response/create-marker-request';
import { RemoveShareRequest } from '../DTO/response/remove-share-request';
import { GetSharesRequest } from '../DTO/response/get-shares-request';
import { UpdateMarkerRequest } from '../DTO/response/update-marker-request';
import { RemoveUserRequest } from '../DTO/response/remove-user-request';
import { UpdateDocumentRequest } from '../DTO/response/update-document-request';

@Injectable({
  providedIn: 'root'
})
export abstract class CommService {
  
 
  constructor() { }
  abstract SignUp(request:SignUpRequest):Observable<any>
  abstract SignIn(request:SignInRequest):Observable<any>
  abstract unsubscribe(request: RemoveUserRequest):Observable<any>  
  abstract CreateDocument(DocumentName, sendData): Observable<any>
  abstract getDocumentsOfUser(request: GetAllDocumentsRequest):Observable<any>
  abstract removeDocument(request: RemoveDocumentRequest):Observable<any>
  abstract CreateShareDocument(request: CreateShareRequest):Observable<any>   
  abstract createMarker(request: CreateMarkerRequest):Observable<any>
  abstract removeMarker(request: RemoveMarkerRequest):Observable<any> 
  abstract getMarkers(request: GetMarkersRequest):Observable<any>  
  abstract getShares(request: GetSharesRequest):Observable<any>    
  abstract RemoveRShare(request: RemoveShareRequest):Observable<any>  
  abstract updateMarker(request: UpdateMarkerRequest):Observable<any>
  abstract updateDocument(request: UpdateDocumentRequest):Observable<any>
  
}

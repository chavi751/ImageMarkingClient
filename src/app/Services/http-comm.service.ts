import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { CommService } from './comm.service';
import { User } from '../DTO/user';
import { Observable } from 'rxjs';
import { SignInRequest } from '../DTO/response/sign-in-request';
import { SignUpRequest } from '../DTO/response/sign-up-request';
import { CreateDocumentRequest } from '../DTO/response/create-document-request';
import { GetDocumentRequest } from '../DTO/response/get-document-request';
import { GetAllDocumentsRequest } from '../DTO/response/get-all-documents-request';
import { RemoveDocumentRequest } from '../DTO/response/remove-document-request';
import { CreateShareRequest } from '../DTO/response/create-share-request';
import { CreateMarkerRequest } from '../DTO/response/create-marker-request';
import { GetMarkersRequest } from '../DTO/response/get-markers-request';
import { RemoveMarkerRequest } from '../DTO/response/remove-marker-request';
import { GetSharesRequest } from '../DTO/response/get-shares-request';
import { RemoveShareRequest } from '../DTO/response/remove-share-request';
import { UpdateMarkerRequest } from '../DTO/response/update-marker-request';
import { RemoveUserRequest } from '../DTO/response/remove-user-request';
import { UpdateDocumentRequest } from '../DTO/response/update-document-request';
@Injectable({
  providedIn: 'root'
})
export class HttpCommService implements CommService {

  constructor(private http:HttpClient) { }
  updateDocument(request: UpdateDocumentRequest): Observable<any> {
    return this.http.post('https://localhost:44317/api/Document/UpdateDocument',request)
  }
  unsubscribe(request: RemoveUserRequest): Observable<any> {
    return this.http.post('https://localhost:44317/api/User/RemoveUser',request)
  }
  updateMarker(request: UpdateMarkerRequest): Observable<any> {
    return this.http.post('https://localhost:44317/api/DocumentMarkers/UpdateMarker',request);
  }
  getShares(request: GetSharesRequest): Observable<any> {
    return this.http.post('https://localhost:44317/api/SharedDocuments/GetShares',request);
  }
  RemoveRShare(request: RemoveShareRequest): Observable<any> {
    return this.http.post('https://localhost:44317/api/SharedDocuments/RemoveShare',request);
  }
  createMarker(request: CreateMarkerRequest): Observable<any> {
    return this.http.post('https://localhost:44317/api/DocumentMarkers/CreateMarker',request);
  }
  removeMarker(request: RemoveMarkerRequest): Observable<any> {
    return this.http.post('https://localhost:44317/api/DocumentMarkers/RemoveMarker',request);
  }
  getMarkers(request: GetMarkersRequest): Observable<any> {
    return this.http.post('https://localhost:44317/api/DocumentMarkers/GetMarkers',request);
  }
  CreateShareDocument(request: CreateShareRequest): Observable<any> {
    return this.http.post('https://localhost:44317/api/SharedDocuments/CreateShare',request);
  }
  removeDocument(request: RemoveDocumentRequest): Observable<any> {
    return this.http.post('https://localhost:44317/api/Document/RemoveDocument',request);
  }
  getDocumentsOfUser(request: GetAllDocumentsRequest): Observable<any> {
    return this.http.post('https://localhost:44317/api/Document/GetDocuments',request)
  }
  
  SignIn(request:SignInRequest): Observable<any> {
    return this.http.post('https://localhost:44317/api/User/SignIn',request)
  }
  SignUp(request:SignUpRequest): Observable<any> {
    return this.http.post('https://localhost:44317/api/SignUp/SignUp',request)
  }
  CreateDocument(sendData): Observable<any> {
    return this.http.post('https://localhost:44317/api/Document/CreateDocument',sendData)
  }
}

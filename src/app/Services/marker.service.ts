import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Marker } from '../DTO/marker';
import { CreateMarkerRequest } from '../DTO/response/create-marker-request';
import { CreateMarkerResponseMarkerExists } from '../DTO/response/create-marker-response-marker-exists';
import { CreateMarkerResponseOK } from '../DTO/response/create-marker-response-ok';
import { GetMarkersDocNotExist } from '../DTO/response/get-markers-doc-not-exist';
import { GetMarkersRequest } from '../DTO/response/get-markers-request';
import { GetMarkersResponseOK } from '../DTO/response/get-markers-response-ok';
import { RemoveMarkerIsNotExist } from '../DTO/response/remove-marker-is-not-exist';
import { RemoveMarkerRequest } from '../DTO/response/remove-marker-request';
import { RemoveMarkerResponseOK } from '../DTO/response/remove-marker-response-ok';
import { UpdateMarkerRequest } from '../DTO/response/update-marker-request';
import { UpdateMarkerResponseMarkerIdNotExists } from '../DTO/response/update-marker-response-marker-id-not-exists';
import { UpdateMarkerResponseOK } from '../DTO/response/update-marker-response-ok';
import { CommService } from './comm.service';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  markers=new Array<Marker>()
  changedmarkers=new Subject<Array<Marker>>()
  constructor(private commService:CommService) { }
  
  
  createResponseSubjects: { [responseID: string]: Subject<any> } = {
    CreateMarkerResponseOK: new Subject<CreateMarkerResponseOK>(),
    CreateMarkerResponseMarkerExists: 
    new Subject<CreateMarkerResponseMarkerExists>(),
    ResponseError: new Subject<any>()
  }
  getAllResponseSubjects: { [responseID: string]: Subject<any> } = {
    GetMarkersResponseOK: new Subject<GetMarkersResponseOK>(),
    GetMarkersDocNotExist: 
    new Subject<GetMarkersDocNotExist>(),
    ResponseError: new Subject<any>()
  }
  removeResponseSubjects: { [responseID: string]: Subject<any> } = {
    RemoveMarkerResponseOK: new Subject<RemoveMarkerResponseOK>(),
    RemoveMarkerIsNotExist: 
    new Subject<RemoveMarkerIsNotExist>(),
    ResponseError: new Subject<any>()
  }

  updateResponseSubjects: { [responseID: string]: Subject<any> } = {
    UpdateMarkerResponseOK: new Subject<UpdateMarkerResponseOK>(),
    UpdateMarkerResponseMarkerIdNotExists: 
    new Subject<UpdateMarkerResponseMarkerIdNotExists>(),
    ResponseError: new Subject<any>()
  }
 
  
   onGetMarkersResponseOK() {
    return this.getAllResponseSubjects.GetMarkersResponseOK
  }
   onGetMarkersDocNotExist() {
    return this.getAllResponseSubjects.GetMarkersDocNotExist
  }
  onGetAllResponseError() {
    return this.getAllResponseSubjects.ResponseError
  }
  onRemoveMarkerResponseOK() {
    return this.removeResponseSubjects.RemoveMarkerResponseOK
  }
  onRemoveMarkerIsNotExist() {
    return this.removeResponseSubjects.RemoveMarkerIsNotExist
  }
  onRemoveResponseError() {
    return this.removeResponseSubjects.ResponseError
  }
  onCreateMarkerResponseOK() {
    return this.createResponseSubjects.CreateMarkerResponseOK
  }
  onCreateMarkerResponseMarkerExists() {
    return this.createResponseSubjects.CreateMarkerResponseMarkerExists
  }
  onCreateResponseError() {
    return this.createResponseSubjects.ResponseError
  }
  onUpdateMarkerResponseOK() {
    return this.updateResponseSubjects.UpdateMarkerResponseOK
  }
  onUpdateMarkerResponseMarkerIdNotExists() {
    return this.updateResponseSubjects.UpdateMarkerResponseMarkerIdNotExists
  }
  onUpdateResponseError() {
    return this.updateResponseSubjects.ResponseError
  }

  
  createMarker(request:CreateMarkerRequest){
    return this.commService.createMarker(request).pipe(
      map(data => [data, this.createResponseSubjects[data.responseType]])
      ).
      subscribe(       
        ([data, subject]) => 
        {
          subject.next(data),
        error=>this.onCreateResponseError().next(error)
        }
      )};

      UpdateMarker(request:UpdateMarkerRequest){
        return this.commService.updateMarker(request).pipe(
          map(data => [data, this.updateResponseSubjects[data.responseType]])
          ).
          subscribe(       
            ([data, subject]) => 
            {
              subject.next(data),
            error=>this.onUpdateResponseError().next(error)
            }
          )};
    
      getMarkers(request:GetMarkersRequest) {
        return this.commService.getMarkers(request).pipe(
         map(data => [data, this.getAllResponseSubjects[data.responseType]])
         ).
         subscribe(       
           ([data, subject]) => 
           {
             subject.next(data),
           error=>this.onGetAllResponseError().next(error)
           }
         )};
         removeMarker(request:RemoveMarkerRequest) {
          return this.commService.removeMarker(request).pipe(
            map(data => [data, this.removeResponseSubjects[data.responseType]])
            ).
            subscribe(       
              ([data, subject]) => 
              {
                subject.next(data),
              error=>this.onRemoveResponseError().next(error)
              }
            )};
           

            
      
}


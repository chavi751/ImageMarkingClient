import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket'
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  _subject:WebSocketSubject<MessageEvent>
  constructor(private userService: UserService) { }

  StartOrStop(documentId: string,type:string){
    // console.log("Service Start")
     var url="wss://localhost:44317/ws?id="+this.userService.user.emailAddress+"&documentId="+documentId+"&type="+type
    // webSocket(
    //  {url:url,deserializer: msg => msg})
   this._subject = webSocket( {url:url,deserializer: msg => msg});
  
   this._subject.
   pipe(map(msg=>{
     var data=msg.data.split('/')
     return [data[1],this.socketResponseSubjects[data[0]]]})).
     subscribe( ([data,subject])=>subject?.next(data))
    if(type=="disconnect"){
      this._subject.complete();
    }
   }
  Send(msg: any) {
    this._subject.next(msg);
  }


  onSockeMarkerRemoved() {
    return this.socketResponseSubjects.MarkerRemoved
  }
  onSocketMarkerUpdated() {
    return this.socketResponseSubjects.MarkerUpdated
  }
  onSocketMarkerCreated() {
    return this.socketResponseSubjects.MarkerCreated
  }
  
  onSocketUserConnected() {
    return this.socketResponseSubjects.UserConnected
  }
  onSocketUserDisconnected() {
    return this.socketResponseSubjects.UserDisconnected
  }
  socketResponseSubjects: { [responseID: string]: Subject<any> } = {
    MarkerRemoved: new Subject<any>(),
    MarkerUpdated: new Subject<any>(),
    MarkerCreated: new Subject<any>(),
    RemovedShare: new Subject<any>(),
    UserConnected:new Subject<any>(),
    UserDisconnected: new Subject<any>()
  }
}

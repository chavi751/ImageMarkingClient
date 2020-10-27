import { Injectable } from '@angular/core';
import { User } from '../DTO/user';
import { CommService } from './comm.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SignInRequest } from '../DTO/response/sign-in-request';
import { SignUpRequest } from '../DTO/response/sign-up-request';
import { SignInInvalidUserNameOrPasswordResponse } from '../DTO/response/sign-in-invalid-user-name-or-password-response';
import { SignUpResponseEmailAddressExists } from '../DTO/response/sign-up-response-email-address-exists';
import { SignUpResponseOK } from '../DTO/response/sign-up-response-ok';
import { SignInResponseOK } from '../DTO/response/sign-in-response-ok';
import { RemoveUserIsNotExist } from '../DTO/response/remove-user-is-not-exist';
import { RemoveUserResponseOK } from '../DTO/response/remove-user-response-ok';
import { RemoveUserRequest } from '../DTO/response/remove-user-request';
import { SignInResponseUserUnsubscribe } from '../DTO/response/sign-in-response-user-unsubscribe';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  signInResponseSubjects: { [responseID: string]: Subject<any> } = {
    SignInResponseOK: new Subject<SignInResponseOK>(),
    SignInInvalidUserNameOrPasswordResponse: 
    new Subject<SignInInvalidUserNameOrPasswordResponse>(),
    SignInResponseUserUnsubscribe:
    new Subject<SignInResponseUserUnsubscribe>(),
    ResponseError: new Subject<any>()
  }
  signUpResponseSubjects: { [responseID: string]: Subject<any> } = {
    SignUpResponseOK: new Subject<SignUpResponseOK>(),
    SignUpResponseEmailAddressExists: 
    new Subject<SignUpResponseEmailAddressExists>(),
    ResponseError: new Subject<any>()
  }
  removeResponseSubjects: { [responseID: string]: Subject<any> } = {
    RemoveUserResponseOK: new Subject<RemoveUserResponseOK>(),
    RemoveUserIsNotExist: 
    new Subject<RemoveUserIsNotExist>(),
    ResponseError: new Subject<any>()
  }
  onRemoveRespnseOK() {
    return this.removeResponseSubjects.RemoveUserResponseOK
  }
  onRemoveUserIsNotExist() {
    return this.removeResponseSubjects.RemoveUserIsNotExist
  }
  onRemoveResponseError() {
    return this.removeResponseSubjects.ResponseError
  }
  
  onSignInRespnseOK() {
    return this.signInResponseSubjects.SignInResponseOK
  }
  onSignInInvalidUserNameOrPasswordResponse() {
    return this.signInResponseSubjects.SignInInvalidUserNameOrPasswordResponse
  }
  onSignInResponseUserUnsubscribe() {
    return this.signInResponseSubjects.SignInResponseUserUnsubscribe
  }  
  onResponseError() {
    return this.signInResponseSubjects.ResponseError
  }

  onSignUpResponseOK() {
    return this.signUpResponseSubjects.SignUpResponseOK
  }
  onSignUpResponseEmailAddressExists() {
    return this.signUpResponseSubjects.SignUpResponseEmailAddressExists
  }
  onSignUpError() {
    return this.signUpResponseSubjects.ResponseError
  }
  constructor(private commService:CommService) { }
  SignUp(request:SignUpRequest){
    return this.commService.SignUp(request).pipe(
      map(data => [data, this.signUpResponseSubjects[data.responseType]])
      ).
      subscribe(
        ([data, subject]) => { subject.next(data)},
        error=>this.onSignUpError().next(error)
      )};
  user= new User;
  userChanged = new Subject<User>();

  signIn(request:SignInRequest) {
    return this.commService.SignIn(request).pipe(
     map(data => [data, this.signInResponseSubjects[data.responseType]])
     ).
     subscribe(       
       ([data, subject]) => 
       { this.user.emailAddress=data.emailAddress
         this.user.userName=data.userName
         this.userChanged.next(this.user);
         subject.next(data),
         error=>this.onResponseError().next(error)
       }
     )};
     unsubscribe(request:RemoveUserRequest){
      return this.commService.unsubscribe(request).pipe(
        map(data => [data, this.removeResponseSubjects[data.responseType]])
        ).
        subscribe(
          ([data, subject]) => { subject.next(data)},
          error=>this.onRemoveResponseError().next(error)
        )};
}

 
  
  

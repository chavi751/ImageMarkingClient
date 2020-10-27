import { Component, OnInit } from '@angular/core';
import { User } from '../DTO/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../Services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  user:User
  public signInForm:FormGroup
  message:string

  constructor(private userService:UserService,private router: Router) { }

  ngOnInit(): void {
    
    this.signInForm = new FormGroup({
      UserName: new FormControl('',[Validators.required]),
      emailAddress: new FormControl('',[Validators.required]),
    });
    this.SubscribeOnSubjects()
  }
  onSubmit()
  {
    if (!this.signInForm.valid) return;
    this.userService.signIn({"UserName": this.signInForm.value.UserName,
    "emailAddress": this.signInForm.value.emailAddress} )
  

}

SubscribeOnSubjects(){
  this.userService.onSignInRespnseOK().subscribe(
    res => {
      this.router.navigate(['/user-documents', res.emailAddress]);
      this.userService.user.emailAddress=res.emailAddress
      this.userService.user.userName=res.userName
    }
  )
  
  this.userService.onSignInResponseUserUnsubscribe().subscribe(
    res => {
      alert("UserUnsubscribe!!!")
      this.router.navigate(['']);           
    })
  this.userService.onSignInInvalidUserNameOrPasswordResponse().subscribe(
    res => {
      alert("Invalid User Name Or Password")           
    }
  )

  this.userService.onResponseError().subscribe
  (
    res => {
      console.log("error",res)
      this.router.navigate(['']);
    }
  )

}
}



  
 
  

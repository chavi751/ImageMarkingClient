import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../DTO/user';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  user:User
  public signUpForm:FormGroup
  message:any

  constructor(private userService:UserService,private router:Router) { }

  ngOnInit(): void {
    
    this.signUpForm = new FormGroup({
      UserName: new FormControl('',[Validators.required]),
      emailAddress: new FormControl('',[Validators.required]),
    });
    this.SubscribeOnSubjects()

  }
  onSubmit()
  {
    if (!this.signUpForm.valid) return;
    this.userService.SignUp({"UserName": this.signUpForm.value.UserName,
    "emailAddress": this.signUpForm.value.emailAddress} )
 }
 SubscribeOnSubjects(){
  this.userService.onSignUpResponseOK().subscribe(res=>{
   
            this.router.navigate(['/user-documents', res.emailAddress]);
            this.userService.user.emailAddress=res.emailAddress
            this.userService.user.userName=res.userName
            }
  )
 
  this.userService.onSignUpResponseEmailAddressExists().subscribe(
    
    res=>{this.message=res.request
      alert("Email Address Exists, please choose another email address");}
  )

  this.userService.onSignUpError().subscribe
  (
     message=>
     {console.log("Error",message)
     this.router.navigate(['']);

  }
  )

}

}

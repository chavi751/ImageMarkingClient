import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-un-subscribe',
  templateUrl: './un-subscribe.component.html',
  styleUrls: ['./un-subscribe.component.css']
})
export class UnSubscribeComponent implements OnInit {
  
    
  constructor(private userService:UserService,private router:Router,
    private route:ActivatedRoute) { }

  ngOnInit(): void {
    
    
    this.SubscribeOnSubjects() 
  }
  SubscribeOnSubjects(){
    this.userService.onRemoveRespnseOK().subscribe(res=>{
      this.router.navigate(['']);
      }) 
              
   
   this.userService.onRemoveUserIsNotExist().subscribe(res=>
    alert("The user no longer exists")
)

this.userService.onRemoveResponseError().subscribe
(
   message=>
   {console.log("Error",message)
   this.router.navigate(['']);
 }
)    

}
  
unsuscribe()
  {
    this.userService.unsubscribe({UserId:this.route.snapshot.paramMap.get('email')})
  }

}

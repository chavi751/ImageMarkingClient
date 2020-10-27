import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Marker } from '../DTO/marker';
import { MarkerService } from '../Services/marker.service';
import { SocketService } from '../Services/socket.service';

@Component({
  selector: 'app-markers-list',
  templateUrl: './markers-list.component.html',
  styleUrls: ['./markers-list.component.css']
})
export class MarkersListComponent implements OnInit {
  editMarker={id:null ,show:false}
  markers= new Array<Marker>()
  
  constructor(private socketService:SocketService,
    private markerService:MarkerService,private router:Router) { }

  ngOnInit(): void {
    
    this.markers=this.markerService.markers
     this.markerService.changedmarkers.subscribe(markers=>
     this.markers=markers)
     this.socketService.onSockeMarkerRemoved().subscribe(data=>
     this.responseRemoveMarker(data)
     )
    
      
    this.SubscribeOnSubjects() 
  }
  SubscribeOnSubjects(){
    this.markerService.onRemoveMarkerResponseOK().subscribe(data=>{
      this.responseRemoveMarker(data.markerId)              
   })
   
   this.markerService.onRemoveMarkerIsNotExist().subscribe(res=>
    alert("Marker Id Not Exists, please try again")
)

this.markerService.onRemoveResponseError().subscribe
(
   message=>
   {console.log("Error",message)
   this.router.navigate(['']);
 }
)    

}
  toggleEdit(show: boolean, documentId?: string)
  {
    this.editMarker.show = show;
    this.editMarker.id = documentId;

  }
  removeMarker(markerId:string)
  {
    this.markerService.removeMarker({MarkerId:markerId})
  }
  responseRemoveMarker(markerId:any){
    var markerIndex = this.markerService.markers.findIndex(x => x.markerId == markerId);
      if (markerIndex !== -1) {
          this.markerService.markers.splice(markerIndex, 1);
          this.markers=new Array<Marker>()
          this.markerService.changedmarkers.next(this.markerService.markers)}
      }
  }




import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Marker } from '../DTO/marker';
import { MarkerService } from '../Services/marker.service';
import { SocketService } from '../Services/socket.service';

@Component({
  selector: 'app-edit-marker',
  templateUrl: './edit-marker.component.html',
  styleUrls: ['./edit-marker.component.css']
})
export class EditMarkerComponent implements OnInit {

  @Input() MarkerId: string;
  @Output() onStopEdit = new EventEmitter();
  markerForm:FormGroup;
  currentMarker: Marker;
  markers=new Array<Marker>()

      
  constructor(private markerService:MarkerService,
    private socketService:SocketService) { }

  ngOnInit(): void {
    
    this.currentMarker = this.markerService.markers.find((m) => m.markerId == this.MarkerId);
    
    this.markerForm = new FormGroup({
      backColor: new FormControl(this.currentMarker.backColor, [Validators.required]),
      foreColor: new FormControl(this.currentMarker.foreColor, [Validators.required])
    })
      this.SubscribeOnSubjects() 
    }
    SubscribeOnSubjects(){
      this.markerService.onUpdateMarkerResponseOK().subscribe(data=>{
        this.currentMarker.foreColor=data.marker.foreColor
        this.currentMarker.backColor=data.marker.backColor
        this.markers=new Array<Marker>()
        this.markers=this.markerService.markers
        var markerIndex = this.markers.findIndex(x => x.markerId === data.marker.markerId);
        if (markerIndex !== -1) {
          this.markers.splice(markerIndex, 1);}
          this.markers.push(this.currentMarker)
            this.markerService.changedmarkers.next(this.markers)
            this.onStopEdit.next();})
  
              
     
      this.markerService.onUpdateMarkerResponseMarkerIdNotExists().subscribe(res=>
          alert("Marker Id Not Exists,you can try edit another marker")
      )
    
      this.markerService.onUpdateResponseError().subscribe
      (
         message=>
       {console.log("Error",message)
       }
      )
  }

  onSubmit() {
    if (!this.markerForm.valid) return;
    this.markerService.UpdateMarker({
        "markerId": this.currentMarker.markerId,
        "foreColor": this.markerForm.value.foreColor,
        "backColor":this.markerForm.value.backColor     
       
      })

}
  

}

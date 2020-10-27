import { ElementRef, Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { buffer, max, switchMap, takeUntil } from 'rxjs/operators';
import { Marker } from '../DTO/marker';
import { Point } from '../DTO/point';

@Injectable({
  providedIn: 'root'
})
export class DrawService {
  currentMode:string
  poly = new Subject<Point>() 
  markerChanged=new Subject<Marker>()
  marker:Marker
  mouseUp$:Observable<any>
  mousedown$:Observable<any>
  

     
  ModeSubjects:{[responseID:string]:Subject<any>}={
    Rect:new Subject<Array<Point>>(),
    Ellipse:new Subject<Array<Point>>(),
    FreeDraw:new Subject<any>()
  }

  constructor() { }
 

  drawShapeEllipse(shapePoly:Array<Point>,docid,mode,fcolor,bcolor,userid){
    
    var center = new Point(0,0)
    center = shapePoly.reduce((acc,pt)=>acc.add(pt))
    center = center.div(shapePoly.length)
    var radius  = new Point(0,0)
    radius = shapePoly.reduce((acc,pt)=>acc.add(new Point(Math.abs(pt.X-center.X),Math.abs(pt.Y-center.Y))))
    radius = radius.div(shapePoly.length)
    this.marker=new Marker(docid,mode,center.X,
    center.Y,radius.X,radius.Y,
    fcolor,bcolor,userid )
   
  }
 get onRecDraw(){
    return this.ModeSubjects.Rect
  }
 get onEllipseDraw(){
    return this.ModeSubjects.Ellipse 
  }
 get onFreeDraw(){
    return this.ModeSubjects.FreeDraw 
  }
  drawShapeRect(shapePoly:Array<Point>,docid,mode,fcolor,bcolor,userid){
    var topLeftY= Math.min.apply(Math, shapePoly.map(function(o) { return o.Y; }))
    var topLeftX= Math.min.apply(Math, shapePoly.map(function(o) { return o.X; }))
    var rightx= shapePoly.reduce(function(sum, pt1,i,pt2,){
      return i<pt2.length-1 && pt1.X > pt2[i+1].X ? sum += (pt1.X-pt2[i+1].X):sum}, 0);    
    var leftx=shapePoly.reduce(function(sum, pt1,i,pt2){
      return i<pt2.length-1 && pt1.X <= pt2[i+1].X ? sum += (pt2[i+1].X-pt1.X):sum}, 0); 
    var downy=shapePoly.reduce(function(sum, pt1,i,pt2){
      return i<pt2.length-1 && pt1.Y > pt2[i+1].Y? sum += (pt1.Y-pt2[i+1].Y):sum}, 0); 
    var upy=shapePoly.reduce(function(sum, pt1,i,pt2){
      return  i<pt2.length-1 && pt1.Y <= pt2[i+1].Y ? sum += (pt2[i+1].Y-pt1.Y):sum}, 0); 
      this.marker=new Marker(docid,mode,topLeftX,
      topLeftY,(rightx+leftx)/2,(downy+upy)/2,
      fcolor,bcolor,userid )
     
   
}

  btnEvent(btn:any){
    var drawBtn$ = fromEvent(btn.nativeElement,'click')  
  }
  
  // drawMode = false

  mouseDrawEvent(drawingCanvas:any){
  this.mouseUp$ = fromEvent(drawingCanvas.nativeElement,'mouseup')
  this.mousedown$ = fromEvent(drawingCanvas.nativeElement, 'mousedown')
  /*this.poly.pipe(
        
    buffer(mouseUp$),
     
  ).subscribe(shapePoly=>{this.clearCanvas();this.drawShape(shapePoly);})//this.clearCanvas();this.drawShape(shapePoly)})*/
 
  var draw$ = this.mousedown$.pipe(
  
  switchMap(event=>
    fromEvent(drawingCanvas.nativeElement,'mousemove').pipe(
      
      takeUntil(this.mouseUp$)
      
    ))
  ).subscribe(evt=>this.ModeSubjects["FreeDraw"].next(evt))
   }

   


   
  
}

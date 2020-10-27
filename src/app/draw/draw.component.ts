import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { buffer, takeUntil, switchMap } from 'rxjs/operators';
import { fromEvent, Subject, interval } from 'rxjs';
import { Point } from '../DTO/point';
import { DrawService } from '../Services/draw.service';
import { Marker } from '../DTO/marker';
import { MarkerService } from '../Services/marker.service';
import { myDocument } from '../DTO/my-document';
import { DocumentService } from '../Services/document.service';
import { SocketService } from '../Services/socket.service';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css']
})

export class DrawComponent implements OnInit {
  @ViewChild('shapeCanvas', { static: false }) shapeCanvas: ElementRef;
  @ViewChild('drawingCanvas', { static: false }) drawingCanvas: ElementRef;
  @ViewChild('btn', { static: false }) btn: ElementRef
  @ViewChild('btn2', { static: false }) btn2: ElementRef
  @ViewChild('btnCancel', { static: false }) btnCancel: ElementRef


  @Input() DocumentId: string;
  defaultBC = "#000000"
  defaultFC = "#000000"
  marker: Marker
  drawMode: string
  markers = new Array<Marker>()
  currentDocument: myDocument;

  DrawEllipse(ellipsePoint) {
    var ctx1 = this.shapeCanvas.nativeElement.getContext('2d')
    ctx1.beginPath();
    ctx1.ellipse(ellipsePoint.centerX, ellipsePoint.centerY,
      ellipsePoint.radiusX, ellipsePoint.radiusY, 0, 0, 2 * Math.PI);
    ctx1.fillStyle = ellipsePoint.backColor
    ctx1.strokeStyle = ellipsePoint.foreColor
    ctx1.fill();
    ctx1.stroke();

  }
  DrawRect(rectPoint) {
    var ctx1 = this.shapeCanvas.nativeElement.getContext('2d')
    ctx1.beginPath();
    ctx1.fillStyle = rectPoint.backColor
    ctx1.strokeStyle = rectPoint.foreColor
    ctx1.rect(rectPoint.centerX, rectPoint.centerY,
      rectPoint.radiusX + 1, rectPoint.radiusY + 1)
    ctx1.fillRect(rectPoint.centerX, rectPoint.centerY,
      rectPoint.radiusX, rectPoint.radiusY);
    ctx1.stroke();

  }


  constructor(private drawService: DrawService,
    private markerService: MarkerService,
    private documentService: DocumentService,
    private socketService: SocketService) { }

  ngOnInit(): void {
    this.markerService.changedmarkers.subscribe(markers => {
      this.clearShapeCanvas()
      this.markers = markers
      this.markers.forEach((m) => {
        this.drawShapeLikeMarkerType(m)
      })
    })

    this.currentDocument = this.documentService.documents.find((c) => c.DocumentId == this.DocumentId);
    this.markerService.getMarkers({ DocId: this.currentDocument.DocumentId })
    this.markerService.onGetMarkersResponseOK().subscribe(data => {
      this.clearShapeCanvas()

      this.markerService.markers.splice(0, this.markerService.markers.length)

      var length = data.markers.length;
      for (var i = 0; i < length; i++) {
        var marker = new Marker(
          data.markers[i].docId,
          data.markers[i].markerType,
          data.markers[i].centerX,
          data.markers[i].centerY,
          data.markers[i].radiusX,
          data.markers[i].radiusY,
          data.markers[i].foreColor,
          data.markers[i].backColor,
          data.markers[i].userId,
          data.markers[i].markerId
        )
        this.markerService.markers.push(marker)
        this.drawShapeLikeMarkerType(marker)

      }


    })
    this.socketService.onSocketMarkerCreated().subscribe(data =>
      this.markerService.getMarkers({ DocId: this.currentDocument.DocumentId }))
    this.socketService.onSocketMarkerUpdated().subscribe(data => {
      this.markerService.getMarkers({ DocId: this.currentDocument.DocumentId })
    })
    this.drawService.onFreeDraw.subscribe(evt =>
      this.FreeDraw(evt, this.drawingCanvas.nativeElement))

    this.drawService.onRecDraw.subscribe(shapePoly => {

      this.drawService.drawShapeRect(shapePoly,
        this.currentDocument.DocumentId, "Rect",
        this.defaultFC, this.defaultBC, this.currentDocument.UserID)
      var marker = this.drawService.marker
      this.markerService.createMarker({ RadiusX: marker.radiusX, RadiusY: marker.radiusY, CenterX: marker.centerX, CenterY: marker.centerY, MarkerType: marker.markerType, UserId: marker.userId, ForeColor: marker.foreColor, BackColor: marker.backColor, DocId: marker.docId })

    })
    this.markerService.onCreateResponseError().subscribe(data => console.log("error", data))
    this.markerService.onCreateMarkerResponseOK().subscribe(
      data => {

        this.drawShapeLikeMarkerType(data.marker)
        this.markerService.markers.push(data.marker)

      }
    )
    this.drawService.onEllipseDraw.subscribe(shapePoly => {

      this.drawService.drawShapeEllipse(shapePoly,
        this.currentDocument.DocumentId, "Ellipse",
        this.defaultFC, this.defaultBC, this.currentDocument.UserID)
      var marker = this.drawService.marker
      this.markerService.createMarker({ RadiusX: marker.radiusX, RadiusY: marker.radiusY, CenterX: marker.centerX, CenterY: marker.centerY, MarkerType: marker.markerType, UserId: marker.userId, ForeColor: marker.foreColor, BackColor: marker.backColor, DocId: marker.docId })

    })



    this.marker = this.drawService.marker
    this.drawService.markerChanged.subscribe((marker) => (this.marker = marker));
  }
  clearShapeCanvas() {
    var canvas = this.shapeCanvas.nativeElement
    var ctx2 = canvas.getContext('2d')
    ctx2.clearRect(0, 0, this.shapeCanvas.nativeElement.width, this.shapeCanvas.nativeElement.height);
  }
  clearDrawCanvas() {
    var canvas = this.drawingCanvas.nativeElement
    var ctx2 = canvas.getContext('2d')
    ctx2.clearRect(0, 0, this.drawingCanvas.nativeElement.width, this.drawingCanvas.nativeElement.height);
  }
  setModeDrawing(mode: string) {
    this.drawMode = mode

  }


  ngAfterViewInit() {


    this.shapeCanvas.nativeElement.width = 500
    this.shapeCanvas.nativeElement.height = 300

    this.drawingCanvas.nativeElement.width = 500
    this.drawingCanvas.nativeElement.height = 300

    var foreColor = fromEvent(document.querySelector("#foreColor"), 'input')
    var backColor = fromEvent(document.querySelector("#backColor"), 'input')

    foreColor.subscribe(evt => this.setForeColor((evt.target as HTMLInputElement).value))
    backColor.subscribe(evt => this.setBackColor((evt.target as HTMLInputElement).value))
    this.drawService.btnEvent(this.btn)

    this.drawService.mouseDrawEvent(this.drawingCanvas)


    this.drawService.poly.pipe(buffer(this.drawService.mouseUp$)).subscribe(shapePoly => {
      this.clearDrawCanvas()
      if (shapePoly.length < 1)
        return
      this.drawService.ModeSubjects[this.drawMode].next(shapePoly)
    })
  }
  setBackColor(value: string): void {
    this.defaultBC = value
  }
  setForeColor(value: string): void {
    this.defaultFC = value
  }




  ngOnDestroy(): void {

  }

  FreeDraw(evt, canvas1) {
    console.log(evt.movementX + ":" + evt.movementY)
    var canvas = canvas1
    var ctx2 = canvas.getContext('2d')
    var rect = canvas.getBoundingClientRect();
    var xcanvas = evt.clientX - rect.left
    var ycanvas = evt.clientY - rect.top
    var movX = xcanvas - evt.movementX
    var movY = ycanvas - evt.movementY
    ctx2.beginPath()
    ctx2.moveTo(movX, movY)
    ctx2.lineTo(xcanvas, ycanvas)
    ctx2.stroke()
    this.drawService.poly.next(new Point(movX, movY))
  }

  drawShapeLikeMarkerType(marker: Marker) {
    if (marker.markerType == "Rect")
      this.DrawRect(marker)
    if (marker.markerType == "Ellipse")
      this.DrawEllipse(marker)
  }




}






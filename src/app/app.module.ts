import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommService } from './Services/comm.service';
import { HttpCommService } from './Services/http-comm.service';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HttpClientModule } from '@angular/common/http';
import { DrawComponent } from './draw/draw.component';
import { UserDocumentsComponent } from './user-documents/user-documents.component';

import { UploadComponent } from './upload/upload.component';
import { CreateDocumentComponent } from './create-document/create-document.component';
import { EditDocumentComponent } from './edit-document/edit-document.component';
import { DeleteDocumentComponent } from './delete-document/delete-document.component';
import { ShareDocumentComponent } from './share-document/share-document.component';

import { LoginComponent } from './login/login.component';
import { AllSharesComponent } from './all-shares/all-shares.component';
import { EditMarkerComponent } from './edit-marker/edit-marker.component';
import { MarkersListComponent } from './markers-list/markers-list.component';
import { UnSubscribeComponent } from './un-subscribe/un-subscribe.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    DrawComponent,
    UserDocumentsComponent,
    UploadComponent,
    CreateDocumentComponent,
    
    EditDocumentComponent,
    
    DeleteDocumentComponent,
    
    ShareDocumentComponent,
    
    LoginComponent,
    
    AllSharesComponent,
    
    EditMarkerComponent,
    
    MarkersListComponent,
    
    UnSubscribeComponent,
    
      
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [{provide: CommService,useClass:HttpCommService}],
  bootstrap: [AppComponent]
})
export class AppModule { }

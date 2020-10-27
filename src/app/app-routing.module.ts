import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { UploadComponent } from './upload/upload.component';
import { CreateDocumentComponent } from './create-document/create-document.component';
import { UserDocumentsComponent } from './user-documents/user-documents.component';
import { LoginComponent } from './login/login.component';
import { AllSharesComponent } from './all-shares/all-shares.component';
import { DrawComponent } from './draw/draw.component';
import { UnSubscribeComponent } from './un-subscribe/un-subscribe.component';
import { EditDocumentComponent } from './edit-document/edit-document.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'signIn', component: SignInComponent },
  { path: 'unsubscribe/:email', component: UnSubscribeComponent },
  { path: 'all-shares/:docId', component: AllSharesComponent },
  { path: 'user-documents/:email', component: UserDocumentsComponent },
  { path: 'create', component: CreateDocumentComponent },
  { path: 'edit/:docId', component: EditDocumentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

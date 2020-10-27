import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDocument } from '../DTO/shared-documents';
import { ShareService } from '../Services/share.service';

@Component({
  selector: 'app-all-shares',
  templateUrl: './all-shares.component.html',
  styleUrls: ['./all-shares.component.css']
})
export class AllSharesComponent implements OnInit {

  constructor(private shareService: ShareService, private route: ActivatedRoute,
    private router: Router) { }
  docId: any
  shares = new Array<SharedDocument>()
  ngOnInit(): void {

    this.shareService.sharedDocumentsChanged.subscribe(shares => this.shares = shares)
    this.shareService
      .getShares({ DocId: this.route.snapshot.paramMap.get('docId') })
    this.SubscribeOnSubjects()
  }

  SubscribeOnSubjects() {

    this.shareService.onGetShareResponseOK().subscribe(data => {
      for (var i = 0; i < data.shares.length; i++) {
        var share = new SharedDocument(data.shares[i].userId, data.shares[i].docId)
        this.shares.push(share)
        this.shareService.sharedDocuments.push(share);
      }
    }
    )



    this.shareService.onGetSharesResponseNoShares().subscribe(res =>
      alert("There are no shares for this document")
    )

    this.shareService.onGetShareResponseError().subscribe
      (
        message => {
          console.log("Error", message)
          this.router.navigate(['']);
        }
      )
    this.shareService.onRemoveShareResponseOK().subscribe
      (
        data => {
          var share = new SharedDocument(data.share.userId,
            data.share.docId
          )
          var index = this.shareService.sharedDocuments.findIndex(x => x.UserId === share.UserId);
          if (index !== -1) {
            this.shares.splice(index, 1);
            this.shareService.sharedDocumentsChanged.next(this.shares);
          }

        }
      )
    this.shareService.onRemoveShareIsNotExist().subscribe(
      res =>
        alert("Share Is Not Exist")
    )
    this.shareService.onRemoveShareResponseError().subscribe
      (
        message => {
          console.log("Error", message)
          this.router.navigate(['']);
        }
      )
  }
  removeShare(UserId: string) {
    this.shareService
      .RemoveShare({
        UserId: UserId,
        DocId: this.route.snapshot.paramMap.get('docId')
      })

  }
}


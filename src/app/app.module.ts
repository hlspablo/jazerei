import { NgModule } from "@angular/core"
import { BrowserModule, Title } from "@angular/platform-browser"
import { provideFirebaseApp, initializeApp } from "@angular/fire/app"
import { getFirestore, provideFirestore } from "@angular/fire/firestore"
import { getAuth, provideAuth } from "@angular/fire/auth"
import { getStorage, provideStorage } from "@angular/fire/storage"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { environment } from "../environments/environment"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { provideEnvironmentNgxMask } from "ngx-mask"
import { ToastrModule } from "ngx-toastr"
import { MatDialogModule } from "@angular/material/dialog"
import { NgSelectModule } from "@ng-select/ng-select"

import { Router, NavigationEnd, ActivatedRoute } from "@angular/router"
import { filter, map } from "rxjs/operators"

@NgModule({
  declarations: [AppComponent],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    MatDialogModule,
    NgSelectModule,
  ],
  providers: [provideEnvironmentNgxMask()],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    const WEBSITE_TITLE = "Já Zerei"
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute
          while (route.firstChild) route = route.firstChild
          return route
        }),
        map((route) => route.snapshot.data["title"] || ""),
      )
      .subscribe((pageTitle) => {
        this.titleService.setTitle(pageTitle ? `${WEBSITE_TITLE} | ${pageTitle}` : WEBSITE_TITLE)
      })
  }
}

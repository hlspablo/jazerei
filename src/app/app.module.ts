import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { provideFirebaseApp, initializeApp } from "@angular/fire/app"
import { getFirestore, provideFirestore } from "@angular/fire/firestore"
import { getAuth, provideAuth } from "@angular/fire/auth"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { environment } from "../environments/environment"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { provideEnvironmentNgxMask } from "ngx-mask"

@NgModule({
  declarations: [AppComponent],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
  ],
  providers: [provideEnvironmentNgxMask()],
  bootstrap: [AppComponent],
})
export class AppModule {}

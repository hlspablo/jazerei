import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { provideFirebaseApp, initializeApp } from "@angular/fire/app"
import { getFirestore, provideFirestore } from "@angular/fire/firestore"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { environment } from "../environments/environment"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"

@NgModule({
  declarations: [AppComponent],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { provideFirebaseApp, initializeApp } from "@angular/fire/app"
import { getFirestore, provideFirestore } from "@angular/fire/firestore"
import { browserLocalPersistence, getAuth, provideAuth, setPersistence } from "@angular/fire/auth"
import { getStorage, provideStorage } from "@angular/fire/storage"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { environment } from "../environments/environment"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { provideEnvironmentNgxMask } from "ngx-mask"
import { ToastrModule } from "ngx-toastr"

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
  ],
  providers: [provideEnvironmentNgxMask()],
  bootstrap: [AppComponent],
})
export class AppModule {}

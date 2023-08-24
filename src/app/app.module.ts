import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { MatIconModule } from "@angular/material/icon"
import { ReactiveFormsModule } from "@angular/forms"

import { MatButtonModule } from "@angular/material/button"
import { MatDividerModule } from "@angular/material/divider"
import { provideFirebaseApp, initializeApp } from "@angular/fire/app"
import { getFirestore, provideFirestore } from "@angular/fire/firestore"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatAutocompleteModule } from "@angular/material/autocomplete"

import { AppRoutingModule } from "./app-routing.module"
import { HomeComponent } from "./pages/home/home.component"
import { AppComponent } from "./app.component"
import { MainNavComponent } from "./shared/components/main-nav/main-nav.component"
import { SlidingMenuComponent } from "./shared/components/sliding-menu/sliding-menu.component"
import { SubNavComponent } from "./shared/components/sub-nav/sub-nav.component"
import { SearchBarComponent } from "./shared/components/search-bar/search-bar.component"
import { environment } from "../environments/environment"

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainNavComponent,
    SlidingMenuComponent,
    SubNavComponent,
    SearchBarComponent,
  ],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

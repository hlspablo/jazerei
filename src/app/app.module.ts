import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"

import { AppRoutingModule } from "./app-routing.module"
import { HomeComponent } from "./pages/home/home.component"
import { AppComponent } from "./app.component"
import { MainNavComponent } from "./shared/components/main-nav/main-nav.component"
import { SlidingMenuComponent } from "./shared/components/sliding-menu/sliding-menu.component"

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainNavComponent,
    SlidingMenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

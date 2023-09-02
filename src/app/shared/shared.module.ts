import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatIconModule } from "@angular/material/icon"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { MatStepperModule } from "@angular/material/stepper"

import { MatButtonModule } from "@angular/material/button"
import { MatDividerModule } from "@angular/material/divider"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatAutocompleteModule } from "@angular/material/autocomplete"
import { MatCardModule } from "@angular/material/card"
import { MatDialogModule } from "@angular/material/dialog"
import { LoginDialogComponent } from "./components/login-dialog/login-dialog.component"
import { MainNavComponent } from "./components/main-nav/main-nav.component"
import { RegistrationDialogComponent } from "./components/registration-dialog/registration-dialog.component"
import { SearchBarComponent } from "./components/search-bar/search-bar.component"
import { SlidingMenuComponent } from "./components/sliding-menu/sliding-menu.component"
import { SubNavComponent } from "./components/sub-nav/sub-nav.component"
import { TextMessageDialogComponent } from "./components/text-message-dialog/text-message-dialog.component"
import { LocationSelectComponent } from "./components/location-select/location-select.component"
import { MatMenuModule } from "@angular/material/menu"
import { MatSelectModule } from "@angular/material/select"
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { GetFirstNamePipe } from "../pipes/getfirstname.pipe"
import { RouterModule } from "@angular/router"
import { GameCardComponent } from "./components/game-card/game-card.component"
import { NgSelectModule } from "@ng-select/ng-select"
import { EllipsisModule } from "ngx-ellipsis"

@NgModule({
  declarations: [
    LoginDialogComponent,
    MainNavComponent,
    RegistrationDialogComponent,
    SearchBarComponent,
    SlidingMenuComponent,
    SubNavComponent,
    TextMessageDialogComponent,
    LocationSelectComponent,
    GameCardComponent,
    GetFirstNamePipe,

  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCardModule,
    MatDialogModule,
    MatStepperModule,
    MatMenuModule,
    MatSelectModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatProgressSpinnerModule,
    NgSelectModule,
    EllipsisModule,
  ],
  exports: [
    LoginDialogComponent,
    MainNavComponent,
    RegistrationDialogComponent,
    SearchBarComponent,
    SlidingMenuComponent,
    SubNavComponent,
    TextMessageDialogComponent,
    GameCardComponent,
  ],
})
export class SharedModule {}

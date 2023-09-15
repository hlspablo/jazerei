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
import { LoginDialogComponent } from "./components/login-dialog/login-dialog.component"
import { MainNavComponent } from "./components/main-nav/main-nav.component"
import { RegistrationDialogComponent } from "./components/registration-dialog/registration-dialog.component"
import { SearchBarComponent } from "./components/search-bar/search-bar.component"
import { SlidingMenuComponent } from "./components/sliding-menu/sliding-menu.component"
import { SubNavComponent } from "./components/sub-nav/sub-nav.component"
import { ContatDialogComponent } from "./components/contact-dialog/contact-dialog.component"
import { LocationSelectComponent } from "./components/location-select/location-select.component"
import { MatMenuModule } from "@angular/material/menu"
import { MatSelectModule } from "@angular/material/select"
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { GetFirstNamePipe } from "../pipes/get-first-name.pipe"
import { RouterModule } from "@angular/router"
import { GameCardComponent } from "./components/game-card/game-card.component"
import { NgSelectModule } from "@ng-select/ng-select"
import { EllipsisModule } from "ngx-ellipsis"
import { GetFirstTwoNamesPipe } from "../pipes/get-first-two-names.pipe"
import { GetHumanTimePipe } from "../pipes/get-human-time.pipe"
import { RxIf } from "@rx-angular/template/if"
import { RxLet } from "@rx-angular/template/let"
import { RxFor } from "@rx-angular/template/for"
import { RxPush } from "@rx-angular/template/push"
import { TranslateConsolePipe } from "../pipes/translate-console.pipe"
import { MatDialogModule } from "@angular/material/dialog"

@NgModule({
  declarations: [
    LoginDialogComponent,
    MainNavComponent,
    RegistrationDialogComponent,
    SearchBarComponent,
    SlidingMenuComponent,
    SubNavComponent,
    ContatDialogComponent,
    LocationSelectComponent,
    GameCardComponent,
    GetFirstNamePipe,
    GetFirstTwoNamesPipe,
    GetHumanTimePipe,
    TranslateConsolePipe,
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
    MatStepperModule,
    MatMenuModule,
    MatSelectModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatProgressSpinnerModule,
    NgSelectModule,
    EllipsisModule,
    MatDialogModule,
    RxIf,
    RxLet,
    RxFor,
    RxPush,
  ],
  exports: [
    LoginDialogComponent,
    MainNavComponent,
    RegistrationDialogComponent,
    SearchBarComponent,
    SlidingMenuComponent,
    SubNavComponent,
    ContatDialogComponent,
    GameCardComponent,
    GetFirstTwoNamesPipe,
    GetFirstNamePipe,
    GetHumanTimePipe,
    TranslateConsolePipe,
    RxIf,
    RxLet,
    RxFor,
    RxPush,
  ],
})
export class SharedModule {}

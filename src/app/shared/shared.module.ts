import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatIconModule } from "@angular/material/icon"
import { ReactiveFormsModule } from "@angular/forms"
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

@NgModule({
  declarations: [
    LoginDialogComponent,
    MainNavComponent,
    RegistrationDialogComponent,
    SearchBarComponent,
    SlidingMenuComponent,
    SubNavComponent,
  ],
  imports: [
    CommonModule,
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
  ],
  exports: [
    LoginDialogComponent,
    MainNavComponent,
    RegistrationDialogComponent,
    SearchBarComponent,
    SlidingMenuComponent,
    SubNavComponent,
  ],
})
export class SharedModule {}

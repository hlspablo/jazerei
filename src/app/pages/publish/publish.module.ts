import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { PublishPageComponent } from "./publish.component"
import { SharedModule } from "src/app/shared/shared.module"
import { MainSectionComponent } from "./main-section/main-section.component"
import { PublishRoutingModule } from "./publish-routing.module"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatStepperModule } from "@angular/material/stepper"
import { ReactiveFormsModule } from "@angular/forms"
import { MatRadioModule } from "@angular/material/radio"

@NgModule({
  declarations: [PublishPageComponent, MainSectionComponent],
  imports: [
    CommonModule,
    PublishRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatRadioModule,
  ],
})
export class PublishPageModule {}
import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ProfilePageComponent } from "./profile.component"
import { MatCardModule } from "@angular/material/card"
import { SharedModule } from "src/app/shared/shared.module"
import { ProfileRoutingModule } from "./profile-routing.module"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"

@NgModule({
  declarations: [ProfilePageComponent],
  imports: [
    ProfileRoutingModule,
    CommonModule,
    MatCardModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class ProfilePageModule {}

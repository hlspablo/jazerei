import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"

import { MatCardModule } from "@angular/material/card"
import { HomePageComponent } from "./home.component"
import { SharedModule } from "src/app/shared/shared.module"
import { HomeRoutingModule } from "./home-routing.module"

@NgModule({
  declarations: [HomePageComponent],
  imports: [CommonModule, HomeRoutingModule, MatCardModule, SharedModule],
})
export class HomePageModule {}

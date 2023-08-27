import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"

import { MatCardModule } from "@angular/material/card"
import { HomePageComponent } from "./home.component"
import { SharedModule } from "src/app/shared/shared.module"
import { HomeMainSectionComponent } from "./main-section/main-section.component"
import { HomeRoutingModule } from "./home-routing.module"

@NgModule({
  declarations: [HomePageComponent, HomeMainSectionComponent],
  imports: [CommonModule, HomeRoutingModule, MatCardModule, SharedModule],
})
export class HomePageModule {}

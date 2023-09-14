import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"

import { MatCardModule } from "@angular/material/card"
import { SharedModule } from "src/app/shared/shared.module"
import { MyGamesPageComponent } from "./my-games.component"
import { MyGamesRoutingModule } from "./my-games-routing.module"

@NgModule({
  declarations: [MyGamesPageComponent],
  imports: [CommonModule, MyGamesRoutingModule, MatCardModule, SharedModule],
})
export class MyGamesPageModule {}

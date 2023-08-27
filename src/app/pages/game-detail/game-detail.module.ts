import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { GameDetailPageComponent } from "./game-detail.component"
import { MatCardModule } from "@angular/material/card"
import { SharedModule } from "src/app/shared/shared.module"
import { MainSectionComponent } from "./main-section/main-section.component"
import { GameDetailRoutingModule } from "./game-detail-routing.module"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"

@NgModule({
  declarations: [GameDetailPageComponent, MainSectionComponent],
  imports: [
    GameDetailRoutingModule,
    CommonModule,
    MatCardModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class GameDetailPageModule {}

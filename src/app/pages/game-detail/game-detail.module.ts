import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { GameDetailPageComponent } from "./game-detail.component"
import { MatCardModule } from "@angular/material/card"
import { SharedModule } from "src/app/shared/shared.module"
import { MainSectionComponent } from "./main-section/main-section.component"

@NgModule({
  declarations: [GameDetailPageComponent, MainSectionComponent],
  imports: [CommonModule, MatCardModule, SharedModule],
})
export class GameDetailPageModule {}

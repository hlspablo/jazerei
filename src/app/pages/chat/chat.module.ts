import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ChatPageComponent } from "./chat.component"
import { MatCardModule } from "@angular/material/card"
import { SharedModule } from "src/app/shared/shared.module"
import { MainSectionComponent } from "./main-section/main-section.component"
import { ChatRoutingModule } from "./chat-routing.module"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"

@NgModule({
  declarations: [ChatPageComponent, MainSectionComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class ChatPageModule {}

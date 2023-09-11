import { Component, inject } from "@angular/core"
import { FormBuilder, Validators } from "@angular/forms"
import { GameFirebaseRow } from "../../interfaces/app.interface"
import { MAT_DIALOG_DATA } from "@angular/material/dialog"
import { ChatService } from "src/app/services/chat.service"

@Component({
  selector: "app-text-message-dialog",
  templateUrl: "./text-message-dialog.component.html",
  styleUrls: ["./text-message-dialog.component.scss"],
})
export class TextMessageDialogComponent {
  private fb = inject(FormBuilder)
  protected gameData: {
    game: GameFirebaseRow
  } = inject(MAT_DIALOG_DATA)
  private chatService = inject(ChatService)

  protected textMessageForm = this.fb.group({
    message: ["", Validators.required],
  })

  async onSubmit(): Promise<void> {
    if (this.textMessageForm.valid) {
      const message = this.textMessageForm.get("message")?.value
      //console.log("[onSubmit]", this.gameData.game)
      this.chatService.createChatRoom(
        this.gameData.game.ownerId!,
        this.gameData.game.id!,
        this.gameData.game.name!,
        message!,
      )
    }
  }
}

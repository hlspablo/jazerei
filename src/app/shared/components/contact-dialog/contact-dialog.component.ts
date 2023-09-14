import { Component, inject } from "@angular/core"
import { Validators, NonNullableFormBuilder } from "@angular/forms"
import { GameFirebaseRow } from "../../interfaces/app.interface"
import { MAT_DIALOG_DATA } from "@angular/material/dialog"
import { ChatService } from "src/app/services/chat.service"
import { ToastrService } from "ngx-toastr"
import { Dialog } from "@angular/cdk/dialog"

@Component({
  selector: "app-contact-dialog",
  templateUrl: "./contact-dialog.component.html",
  styleUrls: ["./contact-dialog.component.scss"],
})
export class ContatDialogComponent {
  private _fb = inject(NonNullableFormBuilder)
  private _chatService = inject(ChatService)
  private _toast = inject(ToastrService)
  private _dialogService = inject(Dialog)

  protected game: GameFirebaseRow = inject(MAT_DIALOG_DATA)
  protected contactForm = this._fb.group({
    message: ["", Validators.required],
  })

  async onSubmit(): Promise<void> {
    if (this.contactForm.valid) {
      const message = this.contactForm.get("message")?.value as string
      try {
        await this._chatService.createChatRoom(
          this.game.ownerId,
          this.game.id,
          this.game.name,
          message,
        )

        this._toast.success("Mensagem enviada com sucesso!")
        this._dialogService.closeAll()
      } catch (error) {
        console.error(error)
      }
    }
  }
}

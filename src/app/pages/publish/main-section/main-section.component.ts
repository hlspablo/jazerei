import { Component, OnInit, inject } from "@angular/core"
import { NonNullableFormBuilder, Validators } from "@angular/forms"
import { Observable, map, withLatestFrom } from "rxjs"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { ToastrService } from "ngx-toastr"
import { Router } from "@angular/router"
import { sleepFor } from "src/app/utils/time.utils"
import { GameRepository } from "src/app/repositories/game.repository"
import { RxState } from "@rx-angular/state"
import { GameCardInput } from "src/app/shared/components/game-card/game-card.component"
import { AuthService } from "src/app/services/auth.service"

interface PublishState {
  publishGame: GameCardInput
}

@Component({
  selector: "app-publish-main-section",
  templateUrl: "./main-section.component.html",
  styleUrls: ["./main-section.component.scss"],
  providers: [RxState],
})
export class MainSectionComponent implements OnInit {
  private _fb = inject(NonNullableFormBuilder)
  private _breakpointService = inject(BreakpointService)
  private _toastr = inject(ToastrService)
  private _router = inject(Router)
  private _gameRepository = inject(GameRepository)
  private _authService = inject(AuthService)

  protected fileNames: string
  protected selectedFiles: File[] = []
  protected imagePreview: string | ArrayBuffer | null = "https://placehold.co/600x400"
  protected isLoading = false
  protected isHandsetOrSmall: Observable<boolean>
  protected game$ = this._state.select("publishGame")

  protected publishForm = this._fb.group({
    stepOne: this._fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      usedTime: ["", Validators.required],
      consoleModel: ["", Validators.required],
    }),
    stepTwo: this._fb.group({
      fileData: ["", Validators.required],
    }),
    stepThree: true,
  })

  constructor(private _state: RxState<PublishState>) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files) {
      this.selectedFiles = Array.from(input.files) // Convert FileList to an array

      if (this.selectedFiles.length > 0) {
        const firstFile = this.selectedFiles[0]
        const reader = new FileReader()
        reader.onload = () => {
          this.imagePreview = reader.result
        }
        reader.readAsDataURL(firstFile)
        this.publishForm.patchValue({
          stepTwo: {
            fileData: firstFile.name,
          },
        })
      }
    }
  }

  async submit() {
    if (this.publishForm.valid) {
      this.isLoading = true
      try {
        const values = this.publishForm.value
        if (values) {
          const { stepOne, stepTwo } = values
          if (stepOne && stepTwo) {
            const { name, description, consoleModel, usedTime } = stepOne
            if (!name || !description || !consoleModel || !usedTime) return
            const imagesUrls = await this._gameRepository.uploadGameImages(this.selectedFiles)

            this._gameRepository.createGame({
              name,
              consoleModel,
              description,
              imagesUrls,
              usedTime,
            })

            await sleepFor(500)
            this._toastr.success("O Anúncio do seu jogo foi publicado.", "Sucesso!")
            this._router.navigate(["/"])
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    }
  }

  async ngOnInit() {
    this.isHandsetOrSmall = this._breakpointService.isHandsetOrSmall()

    const user = await this._authService.getCurrentUserSnapshot()
    this._state.set("publishGame", (_) => ({
      id: "",
      name: "",
      description: "",
      consoleModel: "",
      usedTime: "",
      imagesUrls: [],
      owner: user?.displayName || "",
      ownerId: user?.uid || "",
    }))

    this._state.connect(
      "publishGame",
      this.publishForm.valueChanges.pipe(
        withLatestFrom(this._state.select("publishGame")),
        map(([formValues, game]) => {
          const { stepOne } = formValues
          return {
            ...game,
            ...(stepOne?.name ? { name: stepOne.name } : {}),
            ...(stepOne?.description ? { description: stepOne.description } : {}),
            ...(stepOne?.consoleModel ? { consoleModel: stepOne.consoleModel } : {}),
            ...(stepOne?.usedTime ? { usedTime: stepOne.usedTime } : {}),
          }
        }),
      ),
    )
  }
}

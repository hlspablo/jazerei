import { Component, OnInit, inject } from "@angular/core"
import { NonNullableFormBuilder, Validators } from "@angular/forms"
import { Observable, map } from "rxjs"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { GameFirebaseRow } from "src/app/shared/interfaces/app.interface"
import { ToastrService } from "ngx-toastr"
import { Router } from "@angular/router"
import { sleepFor } from "src/app/utils/time.utils"
import { RxEffects } from "@rx-angular/state/effects"
import { GameRepository } from "src/app/repositories/game.repository"
import { RxState } from "@rx-angular/state"
import { selectSlice } from "@rx-angular/state/selections"

interface PublishState {
  publishGame: Partial<GameFirebaseRow>
}

@Component({
  selector: "app-publish-main-section",
  templateUrl: "./main-section.component.html",
  styleUrls: ["./main-section.component.scss"],
  providers: [RxEffects, RxState],
})
export class MainSectionComponent implements OnInit {
  private _fb = inject(NonNullableFormBuilder)
  private _breakpointService = inject(BreakpointService)
  private _toastr = inject(ToastrService)
  private _router = inject(Router)
  private _gameRepository = inject(GameRepository)

  protected fileNames: string
  protected selectedFiles: File[] = []
  protected imagePreview: string | ArrayBuffer | null = "https://placehold.co/600x400"
  protected isLoading = false
  protected isHandsetOrSmall: Observable<boolean>
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

  protected game$ = this._state.select("publishGame")

  constructor(
    private _rxEffect: RxEffects,
    private _state: RxState<PublishState>,
  ) {
    this._state.connect(
      "publishGame",
      this.publishForm.valueChanges.pipe(
        map((formValues) => {
          // id: string
          // name: string
          // description: string
          // owner: string
          // ownerId: string
          // imagesUrls: string[]
          // consoleModel: string
          console.log(formValues)
          return {
            name: formValues.stepOne?.name,
            description: formValues.stepOne?.description,
            consoleModel: formValues.stepOne?.consoleModel,
          }
        }),
      ),
    )
    this._rxEffect.register(this.game$, (value) => console.log("[Game]", value))
  }

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

  ngOnInit() {
    this.isHandsetOrSmall = this._breakpointService.isHandsetOrSmall()
  }
}

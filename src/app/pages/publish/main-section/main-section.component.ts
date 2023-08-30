import { Component, OnInit, inject } from "@angular/core"
import { FormBuilder, Validators } from "@angular/forms"
import { Observable } from "rxjs"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { GameInfo } from "src/app/shared/interfaces/game.interface"

@Component({
  selector: "app-publish-main-section",
  templateUrl: "./main-section.component.html",
  styleUrls: ["./main-section.component.scss"],
})
export class MainSectionComponent implements OnInit {
  private fb = inject(FormBuilder)
  private breakpointService = inject(BreakpointService)
  protected fileName: string
  private selectedFile: File
  imagePreview: string | ArrayBuffer | null = "https://placehold.co/600x400"
  gameInfo: Partial<GameInfo>

  protected showHamburgerMenu: Observable<boolean>
  protected publishForm = this.fb.group({
    stepOne: this.fb.group({
      gameName: ["", Validators.required],
      description: ["", Validators.required],
      usedTime: ["", Validators.required],
      platform: [null, Validators.required],
    }),
    stepTwo: this.fb.group({
      fileData: ["", Validators.required],
    }),
    stepThree: true,
  })

  mapFormToGameInfo(value: typeof this.publishForm.value): void {
    const stepOne = value.stepOne
    const stepTwo = value.stepTwo
    if (!stepOne || !stepTwo) return

    this.gameInfo = {
      ...this.gameInfo,
      gameTitle: stepOne.gameName || "Default Game Title",
      gameDescription: stepOne.description || "Default Description",
      gamePlatform: stepOne.platform || "Default Platform",
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement

    if (input.files && input.files[0]) {
      this.fileName = input.files[0].name
      this.selectedFile = input.files[0]

      const reader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result
      }
      reader.readAsDataURL(this.selectedFile)

      // Optionally update form group if you want to keep some file info
      this.publishForm.patchValue({
        stepTwo: {
          fileData: this.selectedFile.name,
        },
      })
    }
  }

  submit() {
    console.log("Submitting registration form")
    if (this.publishForm.valid) {
      const values = this.publishForm.value
      console.log("Registration data:", values)
      // Handle submission logic here
    }
  }

  ngOnInit() {
    this.gameInfo = {}

    this.showHamburgerMenu = this.showHamburgerMenu =
      this.breakpointService.isHandsetOrSmall()

    this.publishForm.valueChanges.subscribe((value) => {
      this.mapFormToGameInfo(value)
    })
  }
}

import { Component, OnInit, inject } from "@angular/core"
import { FormBuilder, Validators } from "@angular/forms"
import { Observable } from "rxjs"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { GameInfo } from "src/app/shared/interfaces/game.interface"
import {
  Storage,
  uploadBytesResumable,
  getDownloadURL,
  ref,
} from "@angular/fire/storage"
import { Firestore, collection, addDoc } from "@angular/fire/firestore"

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
  private storage = inject(Storage)
  private firestore = inject(Firestore)

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

  uploadFile(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const filePath = `${this.selectedFile.name}_${new Date().getTime()}`
      const storageRef = ref(this.storage, filePath)

      const uploadTask = uploadBytesResumable(storageRef, this.selectedFile)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log("Upload is " + progress + "% done")
        },
        (error) => {
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
          })
        },
      )
    })
  }

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

  async submit() {
    if (this.publishForm.valid) {
      const values = this.publishForm.value
      if (values) {
        const { stepOne, stepTwo } = values
        if (stepOne && stepTwo) {
          const { gameName, description, platform, usedTime } = stepOne
          // const { fileData } = stepTwo

          const imageUrl = await this.uploadFile()

          await addDoc(collection(this.firestore, "games"), {
            gameName,
            description,
            platform,
            usedTime,
            approved: false,
            imageUrl,
          })
        }
      }
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

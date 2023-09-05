import { Component, OnInit, inject } from "@angular/core"
import { FormBuilder, Validators } from "@angular/forms"
import { Observable } from "rxjs"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { GameInfo } from "src/app/shared/interfaces/app.interface"
import { Storage, uploadBytesResumable, getDownloadURL, ref } from "@angular/fire/storage"
import { Firestore, collection, addDoc } from "@angular/fire/firestore"
import { translatePlatform } from "src/app/utils/game.translate"
import { AuthService } from "src/app/services/auth.service"
import { User } from "@angular/fire/auth"
import { getFirstTwoNames } from "src/app/utils/string.utils"
import { ToastrService } from "ngx-toastr"
import { Router } from "@angular/router"
import { sleepFor } from "src/app/utils/time.utils"

@Component({
  selector: "app-publish-main-section",
  templateUrl: "./main-section.component.html",
  styleUrls: ["./main-section.component.scss"],
})
export class MainSectionComponent implements OnInit {
  private fb = inject(FormBuilder)
  private breakpointService = inject(BreakpointService)
  imagePreview: string | ArrayBuffer | null = "https://placehold.co/600x400"
  gameInfo: Partial<GameInfo>
  private storage = inject(Storage)
  private firestore = inject(Firestore)
  private toastr = inject(ToastrService)
  private router = inject(Router)

  protected fileNames: string
  protected selectedFiles: File[] = []

  private authService = inject(AuthService)
  protected currentUser: User | null
  protected isLoading = false

  protected showHamburgerMenu: Observable<boolean>
  protected publishForm = this.fb.group({
    stepOne: this.fb.group({
      gameName: ["", Validators.required],
      gameDescription: ["", Validators.required],
      usedTime: ["", Validators.required],
      gamePlatform: [null, Validators.required],
    }),
    stepTwo: this.fb.group({
      fileData: ["", Validators.required],
    }),
    stepThree: true,
  })

  uploadFiles(selectedFiles: File[]): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      let uploadCount = 0
      const downloadURLs: string[] = []

      selectedFiles.forEach((file, index) => {
        const filePath = `${file.name}_${new Date().getTime()}_${index}`
        const storageRef = ref(this.storage, filePath)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log(`Upload of ${file.name} is ${progress}% done`)
          },
          (error) => {
            reject(error)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              downloadURLs.push(downloadURL)
              uploadCount++

              if (uploadCount === selectedFiles.length) {
                resolve(downloadURLs)
              }
            })
          },
        )
      })
    })
  }

  updateGameOwner(): void {
    console.log("Called updateAvatarUrl")
    this.gameInfo = {
      ...this.gameInfo,
      gameOwner: this.getDisplayName(),
    }
  }

  mapFormToGameInfo(value: typeof this.publishForm.value): void {
    const stepOne = value.stepOne
    const stepTwo = value.stepTwo
    if (!stepOne || !stepTwo) return

    this.gameInfo = {
      ...this.gameInfo,
      gameName: stepOne.gameName || "Default Game Title",
      gameDescription: stepOne.gameDescription || "Default Description",
      gamePlatform: stepOne.gamePlatform || "Default Platform",
    }
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

  getDisplayName(): string {
    return getFirstTwoNames(this.currentUser?.displayName) || ""
  }

  async submit() {
    if (this.publishForm.valid) {
      this.isLoading = true
      try {
        const values = this.publishForm.value
        if (values) {
          const { stepOne, stepTwo } = values
          if (stepOne && stepTwo) {
            const { gameName, gameDescription, gamePlatform, usedTime } = stepOne

            const imagesUrls = await this.uploadFiles(this.selectedFiles)

            await addDoc(collection(this.firestore, "games"), {
              gameName,
              gameOwner: this.getDisplayName(),
              gameOwnerId: this.currentUser?.uid,
              gameDescription,
              gamePlatform: translatePlatform(gamePlatform),
              usedTime,
              approved: false,
              imagesUrls,
            })
            this.toastr.success("O Anúncio do seu jogo foi publicado.", "Sucesso!")
            // await one second to show the success message
            await sleepFor(500)
            this.router.navigate(["/"])
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
    this.gameInfo = {}

    this.showHamburgerMenu = this.showHamburgerMenu = this.breakpointService.isHandsetOrSmall()

    this.publishForm.valueChanges.subscribe((value) => {
      this.mapFormToGameInfo(value)
    })

    this.currentUser = this.authService.getCachedUser()
    this.updateGameOwner()
    this.authService.user$.subscribe((user) => {
      this.currentUser = user
      this.updateGameOwner()
    })
  }
}

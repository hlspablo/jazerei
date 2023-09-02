import { Component, OnInit, inject } from "@angular/core"
import { FormControl, NonNullableFormBuilder, Validators } from "@angular/forms"
import { AuthService } from "src/app/services/auth.service"
import { cpfValidator } from "./cpf.validator"
import { registerErrorTranslate } from "src/app/utils/firebase.translate"
import { MatDialog } from "@angular/material/dialog"
import { sleepFor } from "src/app/utils/time.utils"
import { Firestore, collection, collectionData, query, where } from "@angular/fire/firestore"
import { Observable, Subject, debounceTime, startWith, switchMap } from "rxjs"
import { MyLocation } from "../../interfaces/app.interface"

@Component({
  selector: "app-registration-dialog",
  templateUrl: "./registration-dialog.component.html",
  styleUrls: ["./registration-dialog.component.scss"],
})
export class RegistrationDialogComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder)
  private authService = inject(AuthService)
  private matDialog = inject(MatDialog)
  private firestore = inject(Firestore)
  protected registerErrorMessage = ""
  protected isLoading = false

  searchControl = new FormControl()
  searchTerms = new Subject<string>()
  private locationCollection = collection(this.firestore, "locations")
  protected locations$: Observable<MyLocation[]>

  onSearch(event: { term: string }) {
    const searchTerm = event.term
    this.searchTerms.next(searchTerm)
    console.log("Search term:", searchTerm)
  }

  protected registrationForm = this.fb.group({
    stepOne: this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    }),
    stepTwo: this.fb.group({
      name: ["", Validators.required],
      cpf: ["", [Validators.required, cpfValidator]],
    }),
  })

  private loadLocationsFromFirebase(term: string): Observable<MyLocation[]> {
    if (!term || term.trim() === "") {
      return new Observable((observer) => {
        observer.next([])
        observer.complete()
      })
    }
    const locationQuery = query(this.locationCollection, where("name", ">=", term), where("name", "<=", term + "\uf8ff"))
    const locationData$ = collectionData(locationQuery, { idField: "id" }) as Observable<MyLocation[]>

    // For debugging: Subscribe to the observable to see the data
    locationData$.subscribe(
      (data) => {
        console.log("Data received:", data)
      },
      (error) => {
        console.log("Error:", error)
      },
    )

    return locationData$
  }

  async submit() {
    console.log("Submitting registration form")
    if (this.registrationForm.valid) {
      const values = this.registrationForm.value
      if (values) {
        try {
          this.registerErrorMessage = ""
          this.isLoading = true
          await this.authService.register({
            email: values.stepOne?.email || "",
            password: values.stepOne?.password || "",
            name: values.stepTwo?.name || "",
            cpf: values.stepTwo?.cpf || "",
          })
          await sleepFor(500)
          this.matDialog.closeAll()
        } catch (error) {
          this.registerErrorMessage = registerErrorTranslate(error)
        } finally {
          this.isLoading = false
        }
      }
    }
  }

  ngOnInit(): void {
    this.locations$ = this.searchTerms.pipe(
      startWith(""),
      debounceTime(300), // Wait for 300ms pause in events
      switchMap((term: string) => this.loadLocationsFromFirebase(term)),
    )
  }
}

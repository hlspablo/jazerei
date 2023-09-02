import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from "@angular/core"
import { NonNullableFormBuilder, Validators } from "@angular/forms"
import { AuthService } from "src/app/services/auth.service"
import { cpfValidator } from "./cpf.validator"
import { registerErrorTranslate } from "src/app/utils/firebase.translate"
import { MatDialog } from "@angular/material/dialog"
import { sleepFor } from "src/app/utils/time.utils"
import { Firestore, collection, collectionData, query, where } from "@angular/fire/firestore"
import { Observable, Subject, debounceTime, startWith, switchMap } from "rxjs"
import { MyLocation } from "../../interfaces/app.interface"
import { removeDiacritics } from "src/app/utils/string.utils"

@Component({
  selector: "app-registration-dialog",
  templateUrl: "./registration-dialog.component.html",
  styleUrls: ["./registration-dialog.component.scss"],
})
export class RegistrationDialogComponent implements OnInit, AfterViewInit {
  private fb = inject(NonNullableFormBuilder)
  private authService = inject(AuthService)
  private matDialog = inject(MatDialog)
  private firestore = inject(Firestore)
  protected registerErrorMessage = ""
  protected isLoading = false

  searchTerms = new Subject<string>()
  private locationCollection = collection(this.firestore, "locations")
  protected locations$: Observable<MyLocation[]>

  @ViewChild('emailInput') emailInput: ElementRef;

  ngAfterViewInit() {
    console.log(this.emailInput)
    setTimeout(() => {
      this.emailInput.nativeElement.focus();
    }, 300);
  }

  onSearch(event: { term: string }) {
    const searchTerm = event.term
    const preparedSearchTerm = removeDiacritics(searchTerm.trim().toLowerCase())
    this.searchTerms.next(preparedSearchTerm)
  }

  protected registrationForm = this.fb.group({
    stepOne: this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    }),
    stepTwo: this.fb.group({
      name: ["", Validators.required],
      cpf: ["", [Validators.required, cpfValidator]],
      selectedLocation: [null, Validators.required],
    }),
  })

  private loadLocationsFromFirebase(term: string): Observable<MyLocation[]> {
    if (!term || term.trim() === "") {
      return new Observable((observer) => {
        observer.next([])
        observer.complete()
      })
    }
    const locationQuery = query(this.locationCollection, where("name_lowercase", ">=", term), where("name_lowercase", "<=", term + "\uf8ff"))
    const locationData$ = collectionData(locationQuery, { idField: "id" }) as Observable<MyLocation[]>

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
            location: values.stepTwo?.selectedLocation || "",
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

import { match } from "ts-pattern"

interface FirebaseError {
  code: string
}

export function getErrorTranslate(error: unknown) {
  const firebaseError = error as FirebaseError
  const errorCode = firebaseError.code
  return match(errorCode)
    .with("auth/user-not-found", () => "Usuário não encontrado.")
    .with("auth/invalid-email", () => "Email inválido.")
    .with("auth/user-disabled", () => "Conta de usuário desativada.")
    .with("auth/wrong-password", () => "Senha incorreta.")
    .with(
      "auth/too-many-requests",
      () => "Muitas tentativas de login. Tente novamente mais tarde.",
    )
    .otherwise(() => "Ocorreu um erro desconhecido.")
}

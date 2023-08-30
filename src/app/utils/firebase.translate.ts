import { match } from "ts-pattern"

interface FirebaseError {
  code: string
}

export function loginErrorTranslate(error: unknown) {
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

export function registerErrorTranslate(error: unknown) {
  const firebaseError = error as FirebaseError
  const errorCode = firebaseError.code
  return match(errorCode)
    .with(
      "auth/email-already-in-use",
      () => "O email já está em uso por outra conta.",
    )
    .with("auth/invalid-email", () => "Email inválido.")
    .with("auth/operation-not-allowed", () => "Operação não permitida.")
    .with("auth/weak-password", () => "A senha é muito fraca.")
    .otherwise(() => "Ocorreu um erro desconhecido.")
}

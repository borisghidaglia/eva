// Errors can't be declared directly in the server actions because of the Next.js error:
// "Only async functions are allowed to be exported in a "use server" file."

export class EmailAndPasswordRequiredError extends Error {}
export class EmailRequiredError extends Error {}
export class FailedToCreateUserError extends Error {}
export class FailedToStoreTokenInDbError extends Error {}
export class LoginDidntRedirectError extends Error {}
export class NoAccessTokenError extends Error {}

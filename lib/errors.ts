// Errors can't be declared directly in the server actions because of the Next.js error:
// "Only async functions are allowed to be exported in a "use server" file."

// login.ts
// new-password.ts
export class EmailAndPasswordRequiredError extends Error {}
export class LoginDidntRedirectError extends Error {}
export class NoAccessTokenError extends Error {}

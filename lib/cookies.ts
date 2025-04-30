import "server-only";

import { cookies } from "next/headers";

const accessTokenCookieName = "aws-cognito-access-token";
const challengeSessionCookieName = "aws-cognito-challenge-session";

export async function setAccessTokenCookie(
  accessToken: string,
  expiresIn: number,
) {
  const cookieStore = await cookies();
  const expires = new Date(Date.now() + expiresIn * 1000);
  cookieStore.set(accessTokenCookieName, accessToken, {
    expires,
    secure: true,
    sameSite: "lax",
  });
}

export const getAccessTokenCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(accessTokenCookieName)?.value;
};

export const getChallengeSessionCookie = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(challengeSessionCookieName)?.value;
};

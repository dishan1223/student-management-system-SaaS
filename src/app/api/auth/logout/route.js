// /app/api/auth/logout/route.js
export async function POST() {
  return new Response("Logged out", {
    status: 200,
    headers: {
      "Set-Cookie": `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`,
    },
  });
}

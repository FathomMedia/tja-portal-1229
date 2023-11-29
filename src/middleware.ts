import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { availableLocales } from "./config";

// export const config = {
//   matcher: [
//     // Skip all internal paths (_next)
//     "/((?!_next|authentication|assets).*)",
//     // Optional: only run on root (/) URL
//     // '/'
//   ],
// };

// export default createMiddleware({
//   // A list of all locales that are supported
//   locales: availableLocales,

//   // Used when no locale matches
//   defaultLocale: "en",

// } );

// export async function middleware(request: NextRequest) {
//   const handleI18nRouting = createMiddleware({
//     locales: availableLocales,
//     defaultLocale: availableLocales[0],
//   });
//   const res: NextResponse = handleI18nRouting(request);

//   const token = request.cookies.get("authToken");
//   const authPath = `/authentication`;

//   //* Uncomment if you make auth
//   if (!token) {
//     // Handle unauthenticated access
//     return NextResponse.redirect(new URL(authPath, request.nextUrl));
//   }

//   // Verify the token...

//   return res;
// }
export async function middleware(request: NextRequest) {
  const [, locale, pathname] = request.nextUrl.pathname.split("/");

  //* Uncomment if you make auth
  const authPath = `authentication`;
  if (pathname !== authPath) {
    const token = request.cookies.get("authToken");
    if (!token) {
      request.nextUrl.pathname = `${locale}/${authPath}`;
    }
  }

  const handleI18nRouting = createMiddleware({
    locales: availableLocales,
    defaultLocale: availableLocales[0],
  });
  const res: NextResponse = handleI18nRouting(request);

  return res;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ar|en)/:path*"],
};

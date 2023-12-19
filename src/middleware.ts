import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { availableLocales } from "./config";
import { TUser } from "./lib/types";

export async function middleware(request: NextRequest) {
  const { pathname, locale, origin } = request.nextUrl;
  // handle route if valid user
  var currentLocale = availableLocales[0];
  availableLocales.some((someLocale) => {
    const isMatching = locale === someLocale;
    if (isMatching) {
      // sets the someLocale found in the URL
      currentLocale = someLocale;
    }
    return isMatching;
  });

  if (!currentLocale || currentLocale === "") {
    currentLocale = availableLocales[0];
  }

  const authPath = `authentication`;
  if (pathname !== authPath) {
    const token = request.cookies.get("authToken");

    // check if there is a token
    if (!token) {
      // redirect to auth if no token
      request.nextUrl.pathname = `${currentLocale}/${authPath}`;
    } else {
      // get the user of the current token
      const resUserProfile = await fetch(`${origin}/api/user/get-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept-language": currentLocale,
        },
        body: JSON.stringify({ token: token.value }),
      });
      // check if there is a user with the provided token
      if (resUserProfile.ok) {
        const jsonData = await resUserProfile.json();
        const data: TUser = jsonData?.data;
        // check if the user is verified
        if (!data.verified) {
          // redirect to verify email if not verified
          request.nextUrl.pathname = `${currentLocale}/${authPath}/verify-email`;
        } else {
          // Admins should not access dashboard pages and non-admins should not access admin pages
          if (data.role === "Admin") {
            if (pathname?.includes(`${locale}/dashboard`)) {
              request.nextUrl.pathname = `/${currentLocale}/admin`;
            }
          } else {
            if (pathname?.includes(`${locale}/admin`)) {
              request.nextUrl.pathname = `/${currentLocale}/dashboard`;
            }
          }

          // Redirect to the home page for empty pathname
          if (!pathname || pathname === "/") {
            request.nextUrl.pathname = `/${currentLocale}/${
              data.role === "Admin" ? "admin" : "dashboard"
            }`;
          }
        }
      } else {
        // if server is down
        if (resUserProfile.status === 503) {
          request.nextUrl.pathname = `${currentLocale}/service-unavailable`;
        } else {
          // delete the token and redirect to auth page if the token is wrong
          request.cookies.delete("authToken");
          request.nextUrl.pathname = `${currentLocale}/${authPath}`;
        }
      }
    }
  }

  // Add the locale middleware
  const handleI18nRouting = createIntlMiddleware({
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

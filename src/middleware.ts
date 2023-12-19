import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { api, availableLocales } from "./config";
import { apiReq } from "./lib/utils";
import { TUser } from "./lib/types";

export async function middleware(request: NextRequest) {
  // const [, locale, pathname] = request.nextUrl.pathname.split("/");
  const { pathname, locale } = request.nextUrl;
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
    console.log("🚀 ~ file: middleware.ts:28 ~ middleware ~ token:", token);
    // check if there is a token
    if (!token) {
      // redirect to auth if no token
      request.nextUrl.pathname = `${currentLocale}/${authPath}`;
    } else {
      // get the user of the current token
      const resUserProfile = await apiReq({
        endpoint: "/users/profile",
        locale: currentLocale,
        token: token.value,
      });

      console.log(
        "🚀 ~ file: middleware.ts:40 ~ middleware ~      resUserProfile.ok:",
        resUserProfile.ok
      );
      console.log(
        "🚀 ~ file: middleware.ts:40 ~ middleware ~      resUserProfile.status:",
        resUserProfile.status
      );

      const jsonData = await resUserProfile.json();

      const data = jsonData?.data;

      console.log(
        "🚀 ~ file: middleware.ts:40 ~ middleware ~      resUserProfile ~ data:",
        data
      );

      // check if there is a user with the provided token
      if (resUserProfile.ok && data) {
        // check if the user is verified
        if (!data.verified) {
          // redirect to verify email if not verified
          request.nextUrl.pathname = `${currentLocale}/${authPath}/verify-email`;
        } else {
          // Admins should not access dashboard pages and non-admins should not access admin pages
          if (data.role === "Admin") {
            if (pathname?.includes(`${locale}/dashboard`)) {
              request.nextUrl.pathname = `/${currentLocale}/admin`;
              // return NextResponse.redirect(
              //   new URL(`/${currentLocale}/admin`, request.nextUrl)
              // );
            }
          } else {
            if (pathname?.includes(`${locale}/admin`)) {
              request.nextUrl.pathname = `/${currentLocale}/dashboard`;
              // return NextResponse.redirect(
              //   new URL(`/${currentLocale}/dashboard`, request.nextUrl)
              // );
            }
          }

          // Redirect to the home page for empty pathname
          if (!pathname || pathname === "/") {
            request.nextUrl.pathname = `/${currentLocale}/${
              data.role === "Admin" ? "admin" : "dashboard"
            }`;
            // return NextResponse.redirect(
            //   new URL(
            //     `/${currentLocale}/${
            //       data.role === "Admin" ? "admin" : "dashboard"
            //     }`,
            //     request.nextUrl
            //   )
            // );
          }
        }
        console.log("middleware", {
          user: data,
          pathname,
          href: request.nextUrl.href,
          locale: currentLocale,
          token: token.value,
        });
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

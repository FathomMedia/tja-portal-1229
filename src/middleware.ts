import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { availableLocales } from "./config";
import { apiReq } from "./lib/utils";

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
        "🚀 ~ file: middleware.ts:40 ~ middleware ~ resUserProfile:",
        resUserProfile
      );

      // check if there is a user with the provided token
      if (resUserProfile.ok) {
        const { data } = await resUserProfile.json();
        console.log("From middleware", data.name);
        // check if the user is verified
        if (!data.verified) {
          // redirect to verify email if not verified
          request.nextUrl.pathname = `${currentLocale}/${authPath}/verify-email`;
        } else {
          // Admins should not access dashboard pages and non-admins should not access admin pages
          if (data.role === "Admin") {
            if (pathname?.startsWith(`dashboard`)) {
              return NextResponse.redirect(
                new URL(`/${currentLocale}/admin`, request.nextUrl)
              );
            }
          } else {
            if (pathname?.startsWith(`admin`)) {
              return NextResponse.redirect(
                new URL(`/${currentLocale}/dashboard`, request.nextUrl)
              );
            }
          }

          // Redirect to the home page for empty pathname
          if (!pathname || pathname === "/") {
            return NextResponse.redirect(
              new URL(
                `/${currentLocale}/${
                  data.role === "Admin" ? "admin" : "dashboard"
                }`,
                request.nextUrl
              )
            );
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

  console.log("currentLocale", currentLocale);
  console.log("pathname", pathname);

  // request.nextUrl.pathname = `/${currentLocale}/${pathname}`;

  console.log(
    "🚀 ~ file: middleware.ts:101 ~ middleware ~ request.nextUrl.pathname:",
    request.nextUrl.pathname
  );
  // const res = NextResponse.next();

  // return res;
  // Add the locale middleware
  const handleI18nRouting = createIntlMiddleware({
    locales: availableLocales,
    defaultLocale: availableLocales[0],
  });
  // const handleI18nRouting = createMiddleware({
  //   locales: availableLocales,
  //   defaultLocale: availableLocales[0],
  // });

  const res: NextResponse = handleI18nRouting(request);
  console.log("🚀 ~ file: middleware.ts:115 ~ middleware ~ res:", res);

  return res;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ar|en)/:path*"],
};

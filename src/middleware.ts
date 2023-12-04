import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { availableLocales } from "./config";
import { apiReq } from "./lib/utils";

export async function middleware(request: NextRequest) {
  const [, locale, pathname] = request.nextUrl.pathname.split("/");

  const authPath = `authentication`;
  if (pathname !== authPath) {
    const token = request.cookies.get("authToken");
    // check if there is a token
    if (!token) {
      // redirect to auth if no token
      request.nextUrl.pathname = `${locale}/${authPath}`;
    } else {
      // get the user of the current token
      const resUserProfile = await apiReq({
        endpoint: "/users/profile",
        locale,
        token: token.value,
      });
      // check if there is a user with the provided token
      if (resUserProfile.ok) {
        const { data } = await resUserProfile.json();
        console.log("🚀 ~ file: middleware.ts:24 ~ middleware ~ data:", data);
        // check if the user is verified
        if (!data.verified) {
          // redirect to verify email if not verified
          request.nextUrl.pathname = `${locale}/${authPath}/verify-email`;
        } else {
          // handle route if valid user
          var currentLocale = availableLocales[0];
          availableLocales.some((someLocale) => {
            const isMatching = locale === someLocale;
            if (isMatching) {
              console.log("someLocale", someLocale);
              // sets the someLocale found in the URL
              currentLocale = someLocale;
            }
            return isMatching;
          });

          console.log({ pathname, locale, nextUrl: request.nextUrl });

          // if (
          //   pathname === null ||
          //   pathname === "" ||
          //   pathname === "/" ||
          //   pathname === undefined
          // ) {
          //   if (data.role === "Admin") {
          //     return NextResponse.redirect(
          //       new URL(
          //         `/${currentLocale ?? availableLocales[0]}/admin`,
          //         request.nextUrl
          //       )
          //     );
          //   } else {
          //     return NextResponse.redirect(
          //       new URL(
          //         `/${currentLocale ?? availableLocales[0]}/dashboard`,
          //         request.nextUrl
          //       )
          //     );
          //   }
          // } else if (pathname === "admin" && data.role !== "Admin") {
          //   return NextResponse.redirect(
          //     new URL(
          //       `/${currentLocale ?? availableLocales[0]}/dashboard`,
          //       request.nextUrl
          //     )
          //   );
          // }
          console.log("pathname", pathname);

          if (!currentLocale || currentLocale === "") {
            currentLocale = availableLocales[0];
          }

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
      } else {
        // delete the token and redirect to auth page if the token is wrong
        request.cookies.delete("authToken");
        request.nextUrl.pathname = `${locale}/${authPath}`;
      }
    }
  }

  // Add the locale middleware
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

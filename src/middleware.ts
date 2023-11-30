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
    if (!token) {
      request.nextUrl.pathname = `${locale}/${authPath}`;
    } else {
      const resUserProfile = await apiReq({
        endpoint: "/users/profile",
        locale,
        token: token.value,
      });
      if (resUserProfile.ok) {
        const { data } = await resUserProfile.json();
        if (!data.verified) {
          request.nextUrl.pathname = `${locale}/${authPath}/verify-email`;
          request.nextUrl.searchParams.set("email", data.email);
        }
      } else {
        request.cookies.delete("authToken");
      }
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

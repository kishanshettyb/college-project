import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const url = request.nextUrl.clone();
	const token = request.cookies.get("admin_token")?.value;
	const webviewToken = url.searchParams.get("webview_token");

	// Allow unrestricted access for the home page and certain static asset paths
	if (url.pathname === "/" || url.pathname === "/register" || url.pathname.startsWith("/images") || url.pathname.startsWith("/_next") || url.pathname.startsWith("/favicon")) {
		return NextResponse.next();
	}

	// Allow if URL has any webview_token param (not empty)
	if (webviewToken) {
		return NextResponse.next();
	}

	// Allow if admin_token cookie exists
	if (token) {
		return NextResponse.next();
	}

	// Otherwise, redirect to home page
	url.pathname = "/";
	return NextResponse.redirect(url);
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"]
};

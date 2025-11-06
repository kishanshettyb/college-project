import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const url = request.nextUrl.clone();
	const token = request.cookies.get("admin_token")?.value;
	const webviewToken = url.searchParams.get("webview_token");

	// Get user agent to detect Expo WebView
	const userAgent = request.headers.get("user-agent") || "";
	const isExpoWebView = isExpoUserAgent(userAgent);

	// Allow unrestricted access for the home page and certain static asset paths
	if (url.pathname === "/") {
		if (token) {
			url.pathname = "/dashboard";
			return NextResponse.redirect(url);
		}
		return NextResponse.next(); // Allow access to login page
	}
	if (
		// url.pathname === "/" ||
		url.pathname === "/register" ||
		url.pathname.startsWith("/images") ||
		url.pathname.startsWith("/_next") ||
		url.pathname.startsWith("/favicon") ||
		url.pathname.startsWith("/api")
	) {
		return NextResponse.next();
	}

	// For Expo WebView, allow access with webview_token or check Authorization header
	if (isExpoWebView) {
		// Check for webview_token in URL
		if (webviewToken) {
			return NextResponse.next();
		}

		// Alternatively, check Authorization header for Expo WebView
		const authHeader = request.headers.get("authorization");
		if (authHeader?.startsWith("Bearer ")) {
			const tokenFromHeader = authHeader.replace("Bearer ", "");
			// You can validate this token here if needed
			if (tokenFromHeader) {
				return NextResponse.next();
			}
		}
	}

	// Allow if admin_token cookie exists (for web)
	if (token) {
		return NextResponse.next();
	}

	// For Expo WebView without proper auth, return 401 instead of redirect
	if (isExpoWebView) {
		return new NextResponse(
			JSON.stringify({
				error: "Unauthorized",
				message: "Missing webview_token or valid authorization header"
			}),
			{
				status: 401,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*"
				}
			}
		);
	}

	// Otherwise, redirect to home page (for web)
	url.pathname = "/";
	return NextResponse.redirect(url);
}

function isExpoUserAgent(userAgent: string): boolean {
	const expoPatterns = [/ExpoWebView/i, /Expo\/[\d\.]+/i, /Android.*Expo/i, /iOS.*Expo/i, /expowebview/i];

	return expoPatterns.some((pattern) => pattern.test(userAgent));
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

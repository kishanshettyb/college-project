import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const url = request.nextUrl.clone();

	// ✅ 1. DETECT EXPO WEBVIEW
	const userAgent = request.headers.get("user-agent") || "";
	const isExpoWebView = userAgent.includes("Expo") || userAgent.includes("ReactNative") || userAgent.includes("wv");
	const webviewAuth = request.headers.get("x-webview-auth");
	const webviewUsername = request.headers.get("x-username");

	// ✅ 2. CHECK AUTH STATUS (BOTH COOKIES AND HEADERS)
	const token = request.cookies.get("admin_token")?.value;
	const usernameCookie = request.cookies.get("username")?.value;

	let username: string | null = null;

	// parse cookie safely
	try {
		username = usernameCookie ? JSON.parse(usernameCookie) : null;
	} catch {
		username = usernameCookie || null;
	}

	// Combine username sources: headers first, then cookies
	const combinedUsername = webviewUsername?.trim() || username || "";

	// Public routes allowed for everyone
	if (
		url.pathname === "/" ||
		url.pathname === "/register" ||
		url.pathname === "/logout" ||
		url.pathname.startsWith("/students/login") ||
		url.pathname.startsWith("/students/register") ||
		url.pathname.startsWith("/images") ||
		url.pathname.startsWith("/_next") ||
		url.pathname.startsWith("/favicon") ||
		url.pathname.startsWith("/api")
	) {
		return NextResponse.next();
	}

	// ✅ 3. HANDLE EXPO WEBVIEW SPECIFIC LOGIC
	if (isExpoWebView || webviewAuth === "true") {
		console.log("🚀 WEBVIEW DETECTED");
		console.log("Header username:", webviewUsername);
		console.log("Cookie username:", username);
		console.log("Combined username:", combinedUsername);
		console.log("Token exists:", !!token);
		console.log("Pathname:", url.pathname);

		// Check if user is logged in (either via headers or cookies)
		const isLoggedIn = (webviewUsername && webviewUsername.trim().length > 0) || (token && username);

		if (!isLoggedIn) {
			console.log("❌ WebView user not logged in, redirecting to /");
			url.pathname = "/";
			return NextResponse.redirect(url);
		}

		// Determine user type
		const normalizedUsername = combinedUsername.toUpperCase();
		const isStudent = normalizedUsername.startsWith("4GE");

		console.log("Is student?", isStudent);

		/* ----------------------------------
		   STUDENT (starts with 4GE)
		---------------------------------- */
		if (isStudent) {
			console.log("🎓 Student detected, checking dashboard access...");

			// Block access to regular dashboard
			if (url.pathname.startsWith("/dashboard")) {
				console.log("Redirecting from /dashboard to /student-dashboard");
				url.pathname = "/student-dashboard";
				return NextResponse.redirect(url);
			}

			// Redirect to student dashboard if not already there
			if (!url.pathname.startsWith("/student-dashboard")) {
				console.log("Not on student-dashboard, redirecting...");
				url.pathname = "/student-dashboard";
				return NextResponse.redirect(url);
			}

			console.log("✅ Student on correct dashboard");
			return NextResponse.next();
		}

		/* ----------------------------------
		   FACULTY / ADMIN (non-student)
		---------------------------------- */
		console.log("👨‍🏫 Faculty/Admin detected, checking dashboard access...");

		// Block access to student dashboard
		if (url.pathname.startsWith("/student-dashboard")) {
			console.log("Redirecting from /student-dashboard to /dashboard");
			url.pathname = "/dashboard";
			return NextResponse.redirect(url);
		}

		// Redirect to regular dashboard if not already there
		if (!url.pathname.startsWith("/dashboard")) {
			console.log("Not on dashboard, redirecting...");
			url.pathname = "/dashboard";
			return NextResponse.redirect(url);
		}

		console.log("✅ Faculty/Admin on correct dashboard");
		return NextResponse.next();
	}

	// ✅ 4. REGULAR BROWSER LOGIC (NON-WEBVIEW)
	console.log("🌐 Regular browser detected");

	// No login → go to home
	if (!token || !username) {
		console.log("❌ No auth in regular browser, redirecting to /");
		url.pathname = "/";
		return NextResponse.redirect(url);
	}

	const normalizedUsername = String(username || "").toUpperCase();
	const isStudent = normalizedUsername.startsWith("4GE");

	console.log("Username:", username);
	console.log("Is student?", isStudent);

	// -----------------------------------------
	// ✅ STUDENT LOGIN (username starts with 4GE)
	// -----------------------------------------
	if (isStudent) {
		// Access only student-dashboard
		if (url.pathname.startsWith("/dashboard")) {
			url.pathname = "/student-dashboard";
			return NextResponse.redirect(url);
		}

		if (!url.pathname.startsWith("/student-dashboard")) {
			url.pathname = "/student-dashboard";
			return NextResponse.redirect(url);
		}

		return NextResponse.next();
	}

	// -----------------------------------------
	// ✅ ADMIN / NORMAL USER LOGIN
	// -----------------------------------------
	else {
		// Block student dashboard
		if (url.pathname.startsWith("/student-dashboard")) {
			url.pathname = "/dashboard";
			return NextResponse.redirect(url);
		}

		// Allow dashboard
		if (!url.pathname.startsWith("/dashboard")) {
			url.pathname = "/dashboard";
			return NextResponse.redirect(url);
		}

		return NextResponse.next();
	}
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

// // import { NextRequest, NextResponse } from "next/server";

// // export async function middleware(request: NextRequest) {
// // 	const url = request.nextUrl.clone();

// // 	// ✅ 1. DETECT EXPO WEBVIEW (ADD THIS AT TOP)
// // 	const userAgent = request.headers.get("user-agent") || "";
// // 	const isExpoWebView = userAgent.includes("Expo") || userAgent.includes("ReactNative") || userAgent.includes("wv");

// // 	// ✅ 2. SKIP MIDDLEWARE FOR EXPO
// // 	if (isExpoWebView) {
// // 		return NextResponse.next();
// // 	}

// // 	const token = request.cookies.get("admin_token")?.value;
// // 	const usernameCookie = request.cookies.get("username")?.value;

// // 	let username: string | null = null;

// // 	// parse cookie safely
// // 	try {
// // 		username = usernameCookie ? JSON.parse(usernameCookie) : null;
// // 	} catch {
// // 		username = usernameCookie || null;
// // 	}

// // 	// Public routes allowed
// // 	if (
// // 		url.pathname === "/" ||
// // 		url.pathname === "/register" ||
// // 		url.pathname === "/students/login" ||
// // 		url.pathname === "/students/register" ||
// // 		url.pathname.startsWith("/images") ||
// // 		url.pathname.startsWith("/_next") ||
// // 		url.pathname.startsWith("/favicon") ||
// // 		url.pathname.startsWith("/api")
// // 	) {
// // 		return NextResponse.next();
// // 	}

// // 	// No login → go to home
// // 	if (!token || !username) {
// // 		url.pathname = "/";
// // 		return NextResponse.redirect(url);
// // 	}

// // 	const isStudent = username.startsWith("4GE");

// // 	// -----------------------------------------
// // 	// ✅ STUDENT LOGIN (username starts with 4GE)
// // 	// -----------------------------------------
// // 	if (isStudent) {
// // 		// Access only student-dashboard
// // 		if (url.pathname.startsWith("/dashboard")) {
// // 			url.pathname = "/student-dashboard";
// // 			return NextResponse.redirect(url);
// // 		}

// // 		if (!url.pathname.startsWith("/student-dashboard")) {
// // 			url.pathname = "/student-dashboard";
// // 			return NextResponse.redirect(url);
// // 		}

// // 		return NextResponse.next();
// // 	}

// // 	// -----------------------------------------
// // 	// ✅ ADMIN / NORMAL USER LOGIN
// // 	// -----------------------------------------
// // 	else {
// // 		// Block student dashboard
// // 		if (url.pathname.startsWith("/student-dashboard")) {
// // 			url.pathname = "/dashboard";
// // 			return NextResponse.redirect(url);
// // 		}

// // 		// Allow dashboard
// // 		if (!url.pathname.startsWith("/dashboard")) {
// // 			url.pathname = "/dashboard";
// // 			return NextResponse.redirect(url);
// // 		}

// // 		return NextResponse.next();
// // 	}
// // }

// // export const config = {
// // 	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
// // };
// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(request: NextRequest) {
// 	const url = request.nextUrl.clone();

// 	// ✅ 1. DETECT EXPO WEBVIEW (ADD THIS AT TOP)
// 	const userAgent = request.headers.get("user-agent") || "";
// 	const isExpoWebView = userAgent.includes("Expo") || userAgent.includes("ReactNative") || userAgent.includes("wv");
// 	const webviewAuth = request.headers.get("x-webview-auth");
// 	const webviewUsername = request.headers.get("x-username");

// 	// ✅ 2. HANDLE EXPO WEBVIEW REDIRECTION BASED ON USERNAME
// 	if (isExpoWebView || webviewAuth === "true") {
// 		// Normalize username
// 		const username = webviewUsername || "";

// 		/* ----------------------------------
// 	   STUDENT (starts with 4GE)
// 	---------------------------------- */
// 		if (username.startsWith("4GE")) {
// 			if (!url.pathname.startsWith("/student-dashboard")) {
// 				url.pathname = "/student-dashboard";
// 				return NextResponse.redirect(url);
// 			}
// 			return NextResponse.next();
// 		}

// 		/* ----------------------------------
// 	   FACULTY OR ANY OTHER USER
// 	---------------------------------- */
// 		if (
// 			username.includes("faculty") || // faculty user
// 			username.length > 0 // any other username
// 		) {
// 			if (!url.pathname.startsWith("/dashboard")) {
// 				url.pathname = "/dashboard";
// 				return NextResponse.redirect(url);
// 			}
// 			return NextResponse.next();
// 		}

// 		return NextResponse.next();
// 	}

// 	// ✅ 3. REGULAR MIDDLEWARE LOGIC FOR BROWSER (KEEP YOUR EXISTING CODE)
// 	const token = request.cookies.get("admin_token")?.value;
// 	const usernameCookie = request.cookies.get("username")?.value;

// 	let username: string | null = null;

// 	// parse cookie safely
// 	try {
// 		username = usernameCookie ? JSON.parse(usernameCookie) : null;
// 	} catch {
// 		username = usernameCookie || null;
// 	}

// 	// Public routes allowed
// 	if (
// 		url.pathname === "/" ||
// 		url.pathname === "/register" ||
// 		url.pathname === "/students/login" ||
// 		url.pathname === "/students/register" ||
// 		url.pathname.startsWith("/images") ||
// 		url.pathname.startsWith("/_next") ||
// 		url.pathname.startsWith("/favicon") ||
// 		url.pathname.startsWith("/api")
// 	) {
// 		return NextResponse.next();
// 	}

// 	// No login → go to home
// 	if (!token || !username) {
// 		url.pathname = "/";
// 		return NextResponse.redirect(url);
// 	}

// 	const isStudent = username.startsWith("4GE");

// 	// -----------------------------------------
// 	// ✅ STUDENT LOGIN (username starts with 4GE)
// 	// -----------------------------------------
// 	if (isStudent) {
// 		// Access only student-dashboard
// 		if (url.pathname.startsWith("/dashboard")) {
// 			url.pathname = "/student-dashboard";
// 			return NextResponse.redirect(url);
// 		}

// 		if (!url.pathname.startsWith("/student-dashboard")) {
// 			url.pathname = "/student-dashboard";
// 			return NextResponse.redirect(url);
// 		}

// 		return NextResponse.next();
// 	}

// 	// -----------------------------------------
// 	// ✅ ADMIN / NORMAL USER LOGIN
// 	// -----------------------------------------
// 	else {
// 		// Block student dashboard
// 		if (url.pathname.startsWith("/student-dashboard")) {
// 			url.pathname = "/dashboard";
// 			return NextResponse.redirect(url);
// 		}

// 		// Allow dashboard
// 		if (!url.pathname.startsWith("/dashboard")) {
// 			url.pathname = "/dashboard";
// 			return NextResponse.redirect(url);
// 		}

// 		return NextResponse.next();
// 	}
// }

// export const config = {
// 	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
// };
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const url = request.nextUrl.clone();

	// ✅ 1. DETECT EXPO WEBVIEW (ADD THIS AT TOP)
	const userAgent = request.headers.get("user-agent") || "";
	const isExpoWebView = userAgent.includes("Expo") || userAgent.includes("ReactNative") || userAgent.includes("wv");
	const webviewAuth = request.headers.get("x-webview-auth");
	const webviewUsername = request.headers.get("x-username");

	// ✅ 2. HANDLE EXPO WEBVIEW REDIRECTION BASED ON USERNAME
	if (isExpoWebView || webviewAuth === "true") {
		// Normalize username
		const username = webviewUsername || "";

		// Public routes for WebView (including root and logout)
		if (
			url.pathname === "/" ||
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

		/* ----------------------------------
	   STUDENT (starts with 4GE)
	---------------------------------- */
		if (username.startsWith("4GE")) {
			if (!url.pathname.startsWith("/student-dashboard")) {
				url.pathname = "/student-dashboard";
				return NextResponse.redirect(url);
			}
			return NextResponse.next();
		}

		/* ----------------------------------
	   FACULTY OR ANY OTHER USER
	---------------------------------- */
		// If username exists but is not a student (faculty or any other user)
		if (username.length > 0) {
			if (!url.pathname.startsWith("/dashboard")) {
				url.pathname = "/dashboard";
				return NextResponse.redirect(url);
			}
			return NextResponse.next();
		}

		// No username - stay on current page (could be login page)
		return NextResponse.next();
	}

	// ✅ 3. REGULAR MIDDLEWARE LOGIC FOR BROWSER (KEEP YOUR EXISTING CODE)
	const token = request.cookies.get("admin_token")?.value;
	const usernameCookie = request.cookies.get("username")?.value;

	let username: string | null = null;

	// parse cookie safely
	try {
		username = usernameCookie ? JSON.parse(usernameCookie) : null;
	} catch {
		username = usernameCookie || null;
	}

	// Public routes allowed
	if (
		url.pathname === "/" ||
		url.pathname === "/register" ||
		url.pathname === "/students/login" ||
		url.pathname === "/students/register" ||
		url.pathname === "/logout" ||
		url.pathname.startsWith("/images") ||
		url.pathname.startsWith("/_next") ||
		url.pathname.startsWith("/favicon") ||
		url.pathname.startsWith("/api")
	) {
		return NextResponse.next();
	}

	// No login → go to home
	if (!token || !username) {
		url.pathname = "/";
		return NextResponse.redirect(url);
	}

	const isStudent = username.startsWith("4GE");

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

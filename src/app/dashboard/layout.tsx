"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAdminContext } from "@/lib/provider/adminContext";
import { BarChart2, BookA, ExternalLink, Home, LogOut, MoreHorizontal, Plus, TextSearch, Users2 } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
export default function Page({ children }: { children: React.ReactNode }) {
	function formatPath(path: string) {
		if (!path) return "";

		// Remove leading slash
		let cleaned = path.replace(/^\/+/, "");

		// Remove dashboard prefix if exists
		cleaned = cleaned.replace("dashboard/", "");

		// Replace hyphens with spaces
		cleaned = cleaned.replace(/-/g, " ");

		// Capitalize each word
		return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
	}

	const { loggedIn, logout } = useAdminContext();
	const pathname = usePathname();
	const urlpathname = formatPath(pathname); // 👉 format it
	// const router = useRouter();

	const handleLogout = () => {
		logout();
	};
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex lg:mt-0 h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="#">Google Form Data List</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>{urlpathname}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header>
				{children}
				<footer className="relative ">
					<div className="md:hidden border flex gap-x-3 justify-between items-center fixed w-full bottom-0 bg-slate-50 p-5">
						<div>
							<Link className="text-center text-xs flex justify-center items-center flex-col" href="/dashboard">
								<Home size={20} />
								<p className="font-semibold">Home</p>
							</Link>
						</div>
						<div>
							<Link className="text-center text-xs flex justify-center items-center flex-col" href="/dashboard/student-marks-data">
								<TextSearch size={20} />
								<p className="font-semibold">Marks</p>
							</Link>
						</div>
						<div>
							<Link className="text-center text-xs flex justify-center items-center flex-col" href="/dashboard/excel">
								<ExternalLink size={20} />
								<p className="font-semibold">Export</p>
							</Link>
						</div>
						<div>
							<Link className="text-center text-xs flex justify-center items-center flex-col" href="/dashboard/result-analysis">
								<BarChart2 size={20} />
								<p className="font-semibold">Analysis</p>
							</Link>
						</div>
						<div>
							<Popover>
								<PopoverTrigger asChild>
									<div className="text-center text-xs flex justify-center items-center flex-col">
										<MoreHorizontal size={20} />
										<p className="font-semibold">More</p>
									</div>
								</PopoverTrigger>
								<PopoverContent className="w-40">
									<div className="grid  ">
										<div className="space-y-2">
											<Link className="text-center border border-x-0 border-t-0 p-2 text-xs flex flex-row justify-center items-center gap-x-3 " href="/dashboard/students">
												<Users2 size={20} />
												<p className="font-semibold">Students</p>
											</Link>
											<Link className="text-center border border-x-0 border-t-0 p-2 text-xs flex flex-row justify-center items-center gap-x-3 " href="/dashboard/subjects">
												<BookA size={20} />
												<p className="font-semibold">Subjects</p>
											</Link>
											<Link className="text-center flex flex-row justify-center p-2 text-xs items-center " href="/dashboard/excel">
												<div onClick={handleLogout} className="text-center flex justify-center items-center gap-x-3 flex-row">
													<LogOut size={20} />
													<p className="font-semibold">Logout</p>
												</div>
											</Link>
										</div>
										<div className="grid gap-2"></div>
									</div>
								</PopoverContent>
							</Popover>
						</div>
					</div>
				</footer>
			</SidebarInset>
		</SidebarProvider>
	);
}

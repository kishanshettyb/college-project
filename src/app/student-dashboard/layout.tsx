"use client";
import { StudentSidebar } from "@/components/student-sidebar";
import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { useAdminContext } from "@/lib/provider/adminContext";

function layout({ children }: { children: React.ReactNode }) {
	const { logout } = useAdminContext();
	// const router = useRouter();

	const handleLogout = () => {
		logout();
	};
	return (
		<div>
			<SidebarProvider>
				<StudentSidebar />
				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">Student Dashboard</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Home</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</header>
					<div className="p-4">{children}</div>
					<footer className="relative  ">
						<div className=" md:hidden border flex gap-x-10 justify-between items-center fixed w-full bottom-0 bg-slate-50 p-5">
							<div>
								<Link className="text-center flex justify-center items-center flex-col" href="/student-dashboard">
									<Home />
									<p className="font-semibold">Home</p>
								</Link>
							</div>
							<div>
								<Link className="text-center flex justify-center items-center flex-col" href="/student-dashboard/exam-marks">
									<Plus />
									<p className="font-semibold">Add Marks</p>
								</Link>
							</div>
							<div>
								<div onClick={handleLogout} className="text-center flex justify-center items-center flex-col">
									<LogOut />
									<p className="font-semibold">Logout</p>
								</div>
							</div>
						</div>
					</footer>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}

export default layout;

"use client";

import * as React from "react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail
} from "@/components/ui/sidebar";
import { StudentDashboardHeader } from "./student-dashboard-sidebar-header";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/router";
import { useAdminContext } from "@/lib/provider/adminContext";

// This is sample data.
const data = {
	versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
	navMain: [
		{
			title: "Student Dashboard",
			url: "#",
			items: [
				{
					title: "Home",
					url: "#"
				},
				{
					title: "Forms",
					url: "#"
				}
			]
		}
	]
};

export function StudentSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { loggedIn, logout } = useAdminContext();
	// const router = useRouter();

	const handleLogout = () => {
		logout();
	};
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<StudentDashboardHeader versions={data.versions} defaultVersion={data.versions[0]} />
			</SidebarHeader>
			<SidebarContent className="border border-x-0 border-t-slate-200">
				{/* We create a SidebarGroup for each parent. */}
				{data.navMain.map((item) => (
					<SidebarGroup key={item.title}>
						<SidebarGroupLabel>{item.title}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{item.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={item.isActive}>
											<a href={item.url}>{item.title}</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<Button onClick={handleLogout} className="m-5">
				Logout <LogOut />
			</Button>
			<SidebarRail />
		</Sidebar>
	);
}

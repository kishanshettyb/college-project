"use client";
import * as React from "react";
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
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useAdminContext } from "@/lib/provider/adminContext";
import { useRouter } from "next/router";

// This is sample data.
const data = {
	versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
	navMain: [
		{
			title: "Menus",
			url: "#",
			items: [
				{
					title: "Students Data",
					url: "/dashboard/google-form"
				},
				{
					title: "Exported Excel List",
					url: "/dashboard/excel"
				},
				{
					title: "Result Analysis",
					url: "/dashboard/result-analysis"
				},
				{
					title: "Students",
					url: "/dashboard/students"
				},
				{
					title: "Subjects",
					url: "/dashboard/subjects"
				}
			]
		}
	]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { loggedIn, logout } = useAdminContext();
	// const router = useRouter();

	const handleLogout = () => {
		logout();
	};
	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
			</SidebarHeader>
			<SidebarContent>
				{/* We create a SidebarGroup for each parent. */}
				{data.navMain.map((item) => (
					<SidebarGroup key={item.title}>
						<SidebarGroupLabel>{item.title}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{item.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild>
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

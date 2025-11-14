"use client";

import * as React from "react";
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

export function StudentDashboardHeader({ versions, defaultVersion }: { versions: string[]; defaultVersion: string }) {
	const [selectedVersion, setSelectedVersion] = React.useState(defaultVersion);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Link href="/student-dashboard">
							<SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
								<Image alt="gec" width={300} height={300} className="w-[50px] h-[50px] object-cover" src="/images/new-logo-gec.png" />
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-medium">GEC Chamarajnagar</span>
								</div>
								<ChevronsUpDown className="ml-auto" />
							</SidebarMenuButton>
						</Link>
					</DropdownMenuTrigger>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

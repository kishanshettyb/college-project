import { LoginForm } from "@/components/login-form";
import { ShieldUser, User, Users } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
export default function Page() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm p-5">
				<Tabs defaultValue="account">
					<TabsList className="w-full">
						<TabsTrigger value="account">
							<ShieldUser />
							Faculty
						</TabsTrigger>
						<TabsTrigger value="password">
							<Users />
							Students
						</TabsTrigger>
					</TabsList>
					<TabsContent value="account">
						<Card>
							<CardHeader>
								<CardTitle className="bg-slate-50 py-3 rounded-2xl">
									<Image
										src="/images/new-logo-gec.png"
										width="1000"
										height="1000"
										className="w-[100px] flex justify-center items-center mx-auto  shadow-2xl shadow-blue-200 border-slate-100 h-[100px] object-cover rounded-full"
										alt=""
									/>
									<h2 className="text-center text-xl mt-5 font-semibold">GEC-Chamarajanagara</h2>
								</CardTitle>
							</CardHeader>
							<CardContent className="grid gap-6">
								<LoginForm title="Faculty Login" />
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="password">
						<Card>
							<CardHeader>
								<CardTitle>
									<Image
										src="/images/new-logo-gec.png"
										width="1000"
										height="1000"
										className="w-[100px] flex justify-center items-center mx-auto  shadow-2xl shadow-blue-200 border-slate-100 h-[100px] object-cover rounded-full"
										alt=""
									/>
									<h2 className="text-center text-xl mt-5 font-semibold">GEC-Chamarajanagara</h2>
								</CardTitle>
							</CardHeader>
							<CardContent className="grid gap-6">
								<LoginForm title="Student Login" />
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

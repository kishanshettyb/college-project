import { LoginForm } from "@/components/login-form";
import { ShieldUser, User, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { StudentLoginForm } from "@/components/student-login-form";
export default function Page() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm p-5">
				<Tabs defaultValue="student">
					<TabsList className="w-full">
						<TabsTrigger value="student">
							<Users />
							Students
						</TabsTrigger>
						<TabsTrigger value="faculty">
							<ShieldUser />
							Faculty
						</TabsTrigger>
					</TabsList>
					<TabsContent value="student">
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
								<StudentLoginForm title="Student Login" />
								<Link className="text-center flex items-center justify-center gap-2 text-xs text-blue-600" href="/register">
									<UserPlus size={14} />
									Register Student
								</Link>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="faculty">
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
				</Tabs>
			</div>
		</div>
	);
}

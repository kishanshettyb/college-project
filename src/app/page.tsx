import { LoginForm } from "@/components/login-form";
import { User } from "lucide-react";
import Link from "next/link";

export default function Page() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm p-5">
				<LoginForm title="Admin Login" />
				<div className="my-5 text-center">
					<Link href="/students/login" className="text-center text-blue-600 items-center flex gap-x-2 justify-center text-sm my-5">
						<User size={16} />
						Student Login
					</Link>
				</div>
			</div>
		</div>
	);
}

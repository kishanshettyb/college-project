import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import Cookies from "js-cookie";
import { StudentForm } from "./student-form";

export function AddStudentModal() {
	const documentId = Cookies.get("username");

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="default">
					<UserPlus />
					Add Students
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Students</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<StudentForm usn={documentId} />
				</div>
			</DialogContent>
		</Dialog>
	);
}

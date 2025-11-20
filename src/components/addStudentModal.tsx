import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StudentForm } from "./student-form";
import { UserPlus } from "lucide-react";

export function AddStudentModal() {
	return (
		<Dialog>
			<form>
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
						<StudentForm />
					</div>
				</DialogContent>
			</form>
		</Dialog>
	);
}

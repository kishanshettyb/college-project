import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import Cookies from "js-cookie";
import { StudentForm } from "./student-form";

type ModalProps = {
	docId?: string;
};
export function AddStudentModal({ docId }: ModalProps) {
	const usn = Cookies.get("username");
	const documentId = docId;
	console.log(usn + documentId);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="default">
					<UserPlus />
					{docId ? "Edit Details" : "Add Details"}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{documentId ? "Edit Details" : "Add Details"}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<StudentForm docId={documentId} usn={usn} />
				</div>
			</DialogContent>
		</Dialog>
	);
}

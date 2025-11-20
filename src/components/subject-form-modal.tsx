"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SubjectForm } from "./subject-form";

type Props = {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	documentId?: string;
};

export function SubjectFormModal({ open, onOpenChange, documentId }: Props) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<Button>
					<Plus /> Create Subject
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{documentId ? "Edit Subject" : "Create Subject"}</DialogTitle>
				</DialogHeader>

				<SubjectForm documentId={documentId ?? ""} />
			</DialogContent>
		</Dialog>
	);
}

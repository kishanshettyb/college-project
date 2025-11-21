export type Marks = {
	id?: number;
	internal_mark: number;
	external_mark: number;
	semister: string;
	student: {
		documentId: string;
		name: string;
		usn: string;
	};
	subject: {
		documentId: string;
		sub_code: string;
	};
};

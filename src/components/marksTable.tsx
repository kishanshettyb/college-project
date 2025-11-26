"use client";

export default function MarksTable({ data }) {
	if (!data || data.length === 0) return <p>No marks found.</p>;

	// ---------------- STUDENT BASIC DETAILS ----------------
	const student = data[0].student;
	const semester = data[0].semister.toUpperCase();

	// ---------------- CALCULATE SUMMARY ----------------
	let totalMarks = 0;
	let hasFail = false;

	data.forEach((item) => {
		const total = item.internal_mark + item.external_mark;
		totalMarks += total;

		if (total < 40) hasFail = true; // If any subject total < 40 = fail
	});

	const maxMarks = data.length * 100;
	const percentage = ((totalMarks / maxMarks) * 100).toFixed(2);

	// Grade Calculation
	let grade = "fail";
	if (!hasFail) {
		if (percentage >= 70) grade = "first class with distinction";
		else if (percentage >= 60) grade = "first class";
		else if (percentage >= 40) grade = "pass";
	}

	// Final Result (only pass/fail)
	const result = Number(percentage) < 40 ? "fail" : "pass";

	return (
		<div className="p-4 flex flex-col gap-6">
			{/* ---------------- STUDENT DETAILS ---------------- */}
			<div className="border rounded-lg p-4 shadow">
				<h2 className="text-lg font-semibold mb-2">Student Details</h2>

				<div className="grid grid-cols-2 gap-3 text-sm">
					<p>
						<b>Name:</b> {student.name}
					</p>
					<p>
						<b>USN:</b> {student.usn}
					</p>
					<p>
						<b>Gender:</b> {student.gender}
					</p>
					<p>
						<b>DOB:</b> {student.dob}
					</p>
					<p>
						<b>Category:</b> {student.category}
					</p>
					<p>
						<b>Semester:</b> {semester}
					</p>
				</div>
			</div>

			{/* ---------------- MARKS TABLE ---------------- */}
			<div className="border rounded-lg p-4 shadow">
				<h2 className="text-xl font-semibold mb-4">Marks Details</h2>

				<table className="w-full border-collapse border text-sm">
					<thead className="bg-gray-100">
						<tr>
							<th className="border p-2">Sl No</th>
							<th className="border p-2">Subject Code</th>
							<th className="border p-2">Internal</th>
							<th className="border p-2">External</th>
							<th className="border p-2">Total</th>
						</tr>
					</thead>

					<tbody>
						{data?.map((item, index) => {
							const total = item.internal_mark + item.external_mark;

							return (
								<tr key={item.id} className="text-center">
									<td className="border p-2">{index + 1}</td>
									<td className="border p-2">{item.subject.sub_code}</td>
									<td className="border p-2">{item.internal_mark}</td>
									<td className="border p-2">{item.external_mark}</td>
									<td className="border p-2 font-semibold">{total}</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				{/* ---------------- SUMMARY FOOTER ---------------- */}
				<div className="flex justify-end mt-6">
					<div className="border rounded-lg p-4 w-64 shadow text-sm">
						<p className="py-1">
							<b>Total Marks:</b> {totalMarks}
						</p>

						<p className="py-1">
							<b>Percentage:</b> <span className={percentage < 40 ? "text-red-500" : "text-green-600"}>{percentage}%</span>
						</p>

						<p className="py-1">
							<b>Grade:</b> <span className={grade === "fail" ? "text-red-500" : "text-green-600"}>{grade}</span>
						</p>

						<p className="py-1">
							<b>Result:</b> <span className={result === "fail" ? "text-red-500" : "text-green-600"}>{result}</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

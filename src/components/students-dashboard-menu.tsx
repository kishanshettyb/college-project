import Link from "next/link";
import React from "react";

function StudentsDashboardMenus() {
	return (
		<div>
			<ul>
				<li>
					<Link href="#">Home</Link>
				</li>
				<li>
					<Link href="#">Form</Link>
				</li>
			</ul>
		</div>
	);
}

export default StudentsDashboardMenus;

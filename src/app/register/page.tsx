import { SignupForm } from "@/components/signup-form";
import React from "react";

function page() {
	return (
		<div className="  flex flex-row w-full justify-center items-center">
			<div className="w-full lg:w-1/4">
				<SignupForm />
			</div>
		</div>
	);
}

export default page;

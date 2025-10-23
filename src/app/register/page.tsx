import { SignupForm } from "@/components/signup-form";
import React from "react";

function page() {
	return (
		<div className="w-full min-h-svh   h-full flex flex-col justify-center items-center lg:w-1/4">
			<SignupForm />
		</div>
	);
}

export default page;

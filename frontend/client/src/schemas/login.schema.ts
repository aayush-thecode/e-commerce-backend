import * as yup from "yup";

export const loginSchema = yup.object({
	email: yup
		.string()
		.email("Enter a valid email")
		.required("Email is required"),
	password: yup
		.string()
		.required("password is required")
		.min(6, "Password must be 6 char long"),
});

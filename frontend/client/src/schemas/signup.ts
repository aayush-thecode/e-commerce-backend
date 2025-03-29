import * as yup from "yup";

export const signupSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  phonenumber: yup
    .number()
    .typeError("Phone number must be a number")
    .positive("Phone number must be positive")
    .integer("Phone number must be an integer")
    .required("Phone number is required"),
  gender: yup.string().oneOf(["Male", "Female"], "Gender is required").optional(),
  
});
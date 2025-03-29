
export interface ILogin {
    email:string;
    password:string

}

export interface ISignUp {
    name: string;
    email: string;
    password: string;
    phonenumber:number;
    gender?: "Male" | "Female";
    
}
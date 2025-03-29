import LoginForm from "@/components/login/login-form"
import Link from "next/link"

const Page = () => {
    return (
        <div className=' h-full flex justify-center items-center'>
            <div className="flex flex-col items-center px-14 py-10 border border-gray-600   rounded-md">
                <h1 className="text-2xl font-bold tracking-widest">Login </h1>
                <LoginForm />
                <div className='mt-4 tracking-wider'>
                    <p>Don&apos;t have an account? <Link href='/signup'><span className="text-blue-600 font-semibold">Register</span></Link></p>
                </div>
            </div>
        </div>
    )
}

export default Page
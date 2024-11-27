import LoginForm from "@/components/forms/LoginForm"
import Link from "next/link"
import { Sparkles } from "lucide-react"


const Login = () => {

    return (

        <div className='flex justify-center items-center h-screen'>
            <div className='bg-register-gradient mx-8 flex flex-col justify-center items-center h-screen w-screen'>
                <header className="hidden md:flex fixed top-0 left-0 right-0 z-50">
                    <div className="container mx-auto px-8 md:px-3 mt-2 h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl">ATHLAS</span>
                        </Link>
                    </div>
                </header>
                <div className='bg-muted p-8 md:rounded-md flex flex-col gap-6 md:h-[500px] md:w-[568px] items-center justify-center w-screen h-screen'>
                    <Link href="/" className="flex items-center space-x-2 md:hidden py-5 top-10 fixed">
                        <Sparkles className="h-10 w-10 text-primary" />
                        <span className="font-bold text-4xl">ATHLAS</span>
                    </Link>
                    <h2 className="text-3xl font-bold capitalize text-center ">Login</h2 >
                    <LoginForm />
                    <p className=" text-sm text-center">Forgot your password?&nbsp;
                        <Link href="/auth/reset-password" className="text-primary font-bold">Reset Password</Link>
                    </p>
                    <p className=" text-sm text-center">You don't have an account?&nbsp;
                        <Link href="/auth/register" className="text-primary font-bold">Register Now</Link>
                    </p>
                </div>
            </div>
        </div >
    )
}

export default Login
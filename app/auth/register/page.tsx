import RegisterForm from "@/components/forms/RegisterForm"
import Link from "next/link"
import { Sparkles } from "lucide-react"

const Register = () => {

    return (

        <div className='bg-dark_gray-gradient flex justify-center items-center md:h-screen'>
            <div className='bg-register-gradient flex flex-col justify-center items-center md:h-screen w-screen'>
                <header className="hidden md:flex fixed top-0 left-0 right-0 z-50">
                    <div className="container mx-auto px-8 md:px-3 h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2">
                            <Sparkles className="h-6 w-6 text-green-500" />
                            <span className="font-bold text-xl gradient-text">ATHLAS</span>
                        </Link>
                    </div>
                </header>
                <div className='bg-register-card-gradient p-6 md:rounded-md flex flex-col gap-6 md:h-[596px] md:w-[568px] items-center justify-center w-screen'>
                    <Link href="/" className="flex items-center space-x-2 md:hidden top-0 pt-2 ">
                        <Sparkles className="h-6 w-6 text-green-500" />
                        <span className="font-bold text-xl gradient-text">ATHLAS</span>
                    </Link>
                    <h2 className="text-3xl font-bold capitalize text-center text-white">Create your account!</h2 >
                    <RegisterForm />
                    <p className="text-white text-sm text-center">Alredy have an account?&nbsp;
                        <Link href="/auth/login" className="text-green-400 font-bold">Login</Link>
                    </p>
                    <p className="pb-4 text-gray-400 text-sm text-center">By creating an account, you agree to the&nbsp;
                        <Link href="/terms-of-use" className="text-white underline">Terms of Use</Link>
                        .</p>

                </div>
            </div>
        </div >
    )
}

export default Register
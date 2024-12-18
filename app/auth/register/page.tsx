import RegisterForm from "@/components/forms/RegisterForm"
import Link from "next/link"
import { Sparkles } from "lucide-react"

const Register = () => {

    return (

        <div className='flex justify-center items-center'>
            <div className='bg-register-gradient flex flex-col justify-center items-center md:h-screen w-screen'>
                <header className="hidden md:flex fixed top-0 left-0 right-0 z-50">
                    <div className="container mx-auto px-8 md:px-3 h-16 mt-2 flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl">ATHLAS</span>
                        </Link>
                    </div>
                </header>
                <div className='bg-muted p-6 md:rounded-md flex flex-col gap-6 md:w-[568px] items-center justify-center w-screen'>
                    <Link href="/" className="mt-5 flex items-center space-x-2 md:hidden top-10 pt-2 ">
                        <Sparkles className="h-10 w-10 text-primary" />
                        <span className="font-bold text-4xl gradient-text">ATHLAS</span>
                    </Link>
                    <h2 className="mt-5 text-2xl font-bold capitalize text-center ">Create your account</h2 >
                    <RegisterForm />
                    <p className=" text-sm text-center">Alredy have an account?&nbsp;
                        <Link href="/auth/login" className="text-primary font-bold">Login</Link>
                    </p>
                    <p className="mb-10 text-muted-foreground text-sm text-center">By creating an account, you agree to the&nbsp;
                        <Link href="/terms-of-use" className=" underline">Terms of Use</Link>
                        .</p>

                </div>
            </div>
        </div >
    )
}

export default Register
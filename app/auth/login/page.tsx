import LoginForm from "@/components/forms/LoginForm"
import Link from "next/link"
import Header from "@/components/Header"

const Login = () => {
    return (
        <>
            
            <div className='md:m-8 flex justify-center items-center'>
                <div className='p-8 md:rounded-md flex flex-col gap-6 md:w-[568px] md:h-[450px] items-center justify-center w-screen h-screen'>
                    <h2 className="mb-2 text-3xl font-bold text-center ">Faça seu login</h2 >
                    <LoginForm />
                    <Link href="/auth/reset-password" className="text-primary underline">Esqueci minha senha</Link>
                    <p className=" text-sm text-center">Ainda não tem uma conta?&nbsp;
                        <Link href="/auth/register" className="underline text-primary font-bold">Cadastre-se</Link>
                    </p>
                </div>
            </div>
        </ >
    )
}

export default Login
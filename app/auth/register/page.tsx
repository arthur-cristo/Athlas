import RegisterForm from "@/components/forms/RegisterForm"
import Link from "next/link"
import registerImage from "@/public/assets/images/register_image.jpg"
import Image from "next/image"

const Register = () => {

    return (
        <>
            <div className='flex flex-col md:flex-row justify-around sm:mt-8 mt-24'>
                <div>
                    <Image src={registerImage} alt="Register" className="hidden md:flex w-[600px] h-[460px] rounded-md object-cover shadow-2xl" />
                </div>
                <div className='md:shadow-2xl md:bg-muted p-6 md:rounded-md flex flex-col gap-6 md:h-[460px] md:w-[568px] items-center justify-center'>
                    <h2 className="mb-2 text-2xl font-bold text-center w-2/3 md:w-1/2">Crie sua conta e comece a aprender</h2 >
                    <RegisterForm />
                    <p className="text-muted-foreground text-sm text-center">Ao criar uma conta, você concorda com os&nbsp;
                        <Link href="/terms-of-use" className="underline">Termos de Uso</Link>
                        .</p>
                    <p className="mb-5 text-center">Já tem uma conta?&nbsp;
                        <Link href="/auth/login" className="underline text-primary font-bold">Faça Login</Link>
                    </p>
                </div>
            </div>
        </ >
    )
}

export default Register
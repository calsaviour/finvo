import { NextPageContext } from "next"
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Login(props: any) {
    const router = useRouter();
    useEffect(() => {
        const token = router.query.token;
        if (token) {
            localStorage.setItem('session', token.toString());
            router.push('/');
        }
    }, [router])

    return (
        <div className="bg-black h-screen flex flex-col justify-center items-center">
            <div className="bg-white h-3/4 w-4/5 rounded-lg shadow-lg flex flex-col justify-center items-center animate-fade-in">
                <div className="w-full">
                    <h1 className="text-black text-center text-2xl md:text-4xl font-bold mb-6">
                        Finance Service
                    </h1>
                </div>
                <div className="w-full self-center flex flex-col justify-center items-center">
                    <a href={`${props.baseUrl}/auth/google/authorize`} rel="noreferrer">
                        <button className="bg-black text-white rounded-md px-8 py-4 text-sm sm:text-lg md:text-xl lg:text-2xl hover:bg-white hover:text-black hover:border-black border-2 border-black transition duration-300 ease-in-out">
                            Continue with Google
                        </button>
                    </a>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context: NextPageContext) {

    return {
        props: {
            baseUrl: process.env.NEXT_PUBLIC_API_URL,
        }
    }
}
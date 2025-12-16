"use client"
import { useState } from 'react';
import { api } from '../utils/api';
import { useRouter } from 'next/navigation';
import { tokenStore } from '../utils/utils';

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('Parking_solutions');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        console.log(email, password);

        try {
            const response = await api.login(email, password);
            console.log('Login successful:', response.data);
            if (response.data.token) {
                tokenStore.getState().setToken(response.data.token);
            }
            console.log(tokenStore.getState());
            router.push('/home');
        } catch (err: any) {
            console.error('Login error:', err);
            if (err.response) {
                setError(err.response.data?.message || 'Invalid email or password');
            } else if (err.request) {
                setError('Network error. Please check your connection.');
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="flex flex-col items-center w-[360px]">
            <div className="w-full bg-[radial-gradient(130.14%_50%_at_50%_50%,#0A5D5C_0%,#282829_100%)] pb-12 pt-8 flex justify-center items-center rounded-t-lg relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 400 200' preserveAspectRatio='xMidYMid slice' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%2322d3ee' stroke-width='1' fill='none' opacity='0.5'%3E%3Cpath d='M250 180 L350 100 L420 120 M350 100 L320 20 L380 0 L420 120 M320 20 L250 80 L250 180 M250 80 L180 120 M380 0 L450 -20 M250 80 L180 20 M250 180 L180 220'/%3E%3Cpath d='M80 180 L120 100 L50 40 M120 100 L200 60 L240 20 M200 60 L280 80'/%3E%3Ccircles cx='350' cy='100' r='2' fill='%2322d3ee' opacity='0.8'/%3E%3Ccircle cx='320' cy='20' r='2' fill='%2322d3ee' opacity='0.8'/%3E%3Ccircle cx='250' cy='80' r='2' fill='%2322d3ee' opacity='0.8'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundPosition: 'right center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover'
                    }}
                />

                <div className="flex items-center gap-2 z-10">
                    <img src="/logo.png" alt="kloudspot" className="h-8 w-auto mix-blend-screen" />
                    <p className="text-2xl font-bold text-white z-10">kloudspot</p>
                </div>
            </div>

            <div className="bg-white w-full p-6 rounded-b-lg shadow-lg relative -mt-4 z-10">
                <div className="relative mb-6">
                    <input
                        type="text"
                        id="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600 peer"
                        placeholder=" "
                    />
                    <label
                        htmlFor="username"
                        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-teal-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                    >
                        Log In *
                    </label>
                </div>

                <div className="relative mb-8">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600 peer pr-10"
                        placeholder=" "
                    />
                    <label
                        htmlFor="password"
                        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-teal-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                    >
                        Password *
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-[#00897B] hover:bg-[#00796B] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Logging in...
                        </>
                    ) : (
                        'Login'
                    )}
                </button>
            </div>
        </div>
    );
}

export default Login;
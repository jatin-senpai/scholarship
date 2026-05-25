import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome to ScholarGate" />
            <div className="relative min-h-screen bg-slate-900 overflow-hidden text-slate-300 font-sans selection:bg-indigo-500/30">
                {/* Background ambient lighting */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/20 blur-[120px] pointer-events-none"></div>
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col min-h-screen max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Header */}
                    <header className="py-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">ScholarGate</span>
                        </div>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link href={route('dashboard')}>
                                    <PrimaryButton>Dashboard</PrimaryButton>
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-sm font-medium hover:text-white transition-colors">
                                        Log in
                                    </Link>
                                    <Link href={route('register')}>
                                        <PrimaryButton>Student Register</PrimaryButton>
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>

                    {/* Main Hero Section */}
                    <main className="flex-grow flex items-center justify-center py-20">
                        <div className="text-center max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
                                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                                Cross-State Scholarship Verification System
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
                                Empowering Students <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">
                                    Across State Borders.
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                                A unified platform connecting state governments and educational institutions to verify and disburse scholarships seamlessly, eliminating fraud and ensuring fast access to funds.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                {!auth.user ? (
                                    <>
                                        <Link href={route('register')}>
                                            <PrimaryButton className="!px-8 !py-4 !text-base">
                                                Apply as Student
                                            </PrimaryButton>
                                        </Link>
                                        <Link href={route('institution.register')}>
                                            <SecondaryButton className="!px-8 !py-4 !text-base">
                                                Register Institution
                                            </SecondaryButton>
                                        </Link>
                                    </>
                                ) : (
                                    <Link href={route('dashboard')}>
                                        <PrimaryButton className="!px-8 !py-4 !text-base">
                                            Go to Dashboard
                                        </PrimaryButton>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </main>

                    {/* Features Grid */}
                    <section className="py-20 border-t border-white/5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Fast Verification</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">Institutions can quickly verify student details and academic records in real-time, drastically reducing processing time.</p>
                            </div>
                            
                            {/* Feature 2 */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Cross-State Sync</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">State APIs automatically sync student domicile and study states, ensuring accurate funding allocation without double-dipping.</p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">Secure & Transparent</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">End-to-end encryption for document storage and complete transparency in the application lifecycle for students.</p>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="py-8 text-center border-t border-white/5 mt-auto">
                        <p className="text-sm text-slate-500">
                            &copy; {new Date().getFullYear()} ScholarGate. Built for the Hackathon.
                        </p>
                    </footer>
                </div>
            </div>
        </>
    );
}

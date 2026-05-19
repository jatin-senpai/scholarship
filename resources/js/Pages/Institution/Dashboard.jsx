import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Institution Dashboard</h2>}
        >
            <Head title="Institution Dashboard" />

            <div className="py-12 min-h-screen bg-slate-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Glassmorphism Container */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 overflow-hidden shadow-xl sm:rounded-2xl p-8 text-white">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-bold mb-1">Welcome, {auth.user.name}</h3>
                                <p className="text-slate-300 text-sm">Manage student verifications and institutional profile.</p>
                            </div>
                            <div className="flex space-x-4">
                                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-4 py-2 rounded-full font-medium text-sm flex items-center shadow-lg shadow-amber-500/10">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 mr-2 animate-pulse"></span>
                                    Verification Pending
                                </span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300">
                                <div className="text-4xl font-bold text-blue-400 mb-2">0</div>
                                <div className="text-sm text-slate-300 uppercase tracking-wider font-semibold">Total Students</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300">
                                <div className="text-4xl font-bold text-emerald-400 mb-2">0</div>
                                <div className="text-sm text-slate-300 uppercase tracking-wider font-semibold">Verified Applications</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300">
                                <div className="text-4xl font-bold text-amber-400 mb-2">0</div>
                                <div className="text-sm text-slate-300 uppercase tracking-wider font-semibold">Pending Verifications</div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-black/20 rounded-xl p-6 border border-white/5">
                            <h4 className="text-lg font-bold mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                Recent Student Applications
                            </h4>
                            <div className="text-center py-8 text-slate-400">
                                <p>No applications pending verification.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

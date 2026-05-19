import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, pendingInstitutions, verifiedInstitutions, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12 min-h-screen bg-slate-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Glassmorphism Container */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 overflow-hidden shadow-xl sm:rounded-2xl p-8 text-white">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-bold mb-1">Admin Portal</h3>
                                <p className="text-slate-300 text-sm">System-wide overview and cross-state analytics.</p>
                            </div>
                            <div className="flex space-x-4">
                                <button className="bg-white/10 hover:bg-white/20 border border-white/20 transition-colors px-6 py-2 rounded-full font-medium text-sm shadow-lg">
                                    Generate Report
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300">
                                <div className="text-4xl font-bold text-indigo-400 mb-2">{stats?.states_count || 0}</div>
                                <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Registered States</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300">
                                <div className="text-4xl font-bold text-emerald-400 mb-2">{stats?.verified_institutions || 0}</div>
                                <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Verified Institutions</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300">
                                <div className="text-4xl font-bold text-blue-400 mb-2">{stats?.active_students || 0}</div>
                                <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Active Students</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300">
                                <div className="text-4xl font-bold text-pink-400 mb-2">₹{stats?.total_disbursed || 0}</div>
                                <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Total Funds Disbursed</div>
                            </div>
                        </div>

                        {/* Analytics Chart Placeholder */}
                        <div className="bg-black/20 rounded-xl p-6 border border-white/5 mb-8 h-64 flex items-center justify-center">
                            <p className="text-slate-500 italic">Cross-State Application Flow Chart will render here</p>
                        </div>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-black/20 rounded-xl p-6 border border-white/5">
                                <h4 className="text-lg font-bold mb-4">Pending Institution Approvals</h4>
                                {pendingInstitutions && pendingInstitutions.length > 0 ? (
                                    <ul className="space-y-3 text-sm">
                                        {pendingInstitutions.map((inst) => (
                                            <li key={inst.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                                                <span>{inst.name}</span>
                                                <button className="text-emerald-400 hover:text-emerald-300 font-semibold underline">Verify</button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center py-4 text-slate-400 text-sm">
                                        <p>No pending requests.</p>
                                    </div>
                                )}
                            </div>
                            <div className="bg-black/20 rounded-xl p-6 border border-white/5">
                                <h4 className="text-lg font-bold mb-4">Verified Institutions Reports</h4>
                                {verifiedInstitutions && verifiedInstitutions.length > 0 ? (
                                    <ul className="space-y-3 text-sm">
                                        {verifiedInstitutions.map((inst) => (
                                            <li key={inst.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                                                <span>{inst.name} ({inst.state.code})</span>
                                                <a href={`/admin/institution/${inst.id}/report`} className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
                                                    Download Report
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center py-4 text-slate-400 text-sm">
                                        <p>No verified institutions found.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

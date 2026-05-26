import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Dashboard({ auth, applications = [], notifications = [] }) {
    const handleDismissNotification = (id) => {
        router.post(route('student.notifications.read', id));
    };

    // Calculate dynamic stats
    const activeApplications = applications.filter(
        app => app.status !== 'rejected' && app.status !== 'approved'
    ).length;

    const totalDisbursed = applications
        .filter(app => app.status === 'approved')
        .reduce((sum, app) => sum + parseFloat(app.scholarship.amount), 0);

    const isVerified = applications.some(
        app => ['institution_verified', 'state_verified', 'approved'].includes(app.status)
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Student Dashboard</h2>}
        >
            <Head title="Student Dashboard" />

            <div className="py-12 min-h-screen bg-slate-900">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Glassmorphism Container */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 overflow-hidden shadow-xl sm:rounded-2xl p-8 text-white">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-bold mb-1">Welcome back, {auth.user.name}!</h3>
                                <p className="text-slate-300 text-sm">Track your scholarship applications and manage documents.</p>
                            </div>
                            <Link href={route('student.apply')} className="bg-indigo-500 hover:bg-indigo-600 transition-colors px-6 py-2 rounded-full font-medium shadow-lg shadow-indigo-500/30">
                                + New Application
                            </Link>
                        </div>

                        {/* Stats / Actions Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300">
                                <div className="text-4xl font-bold text-indigo-400 mb-2">{activeApplications}</div>
                                <div className="text-sm text-slate-300 uppercase tracking-wider font-semibold">Active Applications</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300">
                                <div className="text-4xl font-bold text-emerald-400 mb-2">{isVerified ? 'Verified' : 'Pending'}</div>
                                <div className="text-sm text-slate-300 uppercase tracking-wider font-semibold">Documents Verification</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300">
                                <div className="text-4xl font-bold text-amber-400 mb-2">₹{totalDisbursed.toLocaleString('en-IN')}</div>
                                <div className="text-sm text-slate-300 uppercase tracking-wider font-semibold">Total Disbursed</div>
                            </div>
                        </div>

                        {/* Notifications Center */}
                        {notifications && notifications.length > 0 && (
                            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6 mb-8 transition-all duration-300">
                                <h4 className="text-lg font-bold mb-4 flex items-center text-indigo-300">
                                    <svg className="w-5 h-5 mr-2 text-indigo-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                    Notifications Center ({notifications.length})
                                </h4>
                                <div className="space-y-3">
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className="flex justify-between items-start bg-white/5 p-4 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex-1 pr-4">
                                                <p className="text-sm font-semibold text-white">{notif.data.message}</p>
                                                <span className="text-xs text-slate-400 block mt-1">
                                                    {new Date(notif.created_at).toLocaleDateString(undefined, {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            <button 
                                                onClick={() => handleDismissNotification(notif.id)} 
                                                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline shrink-0"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Activity */}
                        <div className="bg-black/20 rounded-xl p-6 border border-white/5">
                            <h4 className="text-lg font-bold mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Recent Applications
                            </h4>
                            {applications && applications.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 text-slate-300 text-sm">
                                                <th className="pb-3 font-semibold">ID</th>
                                                <th className="pb-3 font-semibold">Scholarship</th>
                                                <th className="pb-3 font-semibold">Status</th>
                                                <th className="pb-3 font-semibold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applications.map((app) => (
                                                <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="py-4">#{app.id.toString().padStart(6, '0')}</td>
                                                    <td className="py-4">{app.scholarship.title}</td>
                                                    <td className="py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                            app.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                                            app.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                            'bg-amber-500/20 text-amber-400'
                                                        }`}>
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        <a href={`/student/application/${app.id}/receipt`} className="text-indigo-400 hover:text-indigo-300 text-sm underline font-medium">
                                                            Download Receipt
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-400">
                                    <p>You haven't applied for any scholarships yet.</p>
                                    <Link href="/student/apply" className="text-indigo-400 hover:text-indigo-300 mt-2 inline-block underline">
                                        Browse available scholarships
                                    </Link>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

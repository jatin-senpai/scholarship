import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Dashboard({ auth, pendingInstitutions, verifiedInstitutions, applications = [], stats }) {
    const handleVerify = (id) => {
        router.post(route('admin.institution.verify', id));
    };

    const handleVerifyState = (id) => {
        router.post(route('admin.application.verifyState', id));
    };

    const handleDisburse = (id) => {
        router.post(route('admin.application.disburse', id));
    };

    const parseRemarks = (remarks) => {
        if (!remarks) return {};
        try {
            return JSON.parse(remarks);
        } catch (e) {
            return { text: remarks };
        }
    };

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
                                <a 
                                    href={route('admin.system.report')} 
                                    target="_blank" 
                                    className="bg-indigo-500 hover:bg-indigo-600 border border-indigo-400/30 transition-all px-6 py-2 rounded-full font-semibold text-sm shadow-lg shadow-indigo-500/20 inline-flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    <span>Generate Report</span>
                                </a>
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

                        {/* Dynamic Cross-State Application Flow Chart */}
                        <div className="bg-black/30 rounded-xl p-6 border border-white/10 mb-8 transition-all duration-300">
                            <h4 className="text-lg font-bold mb-6 flex items-center text-indigo-300 uppercase tracking-wide">
                                <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                Cross-State Application Flow Analytics
                            </h4>
                            
                            {applications && applications.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    
                                    {/* Left 2 Columns: State-wise Bar Chart */}
                                    <div className="lg:col-span-2 bg-white/5 border border-white/5 p-6 rounded-xl flex flex-col justify-between">
                                        <div className="mb-4">
                                            <h5 className="text-sm font-bold text-slate-300 mb-1">State-wise Application Volume</h5>
                                            <p className="text-xs text-slate-400">Total vs Approved applications per student domicile state.</p>
                                        </div>
                                        
                                        <div className="flex items-end justify-around h-44 pt-4 border-b border-white/10 px-4">
                                            {(() => {
                                                const stateMap = {};
                                                applications.forEach(app => {
                                                    const sName = app.student?.home_state?.name || app.student?.home_state?.code || `State #${app.student?.home_state_id}` || 'Unknown';
                                                    if (!stateMap[sName]) stateMap[sName] = { total: 0, approved: 0 };
                                                    stateMap[sName].total += 1;
                                                    if (app.status === 'approved') stateMap[sName].approved += 1;
                                                });
                                                const sList = Object.keys(stateMap).map(key => ({ name: key, ...stateMap[key] }));
                                                const maxVal = Math.max(...sList.map(s => s.total), 1);
                                                
                                                return sList.map((state, idx) => {
                                                    const totalHeight = `${(state.total / maxVal) * 100}%`;
                                                    const approvedHeight = `${(state.approved / maxVal) * 100}%`;
                                                    
                                                    return (
                                                        <div key={idx} className="flex flex-col items-center w-16 group">
                                                            <div className="relative w-12 h-36 flex items-end justify-center space-x-1">
                                                                {/* Tooltip */}
                                                                <div className="absolute bottom-full mb-2 bg-slate-950 border border-white/10 px-2.5 py-1.5 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-20">
                                                                    <div className="font-bold text-white">{state.name}</div>
                                                                    <div className="text-indigo-400">Total: {state.total}</div>
                                                                    <div className="text-emerald-400">Approved: {state.approved}</div>
                                                                </div>
                                                                {/* Total Bar */}
                                                                <div 
                                                                    style={{ height: totalHeight }} 
                                                                    className="w-4 bg-indigo-500/30 group-hover:bg-indigo-500/50 border border-indigo-500/20 rounded-t transition-all duration-300"
                                                                ></div>
                                                                {/* Approved Bar */}
                                                                <div 
                                                                    style={{ height: approvedHeight }} 
                                                                    className="w-4 bg-emerald-500/60 group-hover:bg-emerald-500/80 border border-emerald-500/30 rounded-t transition-all duration-300"
                                                                ></div>
                                                            </div>
                                                            <span className="text-[10px] text-slate-400 mt-2 font-medium tracking-wider uppercase truncate max-w-full text-center">
                                                                {state.name.substring(0, 8)}
                                                            </span>
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </div>
                                        
                                        <div className="flex justify-center space-x-6 mt-4 pt-2 text-xs">
                                            <div className="flex items-center space-x-2">
                                                <span className="w-3 h-3 bg-indigo-500/40 border border-indigo-500/30 rounded"></span>
                                                <span className="text-slate-400">Total Applications</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="w-3 h-3 bg-emerald-500/70 border border-emerald-500/40 rounded"></span>
                                                <span className="text-slate-400">Approved / Disbursed</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Right 1 Column: Status Breakdown */}
                                    <div className="bg-white/5 border border-white/5 p-6 rounded-xl flex flex-col justify-between">
                                        <div>
                                            <h5 className="text-sm font-bold text-slate-300 mb-1">Status-wise Breakdown</h5>
                                            <p className="text-xs text-slate-400">Flow distribution across verification checkpoints.</p>
                                        </div>
                                        
                                        <div className="space-y-4 my-4">
                                            {(() => {
                                                const total = applications.length;
                                                const counts = { submitted: 0, institution_verified: 0, state_verified: 0, approved: 0, rejected: 0 };
                                                applications.forEach(app => {
                                                    if (counts[app.status] !== undefined) counts[app.status] += 1;
                                                });
                                                
                                                const statuses = [
                                                    { key: 'submitted', label: 'Submitted', color: 'bg-amber-500/80', text: 'text-amber-400' },
                                                    { key: 'institution_verified', label: 'Institution Verified', color: 'bg-blue-500/80', text: 'text-blue-400' },
                                                    { key: 'state_verified', label: 'State Verified', color: 'bg-indigo-500/80', text: 'text-indigo-400' },
                                                    { key: 'approved', label: 'Approved & Disbursed', color: 'bg-emerald-500/80', text: 'text-emerald-400' },
                                                    { key: 'rejected', label: 'Rejected', color: 'bg-rose-500/80', text: 'text-rose-400' },
                                                ];
                                                
                                                return statuses.map((item, idx) => {
                                                    const count = counts[item.key] || 0;
                                                    const percent = total > 0 ? (count / total) * 100 : 0;
                                                    
                                                    return (
                                                        <div key={idx} className="space-y-1">
                                                            <div className="flex justify-between text-xs font-semibold">
                                                                <span className="text-slate-300">{item.label}</span>
                                                                <span className={item.text}>{count} ({percent.toFixed(0)}%)</span>
                                                            </div>
                                                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                                                <div 
                                                                    style={{ width: `${percent}%` }} 
                                                                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    </div>
                                    
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-500 italic text-sm">
                                    <p>No application data recorded to generate flow metrics.</p>
                                </div>
                            )}
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
                                                <button onClick={() => handleVerify(inst.id)} className="text-emerald-400 hover:text-emerald-300 font-semibold underline">Verify</button>
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

                        {/* Applications Verification & Funds Disbursal Workspace */}
                        <div className="bg-black/20 rounded-xl p-6 border border-white/5 mt-8">
                            <h4 className="text-lg font-bold mb-4 flex items-center text-indigo-300">
                                <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                Applications Verification & Funds Disbursal Workspace ({applications.length})
                            </h4>
                            {applications && applications.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead>
                                            <tr className="border-b border-white/10 text-slate-300">
                                                <th className="pb-3 font-semibold">ID</th>
                                                <th className="pb-3 font-semibold">Student Name & State</th>
                                                <th className="pb-3 font-semibold">Scholarship</th>
                                                <th className="pb-3 font-semibold">Academic Details</th>
                                                <th className="pb-3 font-semibold">Status</th>
                                                <th className="pb-3 font-semibold text-right">Actions / Transactions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applications.map((app) => {
                                                const remarksObj = parseRemarks(app.remarks);
                                                return (
                                                    <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                        <td className="py-4">#{app.id.toString().padStart(6, '0')}</td>
                                                        <td className="py-4">
                                                            <div className="font-semibold text-white">{app.student?.user?.name || 'Unknown Student'}</div>
                                                            <div className="text-xs text-slate-400">Domicile: {app.student?.homeState?.name || app.student?.home_state?.name || app.student?.home_state_id || 'Unknown'}</div>
                                                            <div className="text-xs text-slate-400">Institution: {app.institution?.name || 'Unknown Institution'}</div>
                                                        </td>
                                                        <td className="py-4">
                                                            <div className="text-white font-medium">{app.scholarship?.title || 'Unknown Scholarship'}</div>
                                                            <div className="text-xs text-slate-400">Amount: ₹{app.scholarship?.amount ? parseFloat(app.scholarship.amount).toLocaleString('en-IN') : '0.00'}</div>
                                                        </td>
                                                        <td className="py-4">
                                                            <div className="text-xs text-slate-300">Marks: <span className="font-bold text-indigo-300">{app.student?.marks_percentage || '0'}%</span></div>
                                                            <div className="text-xs text-slate-300">Income: <span className="font-bold text-amber-300">₹{app.student?.annual_income ? parseFloat(app.student.annual_income).toLocaleString('en-IN') : '0.00'}</span></div>
                                                        </td>
                                                        <td className="py-4">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                                app.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                                app.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                                                app.status === 'state_verified' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                                                                app.status === 'institution_verified' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                                'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                                            }`}>
                                                                {app.status === 'state_verified' ? 'State Verified' :
                                                                 app.status === 'institution_verified' ? 'Institution Verified' :
                                                                 app.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 text-right">
                                                            {app.status === 'institution_verified' && (
                                                                <button
                                                                    onClick={() => handleVerifyState(app.id)}
                                                                    className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 transition-all px-4 py-1.5 rounded-full font-semibold text-xs"
                                                                >
                                                                    Verify (State Level)
                                                                </button>
                                                            )}
                                                            {app.status === 'state_verified' && (
                                                                <button
                                                                    onClick={() => handleDisburse(app.id)}
                                                                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all px-4 py-1.5 rounded-full font-semibold text-xs animate-pulse"
                                                                >
                                                                    Approve & Disburse
                                                                </button>
                                                            )}
                                                            {app.status === 'approved' && remarksObj.transaction_id && (
                                                                <div className="inline-block text-left">
                                                                    <div className="text-xs text-emerald-400 font-bold flex items-center justify-end">
                                                                        <span className="mr-1">✓</span> Disbursed
                                                                    </div>
                                                                    <div className="text-[10px] font-mono text-slate-400 bg-black/40 border border-white/5 px-2 py-0.5 rounded mt-1">
                                                                        {remarksObj.transaction_id}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {app.status === 'submitted' && (
                                                                <span className="text-xs text-slate-500 italic">Awaiting Inst. Verification</span>
                                                            )}
                                                            {app.status === 'rejected' && (
                                                                <span className="text-xs text-rose-400 italic">Rejected</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500 text-sm">
                                    <p>No scholarship applications recorded yet.</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

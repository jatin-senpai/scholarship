import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Apply({ auth, scholarships, institutions, states }) {
    const { data, setData, post, processing, errors } = useForm({
        scholarship_id: '',
        home_state_id: '',
        studying_state_id: '',
        institution_id: '',
        marks_percentage: '',
        annual_income: '',
        documents: null,
    });

    const selectedScholarship = scholarships.find(s => String(s.id) === String(data.scholarship_id));

    const checkEligibility = () => {
        if (!selectedScholarship) return null;

        const checks = [];
        let isEligible = true;

        // Domicile State check
        if (data.home_state_id) {
            const homeStateMatch = String(data.home_state_id) === String(selectedScholarship.state_id);
            checks.push({
                label: 'Domicile State (Home State)',
                passed: homeStateMatch,
                reason: homeStateMatch ? 'Matches domicile criteria' : `Scholarship requires domicile in ${states.find(s => String(s.id) === String(selectedScholarship.state_id))?.name || 'correct state'}`
            });
            if (!homeStateMatch) isEligible = false;
        } else {
            checks.push({ label: 'Domicile State (Home State)', passed: null, reason: 'Please select Home State' });
        }

        // Marks Check
        const minMarks = selectedScholarship.eligibility?.min_marks;
        if (minMarks !== undefined) {
            if (data.marks_percentage !== '') {
                const marksPassed = parseFloat(data.marks_percentage) >= parseFloat(minMarks);
                checks.push({
                    label: `Academic Performance (Min Required: ${minMarks}%)`,
                    passed: marksPassed,
                    reason: marksPassed ? `Your marks: ${data.marks_percentage}% (Eligible)` : `Your marks: ${data.marks_percentage}% (Required: ${minMarks}%)`
                });
                if (!marksPassed) isEligible = false;
            } else {
                checks.push({ label: `Academic Performance (Min Required: ${minMarks}%)`, passed: null, reason: 'Enter your academic marks percentage' });
            }
        }

        // Income Check
        const maxIncome = selectedScholarship.eligibility?.max_income;
        if (maxIncome !== undefined) {
            if (data.annual_income !== '') {
                const incomePassed = parseFloat(data.annual_income) <= parseFloat(maxIncome);
                checks.push({
                    label: `Family Income Limit (Max Limit: ₹${parseInt(maxIncome).toLocaleString('en-IN')})`,
                    passed: incomePassed,
                    reason: incomePassed ? `Your income: ₹${parseFloat(data.annual_income).toLocaleString('en-IN')} (Eligible)` : `Your income: ₹${parseFloat(data.annual_income).toLocaleString('en-IN')} (Max allowed: ₹${parseInt(maxIncome).toLocaleString('en-IN')})`
                });
                if (!incomePassed) isEligible = false;
            } else {
                checks.push({ label: `Family Income Limit (Max Limit: ₹${parseInt(maxIncome).toLocaleString('en-IN')})`, passed: null, reason: 'Enter your annual family income' });
            }
        }

        return { isEligible, checks };
    };

    const eligibilityResult = checkEligibility();

    const submit = (e) => {
        e.preventDefault();
        post(route('student.apply'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">New Scholarship Application</h2>}
        >
            <Head title="Apply for Scholarship" />

            <div className="py-12 min-h-screen bg-slate-900">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Glassmorphism Container */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 overflow-hidden shadow-xl sm:rounded-2xl p-8 text-white">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold mb-2">Application Form</h3>
                            <p className="text-slate-300 text-sm">Please fill out all the details carefully to ensure smooth verification.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* Scholarship Selection */}
                            <div>
                                <InputLabel htmlFor="scholarship_id" value="Select Scholarship" className="text-slate-300" />
                                <select
                                    id="scholarship_id"
                                    name="scholarship_id"
                                    className="mt-1 block w-full bg-white/5 border border-white/10 text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.scholarship_id}
                                    onChange={(e) => setData('scholarship_id', e.target.value)}
                                    required
                                >
                                    <option value="" className="text-gray-900">-- Choose a Scholarship --</option>
                                    {scholarships.map(s => (
                                        <option key={s.id} value={s.id} className="text-gray-900">{s.title}</option>
                                    ))}
                                </select>
                                <InputError message={errors.scholarship_id} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Home State */}
                                <div>
                                    <InputLabel htmlFor="home_state_id" value="Home State (Domicile)" className="text-slate-300" />
                                    <select
                                        id="home_state_id"
                                        name="home_state_id"
                                        className="mt-1 block w-full bg-white/5 border border-white/10 text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.home_state_id}
                                        onChange={(e) => setData('home_state_id', e.target.value)}
                                        required
                                    >
                                        <option value="" className="text-gray-900">-- Select State --</option>
                                        {states.map(s => (
                                            <option key={s.id} value={s.id} className="text-gray-900">{s.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.home_state_id} className="mt-2" />
                                </div>

                                {/* Studying State */}
                                <div>
                                    <InputLabel htmlFor="studying_state_id" value="State where Studying" className="text-slate-300" />
                                    <select
                                        id="studying_state_id"
                                        name="studying_state_id"
                                        className="mt-1 block w-full bg-white/5 border border-white/10 text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.studying_state_id}
                                        onChange={(e) => setData('studying_state_id', e.target.value)}
                                        required
                                    >
                                        <option value="" className="text-gray-900">-- Select State --</option>
                                        {states.map(s => (
                                            <option key={s.id} value={s.id} className="text-gray-900">{s.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.studying_state_id} className="mt-2" />
                                </div>
                            </div>

                            {/* Academic Marks & Family Income */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="marks_percentage" value="Academic Marks (%)" className="text-slate-300" />
                                    <TextInput
                                        id="marks_percentage"
                                        type="number"
                                        step="0.01"
                                        name="marks_percentage"
                                        value={data.marks_percentage}
                                        className="mt-1 block w-full bg-white/5 border border-white/10 text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) => setData('marks_percentage', e.target.value)}
                                        required
                                        placeholder="e.g. 85.50"
                                        min="0"
                                        max="100"
                                    />
                                    <InputError message={errors.marks_percentage} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="annual_income" value="Annual Family Income (₹)" className="text-slate-300" />
                                    <TextInput
                                        id="annual_income"
                                        type="number"
                                        step="0.01"
                                        name="annual_income"
                                        value={data.annual_income}
                                        className="mt-1 block w-full bg-white/5 border border-white/10 text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) => setData('annual_income', e.target.value)}
                                        required
                                        placeholder="e.g. 150000"
                                        min="0"
                                    />
                                    <InputError message={errors.annual_income} className="mt-2" />
                                </div>
                            </div>

                            {/* Real-time Eligibility Status Card */}
                            {eligibilityResult && (
                                <div className="bg-black/30 border border-white/10 rounded-xl p-6 transition-all duration-300">
                                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                                        <h4 className="text-md font-bold uppercase tracking-wider text-slate-300">
                                            Automated Eligibility Check
                                        </h4>
                                        <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                                            eligibilityResult.isEligible 
                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                        }`}>
                                            {eligibilityResult.isEligible ? 'Eligible' : 'Ineligible'}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {eligibilityResult.checks.map((chk, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`text-md font-bold ${
                                                        chk.passed === null 
                                                            ? 'text-yellow-400' 
                                                            : chk.passed 
                                                                ? 'text-emerald-400' 
                                                                : 'text-rose-400'
                                                    }`}>
                                                        {chk.passed === null ? '●' : chk.passed ? '✓' : '✗'}
                                                    </span>
                                                    <span className="text-slate-300">{chk.label}</span>
                                                </div>
                                                <span className={`text-xs ${
                                                    chk.passed === null 
                                                        ? 'text-slate-500 italic' 
                                                        : chk.passed 
                                                            ? 'text-emerald-400 font-medium' 
                                                            : 'text-rose-400 font-medium'
                                                }`}>
                                                    {chk.reason}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Institution */}
                            <div>
                                <InputLabel htmlFor="institution_id" value="Institution" className="text-slate-300" />
                                <select
                                    id="institution_id"
                                    name="institution_id"
                                    className="mt-1 block w-full bg-white/5 border border-white/10 text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.institution_id}
                                    onChange={(e) => setData('institution_id', e.target.value)}
                                    required
                                >
                                    <option value="" className="text-gray-900">-- Select Institution --</option>
                                    {institutions.map(i => (
                                        <option key={i.id} value={i.id} className="text-gray-900">{i.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.institution_id} className="mt-2" />
                                <p className="text-xs text-slate-400 mt-2">Only verified institutions are available for selection.</p>
                            </div>

                            {/* Documents Upload */}
                            <div>
                                <InputLabel htmlFor="documents" value="Identity & Supporting Documents (PDF/JPG/PNG)" className="text-slate-300" />
                                <input
                                    id="documents"
                                    type="file"
                                    name="documents"
                                    className="mt-1 block w-full text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30 transition-colors"
                                    onChange={(e) => setData('documents', e.target.files[0])}
                                    required
                                />
                                <InputError message={errors.documents} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-8 border-t border-white/10 pt-6">
                                <Link href={route('student.dashboard')} className="text-slate-400 hover:text-white mr-6 transition-colors">
                                    Cancel
                                </Link>
                                <PrimaryButton className="bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/30" disabled={processing}>
                                    Submit Application
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

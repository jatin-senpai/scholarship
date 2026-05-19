import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register({ states }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        state_id: '',
        reg_no: '',
        documents: null,
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('institution.register'));
    };

    return (
        <GuestLayout>
            <Head title="Institution Registration" />

            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">Institution Registration</h2>
                <p className="text-sm text-slate-400 mt-1">Join the Cross-State Scholarship Network</p>
            </div>

            <form onSubmit={submit} encType="multipart/form-data">
                <div>
                    <InputLabel htmlFor="name" value="Institution Name" className="text-slate-300" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Official Email" className="text-slate-300" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-slate-800/50 border-slate-600 text-white"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="state_id" value="State" className="text-slate-300" />
                        <select
                            id="state_id"
                            name="state_id"
                            value={data.state_id}
                            className="mt-1 block w-full border-slate-600 bg-slate-800/50 text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) => setData('state_id', e.target.value)}
                            required
                        >
                            <option value="">Select State</option>
                            {states.map((state) => (
                                <option key={state.id} value={state.id}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.state_id} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="reg_no" value="Registration / AISHE Code" className="text-slate-300" />
                        <TextInput
                            id="reg_no"
                            name="reg_no"
                            value={data.reg_no}
                            className="mt-1 block w-full bg-slate-800/50 border-slate-600 text-white"
                            onChange={(e) => setData('reg_no', e.target.value)}
                            required
                        />
                        <InputError message={errors.reg_no} className="mt-2" />
                    </div>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="documents" value="Accreditation Document (PDF/JPG)" className="text-slate-300" />
                    <input
                        id="documents"
                        type="file"
                        name="documents"
                        className="mt-1 block w-full text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer"
                        onChange={(e) => setData('documents', e.target.files[0])}
                        required
                    />
                    <InputError message={errors.documents} className="mt-2" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="password" value="Password" className="text-slate-300" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full bg-slate-800/50 border-slate-600 text-white"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-slate-300" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full bg-slate-800/50 border-slate-600 text-white"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                </div>

                <div className="flex items-center justify-end mt-6">
                    <Link
                        href={route('login')}
                        className="underline text-sm text-slate-400 hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4 bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" disabled={processing}>
                        Register Institution
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}

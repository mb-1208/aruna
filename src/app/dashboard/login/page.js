import LoginForm from './LoginForm';
import { IconDeviceDesktop } from '@tabler/icons-react';

export const metadata = {
  title: 'Admin Login - Aruna',
  description: 'Login to Aruna CMS',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans w-full">
      <div className="mx-auto w-full max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 uppercase tracking-widest">
          Aruna CMS
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm rounded-xl border border-gray-200">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

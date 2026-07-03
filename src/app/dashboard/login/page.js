import LoginForm from './LoginForm';
import { IconDeviceDesktop } from '@tabler/icons-react';

export const metadata = {
  title: 'Admin Login - Aruna',
  description: 'Login to Aruna CMS',
};

export default function LoginPage() {
  return (
    <>
      <div className="flex lg:hidden fixed inset-0 z-[9999] bg-white flex-col items-center justify-center p-8 text-center">
        <IconDeviceDesktop size={64} className="text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold tracking-widest uppercase mb-4 text-black">Desktop Only</h2>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          The Aruna CMS dashboard is highly detailed and requires a larger screen for the best experience. 
          Please access it from a desktop or laptop device.
        </p>
      </div>

      <div className="hidden lg:flex min-h-screen bg-gray-100 flex-col justify-center py-12 px-8 font-sans w-full">
        <div className="mx-auto w-full max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 uppercase tracking-widest">
            Aruna CMS
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <div className="mt-8 mx-auto w-full max-w-md">
          <div className="bg-white py-8 px-10 shadow rounded-lg border border-gray-200">
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}

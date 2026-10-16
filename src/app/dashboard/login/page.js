import LoginForm from './LoginForm';
import { IconDeviceDesktop } from '@tabler/icons-react';

export const metadata = {
  title: 'Admin Login - Aruna Studio',
  description: 'Login to Aruna CMS',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#faf6f0] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans w-full relative overflow-hidden">
      {/* Subtle warm background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-[#feeedf]/60 to-transparent pointer-events-none -z-0" />

      <div className="mx-auto w-full max-w-md relative z-10 text-center">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#feeedf] text-[#99611b] text-[11px] font-semibold tracking-widest uppercase border border-[#ebd8c0] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d18529]" />
          Aruna Studio CMS
        </div>

        <h1 className="text-3xl sm:text-4xl font-light tracking-[0.25em] text-[#1c1917] uppercase">
          Aruna
        </h1>
        <p className="mt-2 text-xs text-[#786e65] max-w-xs mx-auto leading-relaxed">
          Sign in to access the studio dashboard and curate retreats, content, and experiences.
        </p>
      </div>

      <div className="mt-8 mx-auto w-full max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-xs py-8 px-6 sm:px-10 shadow-[0_12px_40px_rgba(209,133,41,0.06)] rounded-2xl border border-[#ebd8c0]/80">
          <LoginForm />
        </div>

        <p className="text-center text-[11px] text-[#9c9184] tracking-wider uppercase mt-6">
          Protected Studio Access &bull; Aruna Travel Studio
        </p>
      </div>
    </div>
  );
}

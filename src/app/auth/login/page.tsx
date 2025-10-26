"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setInfo(null);
    
    try {
      const { data, error: signInError } = await signIn(email, password);
      
      if (signInError) {
        if (signInError.message.includes('Email not confirmed')) {
          setInfo('⚠️ Lütfen e-posta adresinizi doğrulayın. Gelen kutunuzu kontrol edin.');
        } else if (signInError.message.includes('Invalid login credentials')) {
          setError('❌ E-posta veya şifre hatalı!');
        } else {
          setError(`❌ Giriş hatası: ${signInError.message}`);
        }
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        // Check if email is confirmed
        if (!data.user.email_confirmed_at) {
          setInfo('⚠️ E-posta adresiniz henüz doğrulanmamış. Lütfen gelen kutunuzu kontrol edin.');
          setIsLoading(false);
          return;
        }

        // Successful login - redirect after short delay to ensure session is saved
        const redirect = searchParams.get('redirect') || '/dashboard';
        setTimeout(() => {
          window.location.href = redirect;
        }, 100);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('❌ Bir hata oluştu. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <div className="w-48 h-12 relative">
          <Image
            src="/callmetriclogo.png"
            alt="CallMetricAI"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Giriş Yap
        </h1>
        <p className="text-gray-600">
          Hesabınıza erişim sağlayın
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Info Message */}
      {info && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
          <p className="text-sm">{info}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
            E-posta Adresi
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder:text-gray-400"
            placeholder="ornek@email.com"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
            Şifre
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder:text-gray-400"
            placeholder="••••••••"
          />
        </div>

        {/* Forgot Password Link */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Beni hatırla
            </label>
          </div>
          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-purple-600 hover:text-purple-500"
          >
            Şifremi unuttum
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">veya</span>
        </div>
      </div>

      {/* Social Login */}
      <div className="space-y-3">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-gray-700 font-medium">Google ile devam et</span>
        </button>
      </div>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Hesabınız yok mu?{" "}
        <Link
          href="/auth/signup"
          className="font-medium text-purple-600 hover:text-purple-500"
        >
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">Yükleniyor...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

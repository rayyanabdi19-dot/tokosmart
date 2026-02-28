import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Store, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    } else {
      if (!name.trim()) { setError('Nama harus diisi'); setIsLoading(false); return; }
      const { error } = await signUp(email, password, name);
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Pendaftaran berhasil! Silakan cek email untuk verifikasi.');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl pos-gradient flex items-center justify-center mb-4 shadow-lg">
            <Store className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">KasirPro</h1>
          <p className="text-muted-foreground text-sm mt-1">Point of Sale System</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-muted rounded-xl p-1 mb-6">
          <button onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${isLogin ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>
            Login
          </button>
          <button onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${!isLogin ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>
            Daftar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ahmad Kasir"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="kasir@toko.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" required />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-destructive text-xs bg-destructive/10 rounded-lg p-2.5">{error}</p>}
          {success && <p className="text-success text-xs bg-success/10 rounded-lg p-2.5">{success}</p>}

          <button type="submit" disabled={isLoading}
            className="w-full py-3 rounded-xl pos-gradient text-primary-foreground font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50">
            {isLoading ? (isLogin ? 'Masuk...' : 'Mendaftar...') : (isLogin ? 'Login' : 'Daftar Akun')}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-8">
          KasirPro v1.0 — Solusi POS untuk UMKM
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

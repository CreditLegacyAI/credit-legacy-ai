import { createClient } from '@/lib/supabase-server';
import { User, CreditCard, Bell, Shield } from 'lucide-react';

export default async function SettingsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isES = locale === 'es';

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        {isES ? 'Configuración' : 'Settings'}
      </h1>
      <p className="text-graydark mb-8">
        {isES
          ? 'Administra tu cuenta, plan y preferencias.'
          : 'Manage your account, plan and preferences.'}
      </p>

      {/* Profile */}
      <div className="bg-white rounded-2xl p-6 border border-gold/20 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5 text-gold" />
          <h3 className="font-bold text-black">{isES ? 'Perfil' : 'Profile'}</h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gold/10">
            <span className="text-graydark">{isES ? 'Email' : 'Email'}</span>
            <span className="text-black font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gold/10">
            <span className="text-graydark">{isES ? 'Nombre' : 'Name'}</span>
            <span className="text-black font-medium">
              {user?.user_metadata?.full_name || '-'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-graydark">{isES ? 'Miembro desde' : 'Member since'}</span>
            <span className="text-black font-medium">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Plan */}
      <div className="bg-white rounded-2xl p-6 border border-gold/20 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-gold" />
          <h3 className="font-bold text-black">{isES ? 'Plan Actual' : 'Current Plan'}</h3>
        </div>
        <div className="bg-gold/10 rounded-xl p-4 text-center">
          <div className="text-xs text-gold uppercase tracking-wider font-medium mb-1">
            {isES ? 'Beta Tester' : 'Beta Tester'}
          </div>
          <div className="text-2xl font-bold text-black mb-1">
            {isES ? 'Acceso Pre-Lanzamiento' : 'Pre-Launch Access'}
          </div>
          <p className="text-xs text-graydark">
            {isES
              ? 'Tendrás precio especial de fundador cuando lancemos oficialmente el 15 de abril de 2028.'
              : "You'll have founder pricing when we officially launch on April 15, 2028."}
          </p>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-6 border border-gold/20 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-gold" />
          <h3 className="font-bold text-black">{isES ? 'Notificaciones' : 'Notifications'}</h3>
        </div>
        <p className="text-sm text-graydark">
          {isES ? 'Próximamente · Q3 2026' : 'Coming soon · Q3 2026'}
        </p>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl p-6 border border-gold/20">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-gold" />
          <h3 className="font-bold text-black">{isES ? 'Seguridad' : 'Security'}</h3>
        </div>
        <ul className="space-y-2 text-sm text-graydark">
          <li>✓ {isES ? 'Cifrado AES-256 de datos sensibles' : 'AES-256 encryption of sensitive data'}</li>
          <li>✓ {isES ? 'Conexión HTTPS obligatoria' : 'Mandatory HTTPS connection'}</li>
          <li>✓ {isES ? 'Audit logs activos' : 'Active audit logs'}</li>
          <li>✓ {isES ? 'Row Level Security en database' : 'Row Level Security in database'}</li>
        </ul>
      </div>
    </div>
  );
}

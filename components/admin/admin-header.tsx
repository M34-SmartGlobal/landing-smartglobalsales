import { signOut } from "@/lib/actions/auth";

type AdminHeaderProps = {
  email: string;
};

export function AdminHeader({ email }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-brand-line bg-white/85 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-red">Administración</p>
          <h1 className="mt-1 text-xl font-black tracking-tight text-brand-black">Panel de control</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs text-brand-muted">Sesión activa</p>
            <p className="text-sm font-bold text-brand-graphite">{email}</p>
          </div>
          <form action={signOut}>
            <button className="rounded-full border border-brand-line bg-white px-4 py-2 text-sm font-bold text-brand-graphite transition hover:border-brand-red hover:text-brand-red">
              Salir
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

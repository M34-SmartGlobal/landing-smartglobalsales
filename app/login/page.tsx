import { signIn } from "@/lib/actions/auth";

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(208,0,0,0.14),transparent_34%),#f8fafc] px-6 py-12">
      <section className="w-full max-w-md rounded-[2rem] border border-brand-line bg-white p-8 shadow-panel">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-red">
            Smart Global Sales
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-brand-black">
            Acceso administrativo
          </h1>
          <p className="mt-3 text-sm text-brand-muted">
            Ingresa con tus credenciales para gestionar leads, campañas y textos legales.
          </p>
        </div>

        <form action={signIn} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-brand-graphite">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="h-12 w-full rounded-2xl border border-brand-line bg-white px-4 text-sm outline-none transition focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
              placeholder="admin@smartglobalsales.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-brand-graphite">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="h-12 w-full rounded-2xl border border-brand-line bg-white px-4 text-sm outline-none transition focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
              placeholder="••••••••"
            />
          </div>

          {error ? <p className="text-sm font-semibold text-brand-red">{error}</p> : null}

          <button className="h-12 w-full rounded-full bg-brand-red px-5 text-sm font-bold text-white shadow-glow transition hover:bg-brand-red-dark focus:outline-none focus:ring-4 focus:ring-brand-red/20">
            Iniciar sesión
          </button>
        </form>
      </section>
    </main>
  );
}

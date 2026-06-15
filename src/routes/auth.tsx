import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { VastraLogo } from "@/components/VastraLogo";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Atelier Login — Vastra Luxe" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created");
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="silk-bg min-h-screen flex items-center justify-center px-6 py-16">
      <Toaster position="top-center" />
      <div className="luxe-card p-10 w-full max-w-md">
        <Link to="/" className="flex items-center gap-3 justify-center mb-6">
          <VastraLogo className="h-14 w-14" />
        </Link>
        <h1 className="font-display text-3xl text-[var(--maroon)] text-center">Atelier Access</h1>
        <p className="mt-2 text-center text-sm text-[var(--muted-foreground)]">
          {mode === "signin" ? "Sign in to manage Vastra Luxe" : "Create your admin account"}
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-[var(--gold)]/40 bg-[var(--ivory)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/40 text-sm" />
          <input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-[var(--gold)]/40 bg-[var(--ivory)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/40 text-sm" />
          <button type="submit" disabled={loading} className="btn-luxe w-full disabled:opacity-60">
            {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-[0.7rem] tracking-[0.25em] uppercase text-[var(--muted-foreground)] hover:text-[var(--maroon)]">
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
        <div className="mt-6 text-center text-[0.65rem] tracking-[0.2em] uppercase text-[var(--muted-foreground)]">
          Admin: kethansaipeddina@gmail.com
        </div>
      </div>
    </div>
  );
}

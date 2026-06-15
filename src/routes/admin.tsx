import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { Trash2, LogOut, Calendar, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { VastraLogo } from "@/components/VastraLogo";
import {
  checkIsAdmin, getLaunchDate, updateLaunchDate,
  listSubscribers, deleteSubscriber,
} from "@/lib/coming-soon.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Vastra Luxe" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [authed, setAuthed] = useState<boolean | null>(null);

  const checkAdmin = useServerFn(checkIsAdmin);
  const fetchDate = useServerFn(getLaunchDate);
  const setDate = useServerFn(updateLaunchDate);
  const listSubs = useServerFn(listSubscribers);
  const delSub = useServerFn(deleteSubscriber);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/auth" });
      else setAuthed(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/auth" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const adminQ = useQuery({
    queryKey: ["isAdmin"], enabled: !!authed, queryFn: () => checkAdmin(),
  });
  const dateQ = useQuery({
    queryKey: ["launchDate"], enabled: !!authed, queryFn: () => fetchDate(),
  });
  const subsQ = useQuery({
    queryKey: ["subscribers"], enabled: !!adminQ.data?.isAdmin, queryFn: () => listSubs(),
  });

  const updateM = useMutation({
    mutationFn: (iso: string) => setDate({ data: { launchDate: iso } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["launchDate"] }); toast.success("Launch date updated"); },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });
  const deleteM = useMutation({
    mutationFn: (id: string) => delSub({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["subscribers"] }); toast.success("Removed"); },
  });

  const [localDate, setLocalDate] = useState("");
  useEffect(() => {
    if (dateQ.data?.launchDate) {
      const d = new Date(dateQ.data.launchDate);
      const pad = (n: number) => String(n).padStart(2, "0");
      setLocalDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
    }
  }, [dateQ.data]);

  if (!authed) return <div className="silk-bg min-h-screen flex items-center justify-center text-[var(--muted-foreground)]">Loading…</div>;

  if (adminQ.data && !adminQ.data.isAdmin) {
    return (
      <div className="silk-bg min-h-screen flex items-center justify-center px-6">
        <div className="luxe-card p-10 max-w-md text-center">
          <h1 className="font-display text-3xl text-[var(--maroon)]">Access Restricted</h1>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">This area is reserved for the Vastra Luxe atelier team.</p>
          <button onClick={() => supabase.auth.signOut()} className="btn-ghost-luxe mt-6">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="silk-bg min-h-screen">
      <Toaster position="top-center" />
      <header className="px-6 sm:px-10 py-6 flex items-center justify-between border-b border-[var(--gold)]/30 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <VastraLogo className="h-12 w-12" />
          <div>
            <div className="font-display text-xl text-[var(--maroon)]">Vastra Luxe</div>
            <div className="text-[0.6rem] tracking-[0.3em] uppercase text-[var(--muted-foreground)]">Admin Atelier</div>
          </div>
        </Link>
        <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }}
          className="btn-ghost-luxe flex items-center gap-2"><LogOut className="h-3.5 w-3.5" /> Sign Out</button>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-12 grid lg:grid-cols-[1fr_2fr] gap-8">
        <section className="luxe-card p-8 h-fit">
          <div className="flex items-center gap-2 text-[var(--gold)]"><Calendar className="h-4 w-4" />
            <span className="text-[0.65rem] tracking-[0.3em] uppercase">Launch Date</span></div>
          <h2 className="mt-3 font-display text-2xl text-[var(--maroon)]">Set Unveiling</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">Update the public countdown.</p>
          <form onSubmit={(e) => { e.preventDefault(); updateM.mutate(new Date(localDate).toISOString()); }} className="mt-6 space-y-4">
            <input type="datetime-local" value={localDate} onChange={(e) => setLocalDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--gold)]/40 bg-[var(--ivory)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/40 text-sm" />
            <button type="submit" disabled={updateM.isPending} className="btn-luxe w-full">
              {updateM.isPending ? "Saving…" : "Update"}
            </button>
          </form>
          {dateQ.data && (
            <div className="mt-6 text-xs text-[var(--muted-foreground)]">
              Current: <span className="text-[var(--ink)]">{new Date(dateQ.data.launchDate).toLocaleString()}</span>
            </div>
          )}
        </section>

        <section className="luxe-card p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-[var(--gold)]"><Users className="h-4 w-4" />
                <span className="text-[0.65rem] tracking-[0.3em] uppercase">Waitlist</span></div>
              <h2 className="mt-3 font-display text-2xl text-[var(--maroon)]">Subscribers</h2>
            </div>
            <div className="font-display text-4xl text-[var(--maroon)]">{subsQ.data?.subscribers.length ?? 0}</div>
          </div>
          <div className="mt-6 divide-y divide-[var(--gold)]/20">
            {subsQ.data?.subscribers.length === 0 && (
              <div className="text-sm text-[var(--muted-foreground)] py-8 text-center">No subscribers yet.</div>
            )}
            {subsQ.data?.subscribers.map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-[var(--ink)]">{s.email}</div>
                  <div className="text-[0.65rem] tracking-wider uppercase text-[var(--muted-foreground)]">
                    {new Date(s.created_at).toLocaleString()}
                  </div>
                </div>
                <button onClick={() => deleteM.mutate(s.id)} className="p-2 rounded-full hover:bg-[var(--maroon)]/10 text-[var(--maroon)]">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

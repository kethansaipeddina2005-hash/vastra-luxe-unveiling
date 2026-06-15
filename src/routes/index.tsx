import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { Mail, Globe, Sparkles, Instagram, Facebook } from "lucide-react";

import { VastraLogo } from "@/components/VastraLogo";
import { Countdown } from "@/components/Countdown";
import { subscribeEmail, getLaunchDate } from "@/lib/coming-soon.functions";

import heroImg from "@/assets/silk-hero.jpg";
import col1 from "@/assets/collection-1.jpg";
import col2 from "@/assets/collection-2.jpg";
import col3 from "@/assets/collection-3.jpg";
import backdropAsset from "@/assets/hero-saree.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vastra Luxe — Grace in Every Drape | Launching Soon" },
      {
        name: "description",
        content:
          "Vastra Luxe — a curated world of exclusive sarees. Only 50 unique pieces every month. Heritage craftsmanship meets timeless elegance. Launching soon.",
      },
      { property: "og:title", content: "Vastra Luxe — Grace in Every Drape" },
      {
        property: "og:description",
        content: "A new era of timeless elegance is arriving. Join the waitlist.",
      },
    ],
  }),
  component: Index,
});

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 text-[var(--gold)]">
      <span className="block h-px w-12 bg-[var(--gold)]/60" />
      <Sparkles className="h-3 w-3" />
      <span className="block h-px w-12 bg-[var(--gold)]/60" />
    </div>
  );
}

function Index() {
  const fetchLaunch = useServerFn(getLaunchDate);
  const subscribe = useServerFn(subscribeEmail);
  const { data } = useQuery({ queryKey: ["launchDate"], queryFn: () => fetchLaunch() });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await subscribe({ data: { email } });
      toast.success("You're on the list", { description: "We'll be in touch with exclusive previews." });
      setEmail("");
    } catch (err: any) {
      toast.error("Something went wrong", { description: err?.message ?? "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="silk-bg min-h-screen text-[var(--foreground)] overflow-hidden relative">
      {/* Backdrop image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backdropAsset.url})` }}
      />
      <div className="fixed inset-0 z-0 bg-[var(--ivory)]/80" />
      <Toaster position="top-center" theme="light" />

      {/* Nav */}
      <header className="relative z-20 px-6 sm:px-10 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <VastraLogo className="h-12 w-12 sm:h-14 sm:w-14" />
          <div className="leading-tight">
            <div className="font-display text-xl sm:text-2xl text-[var(--maroon)] tracking-wide">
              Vastra Luxe
            </div>
            <div className="text-[0.6rem] tracking-[0.32em] uppercase text-[var(--muted-foreground)]">
              Grace in Every Drape
            </div>
          </div>
        </div>
        <Link to="/auth" className="text-[0.7rem] tracking-[0.25em] uppercase text-[var(--muted-foreground)] hover:text-[var(--maroon)] transition-colors">
          Atelier Login
        </Link>
      </header>

      {/* HERO */}
      <section className="relative px-6 sm:px-10 pt-8 pb-24 max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div className="relative z-10 fade-up">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[var(--gold)]/40 bg-[var(--ivory)]/60 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
            <span className="text-[0.65rem] tracking-[0.3em] uppercase text-[var(--maroon)]">
              Launching Soon
            </span>
          </div>

          <h1 className="mt-8 font-display text-[2.5rem] sm:text-6xl lg:text-7xl leading-[1.05] text-[var(--maroon)]">
            A New Era of
            <span className="block italic"> Timeless Elegance</span>
            <span className="block text-[var(--ink)]/80 text-3xl sm:text-4xl lg:text-5xl mt-3 not-italic">is arriving.</span>
          </h1>

          <p className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed text-[var(--muted-foreground)] font-light">
            Vastra Luxe is preparing something truly special — a curated world of
            exclusive sarees crafted for elegance, grace, and individuality.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#notify" className="btn-luxe">Join the Waitlist</a>
            <a href="#story" className="btn-ghost-luxe">Our Story</a>
          </div>
        </div>

        <div className="relative fade-in">
          <div className="absolute -inset-8 silk-shimmer rounded-[2rem] opacity-60 pointer-events-none" />
          <div className="relative rounded-[1.5rem] overflow-hidden shadow-[var(--shadow-luxe)] border border-[var(--gold)]/30">
            <img src={heroImg} alt="Luxury silk saree with gold zari" width={1600} height={1200} className="w-full h-[28rem] sm:h-[34rem] object-cover" />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--maroon)]/90 via-[var(--maroon)]/40 to-transparent">
              <div className="text-[var(--ivory)] text-xs tracking-[0.3em] uppercase opacity-90">Heritage · Crafted · Rare</div>
            </div>
          </div>
          <div className="absolute -top-6 -left-6 w-24 h-24 border border-[var(--gold)]/50 rounded-full hidden sm:block" />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 border border-[var(--gold)]/40 rounded-full hidden sm:block" />
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="relative px-6 sm:px-10 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12 fade-up">
          <Ornament />
          <h2 className="mt-6 font-display text-3xl sm:text-5xl text-[var(--maroon)]">
            The Unveiling Begins In
          </h2>
          <p className="mt-3 text-sm tracking-[0.2em] uppercase text-[var(--muted-foreground)]">
            A moment worth waiting for
          </p>
        </div>
        {data?.launchDate && <Countdown launchDate={data.launchDate} />}
      </section>

      {/* EXCLUSIVITY */}
      <section className="relative px-6 sm:px-10 py-24 max-w-6xl mx-auto">
        <div className="luxe-card p-10 sm:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[var(--gold)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <div className="text-[0.65rem] tracking-[0.4em] uppercase text-[var(--gold)] font-medium">Exclusivity is Elegance</div>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl text-[var(--maroon)] leading-tight">
                Only <span className="gold-text">50 Exclusive Sarees</span>
                <span className="block">Every Month.</span>
              </h2>
              <p className="mt-6 max-w-xl text-[var(--muted-foreground)] leading-relaxed">
                At Vastra Luxe, exclusivity is elegance. Every month, we curate only
                fifty unique sarees — carefully selected to celebrate craftsmanship,
                beauty, and individuality. Once sold, that collection may never return.
              </p>
            </div>
            <div className="text-center">
              <div className="font-display text-7xl sm:text-8xl text-[var(--maroon)] leading-none">50</div>
              <div className="mt-2 gold-divider w-24 mx-auto" />
              <div className="mt-2 text-xs tracking-[0.3em] uppercase text-[var(--muted-foreground)]">per drop</div>
            </div>
          </div>
        </div>
      </section>

      {/* MONTHLY DROPS */}
      <section className="relative px-6 sm:px-10 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16 fade-up">
          <Ornament />
          <h2 className="mt-6 font-display text-4xl sm:text-5xl text-[var(--maroon)]">
            Monthly Curated Drops
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--muted-foreground)]">
            Each collection is released in exclusive monthly batches — rare, limited,
            unforgettable.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { img: col1, title: "June Delights", sub: "Summer Heritage Silks", num: "01" },
            { img: col2, title: "Royal Monsoon Edit", sub: "Whispers of Ivory & Gold", num: "02" },
            { img: col3, title: "Festive Heritage", sub: "The Maroon Chronicles", num: "03" },
          ].map((c) => (
            <article key={c.title} className="group luxe-card overflow-hidden">
              <div className="relative overflow-hidden">
                <img src={c.img} alt={c.title} loading="lazy" width={900} height={1200}
                  className="w-full h-80 object-cover transition-transform duration-[1500ms] group-hover:scale-105" />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[var(--ivory)]/85 backdrop-blur text-[0.65rem] tracking-[0.3em] text-[var(--maroon)]">
                  {c.num}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-[var(--maroon)]">{c.title}</h3>
                <div className="gold-divider w-12 my-3" />
                <p className="text-sm text-[var(--muted-foreground)] tracking-wide">{c.sub}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* INTERNATIONAL DELIVERY */}
      <section className="relative px-6 sm:px-10 py-24 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-square rounded-full border border-[var(--gold)]/40 flex items-center justify-center bg-[var(--ivory)]/50 backdrop-blur">
              <div className="aspect-square w-3/4 rounded-full border border-[var(--gold)]/30 flex items-center justify-center">
                <Globe className="h-24 w-24 text-[var(--maroon)] opacity-80" strokeWidth={0.8} />
              </div>
            </div>
            <div className="absolute -top-4 -right-4 px-4 py-2 rounded-full bg-[var(--maroon)] text-[var(--ivory)] text-[0.65rem] tracking-[0.3em] uppercase">
              Worldwide
            </div>
          </div>
          <div className="fade-up">
            <div className="text-[0.65rem] tracking-[0.4em] uppercase text-[var(--gold)]">Borderless Beauty</div>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl text-[var(--maroon)] leading-tight">
              Luxury Sarees,<br />Delivered Worldwide
            </h2>
            <p className="mt-6 text-[var(--muted-foreground)] leading-relaxed">
              Whether in India or abroad, Vastra Luxe brings timeless drapes directly
              to your doorstep — connecting tradition with modern elegance across the globe.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["India", "United States", "United Kingdom", "UAE", "Singapore", "Australia"].map((c) => (
                <span key={c} className="px-4 py-1.5 rounded-full border border-[var(--gold)]/40 bg-[var(--ivory)]/60 text-xs tracking-wider text-[var(--ink)]">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NOTIFY */}
      <section id="notify" className="relative px-6 sm:px-10 py-24 max-w-4xl mx-auto">
        <div className="luxe-card p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 silk-shimmer opacity-30 pointer-events-none" />
          <div className="relative">
            <Ornament />
            <h2 className="mt-6 font-display text-4xl sm:text-5xl text-[var(--maroon)]">
              Be the First to Know
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-[var(--muted-foreground)]">
              Get exclusive early access, launch updates, premium collection reveals,
              and first access to our limited monthly saree drops.
            </p>
            <form onSubmit={onSubscribe} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--gold)]" />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-[var(--ivory)] border border-[var(--gold)]/40 focus:border-[var(--maroon)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 text-sm tracking-wide"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-luxe disabled:opacity-60">
                {loading ? "Sending…" : "Notify Me"}
              </button>
            </form>
            <p className="mt-4 text-[0.7rem] tracking-[0.2em] uppercase text-[var(--muted-foreground)]">
              No spam. Only elegance.
            </p>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="relative px-6 sm:px-10 py-24 max-w-5xl mx-auto text-center">
        <Ornament />
        <h2 className="mt-6 font-display text-4xl sm:text-5xl text-[var(--maroon)] leading-tight">
          More Than a Saree — <span className="italic">A Story Woven with Grace</span>
        </h2>
        <p className="mt-8 max-w-2xl mx-auto text-[var(--muted-foreground)] leading-relaxed text-lg">
          At Vastra Luxe, every saree reflects craftsmanship, culture, elegance,
          and timeless identity.
        </p>
        <button className="btn-ghost-luxe mt-10">Discover Our Story</button>
      </section>

      {/* FOOTER */}
      <footer className="relative px-6 sm:px-10 pt-16 pb-10 border-t border-[var(--gold)]/30 bg-[var(--beige)]/40 backdrop-blur">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 items-start">
          <div>
            <div className="flex items-center gap-3">
              <VastraLogo className="h-12 w-12" />
              <div>
                <div className="font-display text-xl text-[var(--maroon)]">Vastra Luxe</div>
                <div className="text-[0.6rem] tracking-[0.3em] uppercase text-[var(--muted-foreground)]">Grace in Every Drape</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-[var(--muted-foreground)] max-w-xs">
              A curated atelier of exclusive sarees, crafted for those who wear heritage with grace.
            </p>
          </div>
          <div className="md:text-center">
            <div className="text-[0.65rem] tracking-[0.3em] uppercase text-[var(--gold)]">Connect</div>
            <div className="mt-4 flex md:justify-center gap-4">
              <a href="#" aria-label="Instagram" className="p-2 rounded-full border border-[var(--gold)]/40 hover:bg-[var(--gold)]/15 transition"><Instagram className="h-4 w-4 text-[var(--maroon)]" /></a>
              <a href="#" aria-label="Facebook" className="p-2 rounded-full border border-[var(--gold)]/40 hover:bg-[var(--gold)]/15 transition"><Facebook className="h-4 w-4 text-[var(--maroon)]" /></a>
              <a href="mailto:hello@vastraluxe.com" aria-label="Email" className="p-2 rounded-full border border-[var(--gold)]/40 hover:bg-[var(--gold)]/15 transition"><Mail className="h-4 w-4 text-[var(--maroon)]" /></a>
            </div>
          </div>
          <div className="md:text-right">
            <div className="text-[0.65rem] tracking-[0.3em] uppercase text-[var(--gold)]">Atelier Contact</div>
            <a href="mailto:hello@vastraluxe.com" className="mt-4 block text-sm text-[var(--ink)] hover:text-[var(--maroon)]">hello@vastraluxe.com</a>
          </div>
        </div>
        <div className="gold-divider my-10 max-w-7xl mx-auto" />
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-[0.7rem] tracking-[0.2em] uppercase text-[var(--muted-foreground)]">
          <div>© {new Date().getFullYear()} Vastra Luxe. All rights reserved.</div>
          <div>Crafted with reverence in India</div>
        </div>
      </footer>
    </div>
  );
}

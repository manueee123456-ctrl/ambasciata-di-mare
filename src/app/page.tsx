"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, Clock3, Menu, Minus, Phone, Plus, Users, X } from "lucide-react";

const phone = "0541370124";
const mapUrl = "https://www.google.com/maps/search/?api=1&query=Ambasciata+di+Mare+Viale+Regina+Margherita+57+Rimini";
const times = ["12:00", "12:30", "13:00", "13:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];

function nextAvailableDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  if (d.getDay() === 1) d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const menus = {
  mare: [
    { number: "01", name: "Gnocchi allo sgusciato di mare", description: "Il profumo del mare in un primo da ricordare.", image: "/image/piatto-1.webp", alt: "Pasta ai frutti di mare, fotografia illustrativa" },
    { number: "02", name: "Grigliata di pesce del giorno", description: "La semplicità del pescato, tutto il suo sapore.", image: "/image/piatto-2.webp", alt: "Pesce alla griglia con limone, fotografia illustrativa" },
    { number: "03", name: "Fritto misto di mare", description: "Croccante, dorato, da condividere fino all'ultimo boccone.", image: "/image/piatto-3.webp", alt: "Fritto di calamari, fotografia illustrativa" },
  ],
  pizza: [
    { number: "01", name: "La pizza, come piace a noi", description: "Impasto fragrante e ingredienti scelti con cura.", image: "/image/piatto-1.webp", alt: "Pizza appena sfornata, fotografia illustrativa" },
    { number: "02", name: "Una serata da condividere", description: "Dal primo brindisi all'ultima fetta, a tavola si sta bene.", image: "/image/locale-interno.webp", alt: "Tavola apparecchiata in ristorante, fotografia illustrativa" },
  ],
  dolci: [
    { number: "01", name: "Il finale più dolce", description: "Lascia sempre un po' di spazio per il dessert.", image: "/image/piatto-2.webp", alt: "Dolce al cucchiaio, fotografia illustrativa" },
    { number: "02", name: "Un altro momento insieme", description: "Il caffè, due chiacchiere e il piacere di non avere fretta.", image: "/image/locale-interno.webp", alt: "Atmosfera di ristorante, fotografia illustrativa" },
  ],
};

type MenuKey = keyof typeof menus;

const reviews = [
  { text: "Accoglienza ottima. Ho mangiato una grigliata di pesce veramente completa, non la trovi in giro così. Complimenti, lo consiglio.", name: "Ospite su Tripadvisor", detail: "Esperienza al ristorante" },
  { text: "Siamo stati accolti con grande calore. Abbiamo mangiato molto bene: pesce freschissimo, prezzi onesti e persone davvero attente.", name: "Ospite su Tripadvisor", detail: "Cena in famiglia" },
  { text: "Ottimo cibo preparato con cura al momento. Ci torno sempre con piacere: un ambiente accogliente, senza rinunciare all'eleganza.", name: "Ospite su Tripadvisor", detail: "Esperienza al ristorante" },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [menuTab, setMenuTab] = useState<MenuKey>("mare");
  const [reviewIndex, setReviewIndex] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("20:00");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    setDate(nextAvailableDate());
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = bookingOpen || menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [bookingOpen, menuOpen]);

  function openBooking() { setMenuOpen(false); setError(""); setReference(""); setBookingOpen(true); }
  function closeBooking() { setBookingOpen(false); setError(""); }
  function navigate() { setMenuOpen(false); }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (new Date(`${date}T12:00:00`).getDay() === 1) { setError("Il lunedì siamo chiusi. Scegli un altro giorno."); return; }
    setSubmitting(true);
    try {
      const response = await fetch("/api/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, phone: contactPhone, date, time, guests, notes }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Si è verificato un errore.");
      setReference(data.reference);
    } catch (err) { setError(err instanceof Error ? err.message : "Si è verificato un errore."); }
    finally { setSubmitting(false); }
  }

  return (
    <main>
      <a href="#contenuto" className="skip-link">Vai al contenuto principale</a>
      <header className="site-header">
        <a href="#inizio" className="brand" aria-label="Ambasciata di Mare, torna all'inizio" onClick={navigate}>
          <span className="brand-mark"><span className="brand-sun" /><span className="brand-wave">≈</span></span>
          <span className="brand-words"><span>AMBASCIATA</span><span>DI MARE</span></span>
        </a>
        <nav className="desktop-nav" aria-label="Navigazione principale">
          <a href="#storia">La nostra storia</a><a href="#menu">Il menu</a><a href="#esperienza">L&apos;esperienza</a><a href="#recensioni">Dicono di noi</a>
        </nav>
        <div className="header-actions"><a href={`tel:${phone}`} className="header-phone"><Phone size={15} strokeWidth={1.7} /> 0541 370124</a><button className="header-book" onClick={openBooking}>Prenota un tavolo <ArrowUpRight size={16} /></button></div>
        <button className="mobile-menu-button" onClick={() => setMenuOpen(true)} aria-label="Apri menu"><Menu size={27} /></button>
      </header>

      <section id="inizio" className="hero">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-shade" />
        <div id="contenuto" className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> RIMINI · A DUE PASSI DAL MARE</div>
            <h1>Il mare,<br /><em>a tavola.</em></h1>
            <p>Il piacere delle cose buone, il calore di stare insieme. Benvenuti all&apos;Ambasciata di Mare.</p>
            <button className="text-link light-link" onClick={openBooking}>Vieni a trovarci <ArrowUpRight size={19} /></button>
          </div>
          <div className="hero-side-note"><span className="vertical-rule" /><span>RISTORANTE & PIZZERIA<br />RIMINI, ITALIA</span></div>
        </div>
        <div className="hero-bottom"><a href="#storia" className="scroll-cue">SCOPRI DI PIÙ <ArrowDown size={16} /></a><span>UN INVITO A SENTIRSI A CASA</span></div>
      </section>

      <section className="booking-strip" aria-label="Prenota un tavolo">
        <div className="booking-strip-heading"><span>IL TUO POSTO TI ASPETTA</span><strong>Facciamo spazio<br />a un bel momento.</strong></div>
        <label className="strip-field"><span>DATA</span><div><CalendarDays size={19} /><input aria-label="Data della prenotazione" type="date" value={date} min={nextAvailableDate()} onChange={(e) => setDate(e.target.value)} /></div></label>
        <label className="strip-field"><span>PERSONE</span><div><Users size={19} /><select aria-label="Numero di persone" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>{Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? "persona" : "persone"}</option>)}</select><ChevronDown size={14} className="select-chevron" /></div></label>
        <label className="strip-field"><span>ORARIO</span><div><Clock3 size={19} /><select aria-label="Orario della prenotazione" value={time} onChange={(e) => setTime(e.target.value)}>{times.map((t) => <option key={t} value={t}>{t}</option>)}</select><ChevronDown size={14} className="select-chevron" /></div></label>
        <button className="strip-submit" onClick={openBooking}>Richiedi un tavolo <ArrowUpRight size={19} /></button>
      </section>

      <section id="storia" className="intro-section section-pad">
        <div className="intro-heading reveal"><div className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> BENVENUTI ALL&apos;AMBASCIATA</div><h2>Qui ogni tavola<br />ha una <em>storia da raccontare.</em></h2></div>
        <div className="intro-grid">
          <div className="intro-image-wrap reveal"><img src="/image/locale-interno.webp" alt="La vera sala del ristorante Ambasciata di Mare a Rimini" /><span className="image-caption">01 / UN POSTO DA VIVERE</span></div>
          <div className="intro-content reveal"><div className="small-star">✳</div><p className="intro-lead">Ci sono posti in cui entri per mangiare. E poi ci sono posti in cui vorresti restare ancora un po&apos;.</p><p>All&apos;Ambasciata di Mare portiamo in tavola sapori di mare, pizze e il piacere semplice di stare bene insieme. Un&apos;atmosfera accogliente, a pochi passi dalla spiaggia di Rimini, per ogni occasione che merita di essere ricordata.</p><a href="#esperienza" className="text-link dark-link">Scopri il nostro mondo <ArrowUpRight size={18} /></a><div className="intro-signature">Con il cuore, a Rimini.</div></div>
        </div>
      </section>

      <section id="menu" className="menu-section section-pad">
        <div className="menu-top reveal"><div><div className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> I SAPORI DI CASA NOSTRA</div><h2>Una storia di <em>sapori.</em></h2></div><p>Dal pescato alla pizza, ogni piatto è un buon motivo per ritrovarsi a tavola.</p></div>
        <div className="menu-tabs reveal" role="tablist" aria-label="Categorie del menu"><button role="tab" aria-selected={menuTab === "mare"} className={menuTab === "mare" ? "active" : ""} onClick={() => setMenuTab("mare")}>Dal mare <span>↗</span></button><button role="tab" aria-selected={menuTab === "pizza"} className={menuTab === "pizza" ? "active" : ""} onClick={() => setMenuTab("pizza")}>La pizza <span>↗</span></button><button role="tab" aria-selected={menuTab === "dolci"} className={menuTab === "dolci" ? "active" : ""} onClick={() => setMenuTab("dolci")}>Il finale dolce <span>↗</span></button></div>
        <div className="dish-grid" key={menuTab}>{menus[menuTab].map((dish) => <article className="dish-card" key={dish.name}><div className="dish-image"><img src={dish.image} alt={dish.alt} /><span>{dish.number}</span></div><div className="dish-details"><div><h3>{dish.name}</h3><p>{dish.description}</p></div><ArrowUpRight size={22} strokeWidth={1.3} /></div></article>)}</div>
        <div className="menu-footer reveal"><span>Il menu e le proposte possono variare secondo disponibilità e stagione.</span><button onClick={openBooking} className="text-link dark-link">Prenota la tua esperienza <ArrowUpRight size={18} /></button></div>
      </section>

      <section id="esperienza" className="experience-section"><div className="experience-photo"><img src="/image/spiaggia.webp" alt="La spiaggia di Rimini al tramonto, con file di ombrelloni" /></div><div className="experience-panel reveal"><div className="eyebrow light-eyebrow"><span className="eyebrow-line" /> IL NOSTRO ANGOLO DI RIMINI</div><h2>A due passi dal mare.<br /><em>Vicini a te.</em></h2><p>Una passeggiata sul lungomare, il profumo della cucina, una tavola pronta ad accoglierti. Per una cena in coppia, un pranzo in famiglia o una serata tra amici: il momento giusto è quello che scegli tu.</p><a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-link light-link">Vieni a trovarci <ArrowUpRight size={18} /></a><div className="experience-coordinate">44°02&apos;41.2&quot;N&nbsp; 12°36&apos;19.2&quot;E</div></div></section>

      <section id="recensioni" className="reviews-section section-pad"><div className="reviews-heading reveal"><div className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> PAROLE CHE CI FANNO SORRIDERE</div><h2>Le storie più belle<br /><em>le raccontate voi.</em></h2></div><div className="reviews-layout reveal"><div className="rating-block"><span className="rating-big">4,4<span>/5</span></span><div className="rating-stars">★★★★★</div><p>Oltre 2.300 recensioni su Google</p><a href="https://www.google.com/maps/place/Ambasciata+di+Mare/" target="_blank" rel="noopener noreferrer" className="rating-link">Leggi le recensioni <ArrowUpRight size={16} /></a></div><div className="review-card"><span className="quote-mark">“</span><p key={reviewIndex} className="review-text">{reviews[reviewIndex].text}</p><div className="review-bottom"><div><strong>{reviews[reviewIndex].name}</strong><span>{reviews[reviewIndex].detail}</span></div><div className="review-controls"><button aria-label="Recensione precedente" onClick={() => setReviewIndex((reviewIndex + reviews.length - 1) % reviews.length)}><ArrowLeft size={18} /></button><button aria-label="Recensione successiva" onClick={() => setReviewIndex((reviewIndex + 1) % reviews.length)}><ArrowRight size={18} /></button></div></div></div></div></section>

      <section className="cta-section"><div className="cta-overlay" /><div className="cta-content reveal"><div className="eyebrow light-eyebrow"><span className="eyebrow-line" /> CI VEDIAMO A TAVOLA?</div><h2>Il prossimo bel ricordo<br /><em>inizia qui.</em></h2><p>Trova il tuo posto. Al resto pensiamo noi.</p><button onClick={openBooking} className="cream-button">Prenota un tavolo <ArrowUpRight size={19} /></button></div></section>

      <footer className="footer" id="contatti"><div className="footer-main"><div className="footer-brand"><a href="#inizio" className="brand" aria-label="Ambasciata di Mare, torna all'inizio"><span className="brand-mark"><span className="brand-sun" /><span className="brand-wave">≈</span></span><span className="brand-words"><span>AMBASCIATA</span><span>DI MARE</span></span></a><p>Il mare nel piatto.<br />Rimini nel cuore.</p></div><div className="footer-col"><h3>ESPLORA</h3><a href="#storia">La nostra storia</a><a href="#menu">Il menu</a><a href="#esperienza">L&apos;esperienza</a><a href="#recensioni">Recensioni</a></div><div className="footer-col"><h3>VIENI A TROVARCI</h3><a href={mapUrl} target="_blank" rel="noopener noreferrer">Viale Regina Margherita, 57<br />47924 Rimini RN</a><a href={`tel:${phone}`}>+39 0541 370124</a><a href={mapUrl} target="_blank" rel="noopener noreferrer" className="footer-directions">Indicazioni <ArrowUpRight size={15} /></a></div><div className="footer-col"><h3>ORARI</h3><span>Mar – Dom</span><span>12:00 – 15:00<br />19:00 – 00:00</span><span>Lunedì chiuso</span><small>Orari indicativi: chiama per confermare.</small></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Ambasciata di Mare. Fatto con amore, a Rimini.</span><span>Foto del locale: Google Maps. Foto dei piatti e del litorale: Pexels, a scopo illustrativo.</span><a href="#inizio">TORNA SU ↑</a></div></footer>

      {menuOpen && <div className="mobile-nav-overlay"><div className="mobile-nav-top"><span>AMBASCIATA DI MARE</span><button onClick={() => setMenuOpen(false)} aria-label="Chiudi menu"><X size={28} /></button></div><nav><a href="#storia" onClick={navigate}>La nostra storia</a><a href="#menu" onClick={navigate}>Il menu</a><a href="#esperienza" onClick={navigate}>L&apos;esperienza</a><a href="#recensioni" onClick={navigate}>Dicono di noi</a><a href="#contatti" onClick={navigate}>Contatti</a></nav><button className="cream-button" onClick={openBooking}>Prenota un tavolo <ArrowUpRight size={18} /></button></div>}

      {bookingOpen && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) closeBooking(); }}><div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title"><button className="modal-close" onClick={closeBooking} aria-label="Chiudi prenotazione"><X size={23} /></button>{reference ? <div className="booking-success"><span className="success-icon"><Check size={29} /></span><div className="eyebrow dark-eyebrow">RICHIESTA INVIATA</div><h2>Ci vediamo <em>presto.</em></h2><p>Abbiamo ricevuto la tua richiesta per <strong>{guests} {guests === 1 ? "persona" : "persone"}</strong> il <strong>{new Date(`${date}T12:00:00`).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}</strong> alle <strong>{time}</strong>.</p><p className="success-note">La prenotazione non è ancora confermata: ti contatteremo al numero indicato. Per urgenze chiamaci allo <a href={`tel:${phone}`}>0541 370124</a>.</p><span className="reference">RIFERIMENTO {reference}</span><button className="modal-submit" onClick={closeBooking}>Torna al sito <ArrowRight size={18} /></button></div> : <><div className="modal-heading"><div className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> IL TUO POSTO TI ASPETTA</div><h2>Prenota un <em>tavolo.</em></h2><p>Compila il modulo e ti contatteremo per confermare la disponibilità.</p></div><form onSubmit={submitBooking} className="booking-form"><div className="form-row"><label>Data<input type="date" required min={nextAvailableDate()} value={date} onChange={(e) => setDate(e.target.value)} /></label><label>Ora<select required value={time} onChange={(e) => setTime(e.target.value)}>{times.map((t) => <option key={t}>{t}</option>)}</select></label></div><div className="form-row"><label>Persone<div className="guest-stepper"><button type="button" aria-label="Diminuisci persone" onClick={() => setGuests(Math.max(1, guests - 1))}><Minus size={17} /></button><span>{guests} {guests === 1 ? "persona" : "persone"}</span><button type="button" aria-label="Aumenta persone" onClick={() => setGuests(Math.min(12, guests + 1))}><Plus size={17} /></button></div></label><label>Nome e cognome<input type="text" required minLength={2} maxLength={160} placeholder="Il tuo nome" value={name} onChange={(e) => setName(e.target.value)} /></label></div><div className="form-row"><label>Email<input type="email" required placeholder="nome@email.it" value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>Telefono<input type="tel" required minLength={6} placeholder="+39 333 123 4567" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} /></label></div><label>Note <span className="optional">(facoltative)</span><textarea maxLength={1000} rows={3} placeholder="Allergie, occasioni speciali o altre richieste..." value={notes} onChange={(e) => setNotes(e.target.value)} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button type="submit" className="modal-submit" disabled={submitting}>{submitting ? "Invio in corso..." : "Invia richiesta di prenotazione"} {!submitting && <ArrowUpRight size={18} />}</button><p className="form-disclaimer">La richiesta non equivale a una prenotazione confermata. I dati saranno usati solo per gestire la tua richiesta.</p></form></>}</div></div>}
    </main>
  );
}

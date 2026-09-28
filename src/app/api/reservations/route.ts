import { db } from "@/db";
import { reservations } from "@/db/schema";
import { randomBytes } from "node:crypto";

export const dynamic = "force-dynamic";

const allowedTimes = new Set(["12:00", "12:30", "13:00", "13:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const reservationDate = String(body.date ?? "");
    const reservationTime = String(body.time ?? "");
    const guests = Number(body.guests);
    const notes = String(body.notes ?? "").trim();

    if (name.length < 2 || name.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255 || !/^[+\d\s().-]{6,40}$/.test(phone) || !Number.isInteger(guests) || guests < 1 || guests > 12 || notes.length > 1000 || !allowedTimes.has(reservationTime) || !/^\d{4}-\d{2}-\d{2}$/.test(reservationDate)) {
      return Response.json({ error: "Controlla i dati inseriti e riprova." }, { status: 400 });
    }

    const selected = new Date(`${reservationDate}T12:00:00Z`);
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    const maxDate = new Date(`${today}T12:00:00Z`);
    maxDate.setUTCDate(maxDate.getUTCDate() + 90);
    if (Number.isNaN(selected.getTime()) || selected.toISOString().slice(0, 10) !== reservationDate || reservationDate < today || selected > maxDate || selected.getUTCDay() === 1) {
      return Response.json({ error: "Seleziona una data valida entro 90 giorni. Il lunedì siamo chiusi." }, { status: 400 });
    }

    const reference = `ADM-${randomBytes(4).toString("hex").toUpperCase()}`;
    await db.insert(reservations).values({ reference, name, email, phone, reservationDate, reservationTime, guests, notes: notes || null });
    return Response.json({ reference, message: "Richiesta ricevuta. Ti contatteremo per confermare la prenotazione." }, { status: 201 });
  } catch (error) {
    console.error("Reservation error", error);
    return Response.json({ error: "Non siamo riusciti a inviare la richiesta. Riprova o chiamaci allo 0541 370124." }, { status: 500 });
  }
}

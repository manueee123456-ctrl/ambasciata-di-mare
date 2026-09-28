import { db } from "@/db";
import { reservations } from "@/db/schema";
import { desc } from "drizzle-orm";
import { timingSafeEqual } from "node:crypto";

export const dynamic = "force-dynamic";

function csvCell(value: string | number | null | undefined) {
  let text = String(value ?? "");
  if (/^[\s]*[=+@-]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const configured = process.env.BOOKING_EXPORT_TOKEN;
  if (!configured) return Response.json({ error: "Configura BOOKING_EXPORT_TOKEN sul server per attivare l'esportazione." }, { status: 503 });
  const given = request.headers.get("x-export-token") ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(configured);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return Response.json({ error: "Codice di accesso non valido." }, { status: 401 });

  try {
    const rows = await db.select().from(reservations).orderBy(desc(reservations.createdAt));
    const header = ["Riferimento", "Data", "Ora", "Persone", "Nome", "Email", "Telefono", "Note", "Stato", "Ricevuta il"];
    const lines = rows.map((row) => [row.reference, row.reservationDate, row.reservationTime, row.guests, row.name, row.email, row.phone, row.notes, row.status, row.createdAt.toLocaleString("it-IT", { timeZone: "Europe/Rome" })].map(csvCell).join(";"));
    const csv = "\uFEFF" + [header.map(csvCell).join(";"), ...lines].join("\r\n");
    return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="prenotazioni-ambasciata-di-mare-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Export error", error);
    return Response.json({ error: "Impossibile esportare le prenotazioni." }, { status: 500 });
  }
}

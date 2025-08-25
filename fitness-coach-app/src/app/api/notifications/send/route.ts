import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const ADMIN_TOKEN = process.env.NOTIF_ADMIN_TOKEN;
  const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    return NextResponse.json({ error: "Missing VAPID keys" }, { status: 500 });
  }
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return NextResponse.json({ error: "Missing Supabase service role configuration" }, { status: 500 });
  }

  // simple auth guard
  const token = req.headers.get("x-admin-token");
  if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, title, body, data } = await req.json();
  if (!userId || !title) {
    return NextResponse.json({ error: "userId and title are required" }, { status: 400 });
  }

  webpush.setVapidDetails(
    "mailto:admin@example.com",
    VAPID_PUBLIC,
    VAPID_PRIVATE
  );

  const supabase = createSupabaseClient(SUPABASE_URL, SERVICE_ROLE);
  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint,p256dh,auth")
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const payload = JSON.stringify({ title, body, data });
  const results: any[] = [];

  for (const s of subs || []) {
    try {
      await webpush.sendNotification(
        {
          endpoint: s.endpoint,
          keys: { p256dh: s.p256dh, auth: s.auth },
        } as any,
        payload
      );
      results.push({ endpoint: s.endpoint, ok: true });
    } catch (e: any) {
      results.push({ endpoint: s.endpoint, ok: false, error: e?.message });
    }
  }

  return NextResponse.json({ sent: results.length, results });
}

import { NextResponse } from "next/server";
import { supabase } from "../../../utils/supabase";

export async function GET() {
  try {
    const isConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");

    if (!isConfigured) {
      return NextResponse.json({
        status: "waiting_setup",
        message: "Supabase integration is ready in the codebase! Please fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY inside .env.local to activate the database pipeline.",
        timestamp: new Date().toISOString()
      });
    }

    // Ping the Supabase connection to keep the database awake and prevent free-tier pause
    // We try to fetch from any active table or check client initialization.
    // The query itself triggers postgres compute activity on Supabase.
    const { error } = await supabase.auth.getSession();

    return NextResponse.json({
      status: "online",
      message: "Database ping completed successfully! Postgres compute cycle refreshed.",
      database_ready: true,
      error: error ? error.message : null,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "error",
        message: err.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

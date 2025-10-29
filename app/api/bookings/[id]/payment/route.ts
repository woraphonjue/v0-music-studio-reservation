import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { payment_slip, terms_accepted } = body

    if (!payment_slip || !terms_accepted) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify booking belongs to user
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Update booking with payment information
    const { data: updatedBooking, error: updateError } = await supabase
      .from("bookings")
      .update({
        payment_slip_url: payment_slip,
        terms_accepted,
        payment_status: "paid",
        status: "confirmed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      console.error("[v0] Payment update error:", updateError)
      return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
    }

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error("[v0] Payment API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

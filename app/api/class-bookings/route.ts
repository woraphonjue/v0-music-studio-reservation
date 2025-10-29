import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { class_id, booking_date, start_time, end_time, total_price, notes } = body

    // Validate required fields
    if (!class_id || !booking_date || !start_time || !end_time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check for overlapping bookings
    const { data: existingBookings } = await supabase
      .from("class_bookings")
      .select("*")
      .eq("class_id", class_id)
      .eq("booking_date", booking_date)
      .in("status", ["pending", "confirmed"])
      .or(`and(start_time.lte.${end_time},end_time.gt.${start_time})`)

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json({ error: "This time slot is already booked" }, { status: 409 })
    }

    // Create the class booking
    const { data: booking, error } = await supabase
      .from("class_bookings")
      .insert({
        class_id,
        user_id: user.id,
        booking_date,
        start_time,
        end_time,
        total_price,
        notes: notes || null,
        status: "pending",
        payment_status: "pending",
        terms_accepted: false,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Class booking creation error:", error)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[v0] Class booking API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

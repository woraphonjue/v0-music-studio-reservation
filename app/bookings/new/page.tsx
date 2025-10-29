import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BookingForm } from "@/components/booking-form"

export default async function NewBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ roomId?: string }>
}) {
  const { roomId } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  if (!roomId) {
    redirect("/")
  }

  const { data: room, error } = await supabase.from("rooms").select("*").eq("id", roomId).single()

  if (error || !room) {
    redirect("/")
  }

  // Fetch existing bookings for this room to show unavailable slots
  const { data: existingBookings } = await supabase
    .from("bookings")
    .select("booking_date, start_time, end_time")
    .eq("room_id", roomId)
    .in("status", ["pending", "confirmed"])

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <BookingForm room={room} userId={user.id} existingBookings={existingBookings || []} />
      </div>
    </div>
  )
}

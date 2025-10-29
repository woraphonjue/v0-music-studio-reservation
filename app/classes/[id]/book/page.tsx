import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ClassBookingForm } from "@/components/class-booking-form"

export default async function BookClassPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: classItem, error } = await supabase.from("private_classes").select("*").eq("id", id).single()

  if (error || !classItem) {
    redirect("/classes")
  }

  // Fetch existing class bookings
  const { data: existingBookings } = await supabase
    .from("class_bookings")
    .select("booking_date, start_time, end_time")
    .eq("class_id", id)
    .in("status", ["pending", "confirmed"])

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <ClassBookingForm classItem={classItem} userId={user.id} existingBookings={existingBookings || []} />
      </div>
    </div>
  )
}

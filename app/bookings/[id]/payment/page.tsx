import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PaymentForm } from "@/components/payment-form"

export default async function PaymentPage({
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

  // Fetch booking with room details
  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      *,
      rooms (*)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !booking) {
    redirect("/")
  }

  // If already paid, redirect to confirmation
  if (booking.payment_status === "paid") {
    redirect(`/bookings/${id}/confirmation`)
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <PaymentForm booking={booking} />
      </div>
    </div>
  )
}

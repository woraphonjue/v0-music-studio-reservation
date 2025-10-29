import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ClassPaymentForm } from "@/components/class-payment-form"

export default async function ClassPaymentPage({
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

  // Fetch booking with class details
  const { data: booking, error } = await supabase
    .from("class_bookings")
    .select(`
      *,
      private_classes (*)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !booking) {
    redirect("/classes")
  }

  // If already paid, redirect to confirmation
  if (booking.payment_status === "paid") {
    redirect(`/class-bookings/${id}/confirmation`)
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <ClassPaymentForm booking={booking} />
      </div>
    </div>
  )
}

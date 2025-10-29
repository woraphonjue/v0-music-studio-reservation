import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default async function ConfirmationPage({
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

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-600/20 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-white text-3xl mb-2">Booking Confirmed!</CardTitle>
              <CardDescription className="text-zinc-400 text-lg">
                Your payment has been received and your booking is confirmed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-zinc-950 p-6 rounded-lg border border-zinc-800 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-zinc-400 text-sm">Room</p>
                    <p className="text-white font-semibold text-lg">{booking.rooms.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-zinc-400 text-sm">Date</p>
                    <p className="text-white font-semibold text-lg">
                      {format(new Date(booking.booking_date), "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-zinc-400 text-sm">Time</p>
                    <p className="text-white font-semibold text-lg">
                      {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total Paid</span>
                    <span className="text-orange-500 font-bold text-xl">฿{booking.total_price.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-950/30 border border-orange-900/50 p-4 rounded-lg">
                <h3 className="text-orange-400 font-semibold mb-2">Important Reminders:</h3>
                <ul className="text-zinc-300 text-sm space-y-1 leading-relaxed">
                  <li>• Please arrive 5 minutes before your session</li>
                  <li>• Bring a valid ID for verification</li>
                  <li>• Late arrivals will not receive time extensions</li>
                  <li>• Contact us if you need to make changes</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href="/my-bookings" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
                  >
                    View My Bookings
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">Back to Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

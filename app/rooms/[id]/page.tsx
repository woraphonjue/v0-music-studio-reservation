import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Clock, CheckCircle2 } from "lucide-react"
import { RoomImageCarousel } from "@/components/room-image-carousel"

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: room, error } = await supabase.from("rooms").select("*").eq("id", id).single()

  if (error || !room) {
    notFound()
  }

  const { data: images } = await supabase
    .from("room_images")
    .select("*")
    .eq("room_id", id)
    .order("display_order", { ascending: true })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" className="text-zinc-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rooms
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div>
            <RoomImageCarousel
              images={images || []}
              fallbackImage={room.image_url || "/placeholder.svg?height=600&width=800"}
            />
          </div>

          {/* Room Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-5xl font-heading text-white uppercase tracking-wide">{room.name}</h1>
                <Badge className="bg-red-600 text-white border-0 font-semibold uppercase">{room.type}</Badge>
              </div>
              <p className="text-xl text-zinc-400 leading-relaxed">{room.description}</p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white font-heading uppercase tracking-wide">What You Get</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Users className="h-6 w-6 text-red-500" />
                    <span className="text-lg">Fits up to</span>
                  </div>
                  <span className="text-white font-bold text-xl">{room.capacity} people</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-zinc-800">
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Clock className="h-6 w-6 text-red-500" />
                    <span className="text-lg">Price</span>
                  </div>
                  <div className="text-right">
                    <span className="text-red-500 font-bold text-3xl">฿{room.hourly_rate}</span>
                    <span className="text-zinc-500 text-lg">/hr</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {room.amenities && room.amenities.length > 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white font-heading uppercase tracking-wide">Gear Included</CardTitle>
                  <CardDescription className="text-zinc-400 text-base">Everything you need to create</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {room.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-zinc-300">
                        <CheckCircle2 className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <span className="capitalize">{amenity.replace(/-/g, " ")}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {user ? (
              <Link href={`/bookings/new?roomId=${room.id}`} className="block">
                <Button
                  size="lg"
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xl py-7 font-bold uppercase tracking-wide shadow-lg shadow-red-600/20"
                >
                  Book This Room
                </Button>
              </Link>
            ) : (
              <div className="space-y-4">
                <p className="text-zinc-400 text-center text-lg">Sign in to book this room</p>
                <Link href="/auth/login" className="block">
                  <Button
                    size="lg"
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-xl py-7 font-bold uppercase tracking-wide shadow-lg shadow-red-600/20"
                  >
                    Sign In to Book
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

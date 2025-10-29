import { createClient } from "@/lib/supabase/server"
import type { Room } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Music2, Calendar, GraduationCap, MapPin, Phone, Clock } from "lucide-react"
import Image from "next/image"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .eq("is_available", true)
    .order("type", { ascending: true })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-brand text-white">Molly</h1>
          {user ? (
            <Link href="/my-bookings">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                My Bookings
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                เข้าสู่ระบบ
              </Button>
            </Link>
          )}
        </div>
      </header>

      <section className="relative h-64 overflow-hidden">
        <Image src="/music-studio-interior-with-instruments.jpg" alt="Molly Music Studio" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-heading text-white uppercase tracking-wide">Molly Music Studio</h2>
          </div>
        </div>
      </section>

      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 text-zinc-300">
            <Music2 className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-semibold text-white">ปาก้า!</span> ตอนนี้เราเปิดให้จองล่วงหน้าได้ 7 วันแล้วนะ
            </p>
          </div>
        </div>
      </div>

      <section className="py-6 px-4 bg-zinc-950">
        <div className="container mx-auto max-w-2xl space-y-4">
          {/* Section header */}
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-4">
            <Calendar className="h-4 w-4" />
            <span>เลือกสิ่งที่คุณต้องการ</span>
          </div>

          {/* Location card */}
          <Card className="bg-zinc-900 border-zinc-800 p-6 hover:border-red-500/50 transition-colors">
            <Link href="#location" className="flex items-start gap-4">
              <div className="bg-zinc-800 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-1">ใกล้เคียง</h3>
                <p className="text-sm text-zinc-500">ดูแผนที่ร้านได้ที่นี่</p>
              </div>
            </Link>
          </Card>

          {/* Two column cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Book room card */}
            <Card className="bg-zinc-900 border-zinc-800 p-6 hover:border-red-500/50 transition-colors">
              <Link href="#rooms" className="block">
                <div className="bg-zinc-800 p-3 rounded-lg w-fit mb-3">
                  <Music2 className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">จองห้องซ้อม</h3>
                <p className="text-xs text-zinc-500">จองห้องหรือบัตรเข้างาน</p>
              </Link>
            </Card>

            {/* Private lessons card */}
            <Card className="bg-zinc-900 border-zinc-800 p-6 hover:border-red-500/50 transition-colors">
              <Link href="/classes" className="block">
                <div className="bg-zinc-800 p-3 rounded-lg w-fit mb-3">
                  <GraduationCap className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">เรียนส่วนตัว</h3>
                <p className="text-xs text-zinc-500">จองส่วนหน้าได้ก่อนใคร</p>
              </Link>
            </Card>
          </div>

          {/* Contact card */}
          <Card className="bg-zinc-900 border-zinc-800 p-6 hover:border-red-500/50 transition-colors">
            <Link href="tel:+66123456789" className="flex items-start gap-4">
              <div className="bg-zinc-800 p-3 rounded-lg">
                <Phone className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-1">ติดต่อเรา</h3>
                <p className="text-sm text-zinc-500">โทร 02-XXX-XXXX หรือ Line: @mollystudio</p>
              </div>
            </Link>
          </Card>

          {/* Opening hours card */}
          <Card className="bg-zinc-900 border-zinc-800 p-6 hover:border-red-500/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="bg-zinc-800 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-1">เวลาทำการ</h3>
                <p className="text-sm text-zinc-500">เปิดทุกวัน 10:00 - 22:00 น.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="rooms" className="py-8 px-4 bg-black">
        <div className="container mx-auto max-w-2xl">
          <h3 className="text-2xl font-heading text-white mb-4 uppercase">ห้องซ้อมที่มี</h3>

          <div className="space-y-4">
            {rooms?.map((room: Room) => (
              <Card key={room.id} className="bg-zinc-900 border-zinc-800 overflow-hidden">
                <Link href={`/rooms/${room.id}`} className="flex gap-4 p-4 hover:bg-zinc-800/50 transition-colors">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800">
                    <Image
                      src={room.image_url || "/placeholder.svg?height=200&width=200&query=music studio room"}
                      alt={room.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-white mb-1">{room.name}</h4>
                    <p className="text-sm text-zinc-500 mb-2 line-clamp-2">{room.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-600 uppercase">{room.type}</span>
                      <span className="text-lg font-bold text-red-500">฿{room.hourly_rate}/ชม.</span>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-6 px-4 bg-zinc-950 border-t border-zinc-900">
        <div className="container mx-auto text-center text-zinc-600 text-sm">
          <p>&copy; 2025 Molly Music Studio</p>
        </div>
      </footer>
    </div>
  )
}

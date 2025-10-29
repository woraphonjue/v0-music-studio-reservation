import { createClient } from "@/lib/supabase/server"
import type { PrivateClass } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, GraduationCap, ArrowLeft } from "lucide-react"
import Image from "next/image"

export default async function ClassesPage() {
  const supabase = await createClient()

  const { data: classes, error } = await supabase
    .from("private_classes")
    .select("*")
    .eq("is_available", true)
    .order("instrument", { ascending: true })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-white">เรียนส่วนตัว</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/20 to-transparent" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight text-balance">
              Learn From
              <br />
              <span className="text-orange-500">The Best</span>
            </h2>
            <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
              One-on-one private lessons with professional instructors. Master your instrument at your own pace.
            </p>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-16 px-4 bg-zinc-900/50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-white mb-8">Available Instructors</h3>

          {error && (
            <div className="bg-red-950/50 border border-red-900 text-red-400 p-4 rounded-lg mb-8">
              Error loading classes. Please try again later.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes?.map((classItem: PrivateClass) => (
              <Card
                key={classItem.id}
                className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-orange-500/50 transition-colors"
              >
                <div className="relative h-48 bg-zinc-800">
                  <Image
                    src={classItem.image_url || "/placeholder.svg?height=400&width=600"}
                    alt={classItem.instructor_name}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-orange-600 text-white border-0">
                    {classItem.instrument}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-white">{classItem.instructor_name}</CardTitle>
                  <CardDescription className="text-zinc-400">{classItem.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <GraduationCap className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">{classItem.instrument} Instructor</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">{classItem.duration_minutes} minutes per session</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <span className="text-sm font-semibold text-orange-500">฿{classItem.hourly_rate}/session</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/classes/${classItem.id}`} className="w-full">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">View & Book</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-4 bg-zinc-950">
        <div className="container mx-auto text-center text-zinc-500">
          <p>&copy; 2025 Molly Music Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

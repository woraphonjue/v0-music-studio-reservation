import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, GraduationCap, CheckCircle2 } from "lucide-react"
import Image from "next/image"

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: classItem, error } = await supabase.from("private_classes").select("*").eq("id", id).single()

  if (error || !classItem) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/classes">
            <Button variant="ghost" className="text-zinc-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Classes
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Instructor Image */}
          <div>
            <div className="relative h-96 md:h-[500px] bg-zinc-800 rounded-lg overflow-hidden">
              <Image
                src={classItem.image_url || "/placeholder.svg?height=600&width=800"}
                alt={classItem.instructor_name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Class Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-white">{classItem.instructor_name}</h1>
                <Badge className="bg-orange-600 text-white border-0">{classItem.instrument}</Badge>
              </div>
              <p className="text-xl text-zinc-400 leading-relaxed">{classItem.description}</p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Class Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <GraduationCap className="h-5 w-5 text-orange-500" />
                    <span>Instrument</span>
                  </div>
                  <span className="text-white font-semibold">{classItem.instrument}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <span>Session Duration</span>
                  </div>
                  <span className="text-white font-semibold">{classItem.duration_minutes} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <span>Price per Session</span>
                  </div>
                  <span className="text-orange-500 font-bold text-xl">฿{classItem.hourly_rate}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">What You'll Learn</CardTitle>
                <CardDescription className="text-zinc-400">
                  Comprehensive instruction tailored to your level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm">Proper technique and fundamentals</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm">Music theory and reading</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm">Personalized practice routines</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm">Performance skills and confidence</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm">Genre-specific techniques</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {user ? (
              <Link href={`/classes/${classItem.id}/book`} className="block">
                <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg">
                  Book a Lesson
                </Button>
              </Link>
            ) : (
              <div className="space-y-3">
                <p className="text-zinc-400 text-center">Please sign in to book a lesson</p>
                <Link href="/auth/login" className="block">
                  <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg">
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

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { PrivateClass } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { ArrowLeft, CalendarIcon, Clock } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { TimeSlotSelector } from "@/components/time-slot-selector"

interface ClassBookingFormProps {
  classItem: PrivateClass
  userId: string
  existingBookings: Array<{
    booking_date: string
    start_time: string
    end_time: string
  }>
}

export function ClassBookingForm({ classItem, userId, existingBookings }: ClassBookingFormProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [startTime, setStartTime] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate end time based on class duration
  const calculateEndTime = (start: string) => {
    if (!start) return ""

    const [hours, minutes] = start.split(":").map(Number)
    const totalMinutes = hours * 60 + minutes + classItem.duration_minutes

    const endHours = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60

    return `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`
  }

  const endTime = calculateEndTime(startTime)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !startTime) {
      setError("Please select a date and time")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/class-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          class_id: classItem.id,
          user_id: userId,
          booking_date: format(selectedDate, "yyyy-MM-dd"),
          start_time: startTime,
          end_time: endTime,
          total_price: classItem.hourly_rate,
          notes,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking")
      }

      router.push(`/class-bookings/${data.id}/payment`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href={`/classes/${classItem.id}`}>
        <Button variant="ghost" className="text-zinc-300 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Class Details
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Book Lesson with {classItem.instructor_name}</CardTitle>
              <CardDescription className="text-zinc-400">Select your preferred date and time</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div className="space-y-2">
                  <Label className="text-white flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-orange-500" />
                    Select Date
                  </Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-md border border-zinc-800 bg-zinc-950 text-white"
                  />
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div className="space-y-4">
                    <Label className="text-white flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      Select Start Time
                    </Label>
                    <TimeSlotSelector
                      selectedDate={selectedDate}
                      startTime={startTime}
                      endTime={endTime}
                      onStartTimeChange={setStartTime}
                      onEndTimeChange={() => {}}
                      existingBookings={existingBookings}
                    />
                    {startTime && (
                      <p className="text-zinc-400 text-sm">
                        Your lesson will end at <span className="text-white font-semibold">{endTime}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white">
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Tell us about your experience level, goals, or any special requests..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600"
                    rows={4}
                  />
                </div>

                {error && (
                  <div className="bg-red-950/50 border border-red-900 text-red-400 p-3 rounded-lg text-sm">{error}</div>
                )}

                <Button
                  type="submit"
                  disabled={!selectedDate || !startTime || isSubmitting}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-6"
                >
                  {isSubmitting ? "Processing..." : "Continue to Payment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div>
          <Card className="bg-zinc-900 border-zinc-800 sticky top-4">
            <CardHeader>
              <CardTitle className="text-white">Lesson Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-zinc-400 text-sm">Instructor</p>
                <p className="text-white font-semibold">{classItem.instructor_name}</p>
              </div>

              <div>
                <p className="text-zinc-400 text-sm">Instrument</p>
                <p className="text-white font-semibold">{classItem.instrument}</p>
              </div>

              {selectedDate && (
                <div>
                  <p className="text-zinc-400 text-sm">Date</p>
                  <p className="text-white font-semibold">{format(selectedDate, "MMMM d, yyyy")}</p>
                </div>
              )}

              {startTime && endTime && (
                <div>
                  <p className="text-zinc-400 text-sm">Time</p>
                  <p className="text-white font-semibold">
                    {startTime} - {endTime}
                  </p>
                </div>
              )}

              <div className="border-t border-zinc-800 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-zinc-400">Duration</span>
                  <span className="text-white">{classItem.duration_minutes} minutes</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-800">
                  <span className="text-white">Total</span>
                  <span className="text-orange-500">฿{classItem.hourly_rate.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

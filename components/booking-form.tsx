"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Room } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { ArrowLeft, CalendarIcon, Clock } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { TimeSlotSelector } from "@/components/time-slot-selector"

interface BookingFormProps {
  room: Room
  userId: string
  existingBookings: Array<{
    booking_date: string
    start_time: string
    end_time: string
  }>
}

export function BookingForm({ room, userId, existingBookings }: BookingFormProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateTotal = () => {
    if (!startTime || !endTime) return { hours: 0, price: 0 }

    const [startHour, startMin] = startTime.split(":").map(Number)
    const [endHour, endMin] = endTime.split(":").map(Number)

    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    if (endMinutes <= startMinutes) return { hours: 0, price: 0 }

    const totalMinutes = endMinutes - startMinutes
    const hours = totalMinutes / 60
    const price = hours * room.hourly_rate

    return { hours, price }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !startTime || !endTime) {
      setError("Please select a date and time")
      return
    }

    const { hours, price } = calculateTotal()

    if (hours <= 0) {
      setError("End time must be after start time")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: room.id,
          user_id: userId,
          booking_date: format(selectedDate, "yyyy-MM-dd"),
          start_time: startTime,
          end_time: endTime,
          total_hours: hours,
          total_price: price,
          notes,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking")
      }

      router.push(`/bookings/${data.id}/payment`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const { hours, price } = calculateTotal()

  return (
    <div className="max-w-4xl mx-auto">
      <Link href={`/rooms/${room.id}`}>
        <Button variant="ghost" className="text-zinc-300 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white text-3xl font-heading uppercase tracking-wide">
                Book {room.name}
              </CardTitle>
              <CardDescription className="text-zinc-400 text-lg">Pick your date and time</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div className="space-y-3">
                  <Label className="text-white flex items-center gap-2 text-lg font-semibold">
                    <CalendarIcon className="h-5 w-5 text-red-500" />
                    When do you want to jam?
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
                  <div className="space-y-3">
                    <Label className="text-white flex items-center gap-2 text-lg font-semibold">
                      <Clock className="h-5 w-5 text-red-500" />
                      What time?
                    </Label>
                    <TimeSlotSelector
                      selectedDate={selectedDate}
                      startTime={startTime}
                      endTime={endTime}
                      onStartTimeChange={setStartTime}
                      onEndTimeChange={setEndTime}
                      existingBookings={existingBookings}
                    />
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-white text-base font-semibold">
                    Any special requests? (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Need extra mics? Working on something specific? Let us know..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600"
                    rows={4}
                  />
                </div>

                {error && (
                  <div className="bg-red-950/50 border border-red-900 text-red-400 p-4 rounded-lg font-semibold">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!selectedDate || !startTime || !endTime || isSubmitting || hours <= 0}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xl py-7 font-bold uppercase tracking-wide shadow-lg shadow-red-600/20"
                >
                  {isSubmitting ? "Processing..." : "Continue to Payment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-zinc-900 border-zinc-800 sticky top-4">
            <CardHeader>
              <CardTitle className="text-white font-heading uppercase tracking-wide">Your Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">Room</p>
                <p className="text-white font-bold text-lg">{room.name}</p>
              </div>

              {selectedDate && (
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">Date</p>
                  <p className="text-white font-semibold">{format(selectedDate, "MMM d, yyyy")}</p>
                </div>
              )}

              {startTime && endTime && (
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">Time</p>
                  <p className="text-white font-semibold">
                    {startTime} - {endTime}
                  </p>
                </div>
              )}

              <div className="border-t border-zinc-800 pt-4 mt-4">
                <div className="flex justify-between mb-3">
                  <span className="text-zinc-400">Rate</span>
                  <span className="text-white font-semibold">฿{room.hourly_rate}/hr</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-zinc-400">Duration</span>
                  <span className="text-white font-semibold">{hours.toFixed(1)} hrs</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold pt-3 border-t border-zinc-800">
                  <span className="text-white uppercase tracking-wide">Total</span>
                  <span className="text-red-500 text-2xl">฿{price.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

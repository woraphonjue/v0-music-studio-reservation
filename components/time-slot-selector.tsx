"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

interface TimeSlotSelectorProps {
  selectedDate: Date
  startTime: string
  endTime: string
  onStartTimeChange: (time: string) => void
  onEndTimeChange: (time: string) => void
  existingBookings: Array<{
    booking_date: string
    start_time: string
    end_time: string
  }>
}

export function TimeSlotSelector({
  selectedDate,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  existingBookings,
}: TimeSlotSelectorProps) {
  // Generate time slots from 9 AM to 10 PM in 30-minute intervals
  const generateTimeSlots = () => {
    const slots: string[] = []
    for (let hour = 9; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 22 && minute > 0) break // Stop at 10:00 PM
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        slots.push(timeString)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  // Check if a time slot is available
  const isTimeSlotAvailable = (time: string, isEndTime = false) => {
    const selectedDateStr = format(selectedDate, "yyyy-MM-dd")

    // Check against existing bookings
    for (const booking of existingBookings) {
      if (booking.booking_date === selectedDateStr) {
        const bookingStart = booking.start_time.substring(0, 5)
        const bookingEnd = booking.end_time.substring(0, 5)

        if (isEndTime) {
          // For end time, check if it falls within an existing booking
          if (time > bookingStart && time <= bookingEnd) {
            return false
          }
        } else {
          // For start time, check if it falls within an existing booking
          if (time >= bookingStart && time < bookingEnd) {
            return false
          }
        }
      }
    }

    return true
  }

  // Filter end time slots based on start time
  const availableEndSlots = timeSlots.filter((slot) => {
    if (!startTime) return false
    return slot > startTime && isTimeSlotAvailable(slot, true)
  })

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-zinc-300">Start Time</Label>
        <Select value={startTime} onValueChange={onStartTimeChange}>
          <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
            <SelectValue placeholder="Select start time" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {timeSlots.map((slot) => (
              <SelectItem
                key={slot}
                value={slot}
                disabled={!isTimeSlotAvailable(slot)}
                className="text-white hover:bg-zinc-800 focus:bg-zinc-800"
              >
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-300">End Time</Label>
        <Select value={endTime} onValueChange={onEndTimeChange} disabled={!startTime}>
          <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
            <SelectValue placeholder="Select end time" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {availableEndSlots.map((slot) => (
              <SelectItem key={slot} value={slot} className="text-white hover:bg-zinc-800 focus:bg-zinc-800">
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

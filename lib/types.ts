export interface Room {
  id: string
  name: string
  type: "practice" | "recording" | "rehearsal"
  description: string | null
  capacity: number
  hourly_rate: number
  image_url: string | null
  amenities: string[] | null
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface RoomImage {
  id: string
  room_id: string
  image_url: string
  display_order: number
  created_at: string
}

export interface Booking {
  id: string
  room_id: string
  user_id: string
  booking_date: string
  start_time: string
  end_time: string
  total_hours: number
  total_price: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  payment_status: "pending" | "paid" | "refunded"
  payment_slip_url: string | null
  terms_accepted: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PrivateClass {
  id: string
  instructor_name: string
  instrument: string
  description: string | null
  hourly_rate: number
  duration_minutes: number
  image_url: string | null
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface ClassBooking {
  id: string
  class_id: string
  user_id: string
  booking_date: string
  start_time: string
  end_time: string
  total_price: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  payment_status: "pending" | "paid" | "refunded"
  payment_slip_url: string | null
  terms_accepted: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

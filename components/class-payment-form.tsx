"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import Image from "next/image"

interface ClassPaymentFormProps {
  booking: {
    id: string
    booking_date: string
    start_time: string
    end_time: string
    total_price: number
    private_classes: {
      instructor_name: string
      instrument: string
      duration_minutes: number
    }
  }
}

export function ClassPaymentForm({ booking }: ClassPaymentFormProps) {
  const router = useRouter()
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file")
        return
      }

      setPaymentSlip(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!paymentSlip) {
      setError("Please upload your payment slip")
      return
    }

    if (!termsAccepted) {
      setError("Please accept the terms and conditions")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.readAsDataURL(paymentSlip)

      reader.onload = async () => {
        const base64 = reader.result as string

        const response = await fetch(`/api/class-bookings/${booking.id}/payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payment_slip: base64,
            terms_accepted: termsAccepted,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to submit payment")
        }

        router.push(`/class-bookings/${booking.id}/confirmation`)
      }

      reader.onerror = () => {
        throw new Error("Failed to read file")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/classes">
        <Button variant="ghost" className="text-zinc-300 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white text-3xl font-heading uppercase tracking-wide">Almost There!</CardTitle>
              <CardDescription className="text-zinc-400 text-lg">
                Just scan, pay, and upload your receipt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-zinc-950 p-6 rounded-lg border border-zinc-800">
                <h3 className="text-white font-semibold mb-4 text-lg">Quick Steps:</h3>
                <ol className="space-y-3 text-zinc-300">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center">
                      1
                    </span>
                    <span className="pt-1">Scan the QR code with your banking app</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center">
                      2
                    </span>
                    <span className="pt-1">Pay ฿{booking.total_price.toFixed(2)}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center">
                      3
                    </span>
                    <span className="pt-1">Screenshot your payment confirmation</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center">
                      4
                    </span>
                    <span className="pt-1">Upload it below and you're done!</span>
                  </li>
                </ol>
              </div>

              {/* QR Code */}
              <div className="flex justify-center py-8">
                <div className="bg-white p-6 rounded-lg shadow-xl">
                  <Image
                    src="/payment-qr-code.jpg"
                    alt="Payment QR Code"
                    width={300}
                    height={300}
                    className="rounded"
                  />
                  <p className="text-center text-zinc-900 font-bold mt-4 text-lg">Molly Music Studio</p>
                  <p className="text-center text-red-600 font-bold text-xl mt-1">฿{booking.total_price.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white text-2xl font-heading uppercase tracking-wide">Upload Receipt</CardTitle>
              <CardDescription className="text-zinc-400">Drop your payment screenshot here</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-64 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
                        <Image
                          src={previewUrl || "/placeholder.svg"}
                          alt="Payment slip preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setPaymentSlip(null)
                          setPreviewUrl(null)
                        }}
                        className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <label
                      htmlFor="payment-slip"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer bg-zinc-950 hover:bg-zinc-900 hover:border-red-600/50 transition-all"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-16 h-16 mb-4 text-red-500" />
                        <p className="mb-2 text-lg text-zinc-300 font-semibold">Click or drag your screenshot here</p>
                        <p className="text-sm text-zinc-500">PNG, JPG (Max 5MB)</p>
                      </div>
                      <input
                        id="payment-slip"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                      className="mt-1 border-zinc-700 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                    />
                    <div className="space-y-2">
                      <Label
                        htmlFor="terms"
                        className="text-white font-semibold cursor-pointer leading-relaxed text-base"
                      >
                        I agree to the lesson rules
                      </Label>
                      <div className="text-sm text-zinc-400 space-y-1 leading-relaxed">
                        <p>• No refunds after booking</p>
                        <p>• Show up 5 min early</p>
                        <p>• Cancel 24hrs ahead or lose it</p>
                        <p>• Bring your own gear if needed</p>
                        <p>• Respect your instructor's time</p>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-950/50 border border-red-900 text-red-400 p-4 rounded-lg font-semibold">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!paymentSlip || !termsAccepted || isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xl py-7 font-bold uppercase tracking-wide shadow-lg shadow-red-600/20"
                >
                  {isSubmitting ? "Processing..." : "Confirm Lesson"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-zinc-900 border-zinc-800 sticky top-4">
            <CardHeader>
              <CardTitle className="text-white font-heading uppercase tracking-wide">Your Lesson</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">Instructor</p>
                <p className="text-white font-bold text-lg">{booking.private_classes.instructor_name}</p>
              </div>

              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">Instrument</p>
                <p className="text-white font-semibold">{booking.private_classes.instrument}</p>
              </div>

              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">Date</p>
                <p className="text-white font-semibold">{format(new Date(booking.booking_date), "MMM d, yyyy")}</p>
              </div>

              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">Time</p>
                <p className="text-white font-semibold">
                  {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}
                </p>
              </div>

              <div className="border-t border-zinc-800 pt-4 mt-4">
                <div className="flex justify-between mb-3">
                  <span className="text-zinc-400">Duration</span>
                  <span className="text-white font-semibold">{booking.private_classes.duration_minutes} min</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold pt-3 border-t border-zinc-800">
                  <span className="text-white uppercase tracking-wide">Total</span>
                  <span className="text-red-500 text-2xl">฿{booking.total_price.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-red-950/30 border border-red-900/50 p-4 rounded-lg mt-4">
                <p className="text-red-400 text-sm leading-relaxed font-semibold">
                  <CheckCircle2 className="inline h-4 w-4 mr-1" />
                  We'll confirm once we verify your payment
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

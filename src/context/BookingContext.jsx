import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const { user } = useAuth()
  const [schedule, setSchedule] = useState([])
  const [reservations, setReservations] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchSchedule = useCallback(async () => {
    const { data: courses, error } = await supabase
      .from('courses')
      .select(`*, coaches (id, first_name, last_name)`)

    if (error || !courses || courses.length === 0) return

    const today = new Date().toISOString().split('T')[0]
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    const nextWeekStr = nextWeek.toISOString().split('T')[0]

    const { data: bookings } = await supabase
      .from('bookings')
      .select('course_id, date')
      .eq('status', 'confirmed')
      .gte('date', today)
      .lte('date', nextWeekStr)

    const upcoming = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay()
      const dateStr = date.toISOString().split('T')[0]

      const coursesForDay = courses.filter(c => c.day_of_week === dayOfWeek)

      for (const course of coursesForDay) {
        const bookedCount = bookings
          ? bookings.filter(b => b.course_id === course.id && b.date === dateStr).length
          : 0

        upcoming.push({
          id: `${course.id}_${dateStr}`,
          courseId: course.id,
          date: dateStr,
          time: course.start_time.slice(0, 5),
          name: course.name,
          instructor: `${course.coaches.first_name} ${course.coaches.last_name}`,
          duration: course.duration_minutes,
          capacity: course.max_spots,
          booked: bookedCount,
          available: course.max_spots - bookedCount,
          clubId: course.club_id,
          activity: course.name.toLowerCase()
        })
      }
    }

    setSchedule(upcoming)
  }, [])

  const fetchReservations = useCallback(async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        courses (
          name,
          start_time,
          duration_minutes,
          club_id,
          coaches (first_name, last_name)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) return

    setReservations(data || [])
  }, [user])

  useEffect(() => {
    fetchSchedule()
  }, [fetchSchedule])

  useEffect(() => {
    fetchReservations()
  }, [fetchReservations])

  const bookClass = async (classItem) => {
    if (!user) return { success: false, error: 'Connectez-vous pour réserver' }

    setIsLoading(true)
    try {
      if (classItem.available <= 0) {
        return { success: false, error: 'Ce cours est complet' }
      }

      // Vérifier si une réservation existe déjà (confirmée ou annulée)
      const { data: existing } = await supabase
        .from('bookings')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('course_id', classItem.courseId)
        .eq('date', classItem.date)
        .maybeSingle()

      if (existing?.status === 'confirmed') {
        return { success: false, error: 'Vous avez déjà réservé ce cours' }
      }

      if (existing?.status === 'cancelled') {
        // Réactiver la réservation annulée
        const { error } = await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', existing.id)

        if (error) throw new Error('Erreur lors de la réservation')
      } else {
        // Nouvelle réservation
        const { error } = await supabase
          .from('bookings')
          .insert({
            user_id: user.id,
            course_id: classItem.courseId,
            date: classItem.date,
            status: 'confirmed'
          })

        if (error) {
          if (error.code === '23505') throw new Error('Vous avez déjà réservé ce cours')
          throw new Error('Erreur lors de la réservation')
        }
      }

      await fetchSchedule()
      await fetchReservations()

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const cancelReservation = async (bookingId) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

      if (error) throw error

      await fetchSchedule()
      await fetchReservations()

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const getActiveReservations = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return reservations.filter(r => r.status === 'confirmed' && r.date >= today)
  }, [reservations])

  const getPastReservations = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return reservations.filter(r => r.date < today || r.status === 'cancelled')
  }, [reservations])

  const value = {
    schedule,
    reservations,
    isLoading,
    bookClass,
    cancelReservation,
    getActiveReservations,
    getPastReservations,
    fetchSchedule,
    fetchReservations
  }

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}

export default BookingContext
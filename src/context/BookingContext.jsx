import { createContext, useContext, useState, useCallback } from 'react'
import { generateId } from '../utils/helpers'

const BookingContext = createContext(null)

// Mock schedule data
const generateSchedule = () => {
  const schedule = []
  const classes = [
    { name: 'APEX BURN', instructor: 'Sarah M.', duration: 45, capacity: 20, activity: 'cardio' },
    { name: 'POWER LIFT', instructor: 'Thomas K.', duration: 60, capacity: 15, activity: 'musculation' },
    { name: 'APEX WOD', instructor: 'Marco V.', duration: 50, capacity: 12, activity: 'crossfit' },
    { name: 'FLOW YOGA', instructor: 'Lisa P.', duration: 60, capacity: 18, activity: 'yoga' },
    { name: 'COMBAT FIT', instructor: 'Karim B.', duration: 45, capacity: 16, activity: 'boxing' },
    { name: 'HYROX PREP', instructor: 'Alex R.', duration: 75, capacity: 10, activity: 'hyrox' },
    { name: 'CORE BLAST', instructor: 'Emma L.', duration: 30, capacity: 25, activity: 'cardio' },
    { name: 'STRETCH & RELAX', instructor: 'Lisa P.', duration: 45, capacity: 20, activity: 'yoga' }
  ]
  
  const times = ['07:00', '08:00', '09:30', '12:00', '13:00', '17:30', '18:30', '19:30', '20:30']
  
  // Generate schedule for next 7 days
  for (let day = 0; day < 7; day++) {
    const date = new Date()
    date.setDate(date.getDate() + day)
    const dateStr = date.toISOString().split('T')[0]
    
    // Random number of classes per day
    const numClasses = 5 + Math.floor(Math.random() * 4)
    const usedTimes = new Set()
    
    for (let i = 0; i < numClasses; i++) {
      let time
      do {
        time = times[Math.floor(Math.random() * times.length)]
      } while (usedTimes.has(time))
      usedTimes.add(time)
      
      const classInfo = classes[Math.floor(Math.random() * classes.length)]
      const booked = Math.floor(Math.random() * classInfo.capacity)
      
      schedule.push({
        id: generateId(),
        date: dateStr,
        time,
        ...classInfo,
        booked,
        available: classInfo.capacity - booked,
        clubId: 'apex-paris-opera'
      })
    }
  }
  
  return schedule.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date)
    return a.time.localeCompare(b.time)
  })
}

// Mock user reservations
const initialReservations = [
  {
    id: 'res-001',
    classId: 'class-001',
    className: 'APEX BURN',
    instructor: 'Sarah M.',
    date: new Date().toISOString().split('T')[0],
    time: '18:30',
    duration: 45,
    clubId: 'apex-paris-opera',
    clubName: 'APEX Opéra',
    status: 'confirmed',
    bookedAt: new Date().toISOString()
  },
  {
    id: 'res-002',
    classId: 'class-002',
    className: 'POWER LIFT',
    instructor: 'Thomas K.',
    date: (() => {
      const d = new Date()
      d.setDate(d.getDate() + 2)
      return d.toISOString().split('T')[0]
    })(),
    time: '19:30',
    duration: 60,
    clubId: 'apex-paris-opera',
    clubName: 'APEX Opéra',
    status: 'confirmed',
    bookedAt: new Date().toISOString()
  }
]

export function BookingProvider({ children }) {
  const [schedule, setSchedule] = useState(() => generateSchedule())
  const [reservations, setReservations] = useState(initialReservations)
  const [waitlist, setWaitlist] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const getScheduleByDate = useCallback((date) => {
    return schedule.filter(item => item.date === date)
  }, [schedule])

  const getScheduleByClub = useCallback((clubId) => {
    return schedule.filter(item => item.clubId === clubId)
  }, [schedule])

  const getScheduleByActivity = useCallback((activity) => {
    return schedule.filter(item => item.activity === activity)
  }, [schedule])

  const bookClass = async (classItem) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Check if class is full
      if (classItem.available <= 0) {
        throw new Error('Ce cours est complet. Souhaitez-vous rejoindre la liste d\'attente ?')
      }
      
      // Check if already booked
      const alreadyBooked = reservations.some(
        r => r.classId === classItem.id && r.status !== 'cancelled'
      )
      
      if (alreadyBooked) {
        throw new Error('Vous avez déjà réservé ce cours.')
      }
      
      const reservation = {
        id: `res-${generateId()}`,
        classId: classItem.id,
        className: classItem.name,
        instructor: classItem.instructor,
        date: classItem.date,
        time: classItem.time,
        duration: classItem.duration,
        clubId: classItem.clubId,
        clubName: 'APEX Opéra', // Would come from clubs data
        status: 'confirmed',
        bookedAt: new Date().toISOString()
      }
      
      setReservations(prev => [...prev, reservation])
      
      // Update schedule availability
      setSchedule(prev => prev.map(item => 
        item.id === classItem.id 
          ? { ...item, booked: item.booked + 1, available: item.available - 1 }
          : item
      ))
      
      return { success: true, reservation }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const cancelReservation = async (reservationId) => {
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const reservation = reservations.find(r => r.id === reservationId)
      
      if (!reservation) {
        throw new Error('Réservation non trouvée.')
      }
      
      // Update reservation status
      setReservations(prev => prev.map(r => 
        r.id === reservationId 
          ? { ...r, status: 'cancelled', cancelledAt: new Date().toISOString() }
          : r
      ))
      
      // Update schedule availability
      setSchedule(prev => prev.map(item => 
        item.id === reservation.classId 
          ? { ...item, booked: item.booked - 1, available: item.available + 1 }
          : item
      ))
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const joinWaitlist = async (classItem) => {
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const waitlistEntry = {
        id: `wait-${generateId()}`,
        classId: classItem.id,
        className: classItem.name,
        date: classItem.date,
        time: classItem.time,
        position: waitlist.filter(w => w.classId === classItem.id).length + 1,
        joinedAt: new Date().toISOString()
      }
      
      setWaitlist(prev => [...prev, waitlistEntry])
      
      return { success: true, position: waitlistEntry.position }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const leaveWaitlist = async (waitlistId) => {
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setWaitlist(prev => prev.filter(w => w.id !== waitlistId))
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const getActiveReservations = useCallback(() => {
    return reservations.filter(r => r.status === 'confirmed')
  }, [reservations])

  const getPastReservations = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return reservations.filter(r => r.date < today || r.status === 'cancelled')
  }, [reservations])

  const value = {
    schedule,
    reservations,
    waitlist,
    isLoading,
    getScheduleByDate,
    getScheduleByClub,
    getScheduleByActivity,
    bookClass,
    cancelReservation,
    joinWaitlist,
    leaveWaitlist,
    getActiveReservations,
    getPastReservations
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

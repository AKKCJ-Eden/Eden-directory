// Eden Icon Library - Pure SVG, zero build errors, retina sharp
// All icons use the Eden forest green palette by default

const Icon = ({ d, size = 20, color = 'currentColor', strokeWidth = 1.5, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path}/>) : <path d={d}/>}
  </svg>
)

const CircleIcon = ({ children, size = 20, color = 'currentColor', strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)

//  CATEGORY ICONS 
export const IconHair = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3c0 0 1 2 1 5s-2 4-2 7c0 2 1 4 3 5"/>
    <path d="M10 3c0 0 1 2 1 5s-2 4-2 7c0 2 1 4 3 5"/>
    <path d="M14 3c0 0 1 2 1 5s-2 4-2 7c0 2 1 4 3 5"/>
    <path d="M18 3c0 0 1 2 1 5s-2 4-2 7c0 2 1 4 3 5"/>
  </svg>
)

export const IconBarber = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12"/>
    <path d="M6 8h12"/>
    <path d="M9 3v18"/>
    <path d="M15 3v18"/>
    <circle cx="9" cy="18" r="2"/>
    <circle cx="15" cy="18" r="2"/>
  </svg>
)

export const IconNails = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 18c0 2 1.5 3 4 3s4-1 4-3V8c0-1-1-2-2-2h-4C9 6 8 7 8 8v10z"/>
    <path d="M8 10h8"/>
    <path d="M12 6V3"/>
  </svg>
)

export const IconAesthetics = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
    <path d="M4.9 4.9l2.1 2.1M16.9 16.9l2.1 2.1M4.9 19.1l2.1-2.1M16.9 7.1l2.1-2.1"/>
  </svg>
)

export const IconBeauty = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/>
    <circle cx="12" cy="9" r="2"/>
  </svg>
)

export const IconSpa = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c0 0-8-4-8-10a8 8 0 0 1 16 0c0 6-8 10-8 10z"/>
    <path d="M12 8v6"/>
    <path d="M9 11h6"/>
  </svg>
)

export const IconMakeup = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/>
  </svg>
)

export const IconTattoo = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3l4 4-14 14H3v-4L17 3z"/>
    <path d="M14 6l4 4"/>
  </svg>
)

export const IconTanning = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
  </svg>
)

export const IconFitness = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4v6M18 4v6M3 9h4M17 9h4M6 14v6M18 14v6M3 15h4M17 15h4M10 12h4"/>
  </svg>
)

export const IconPT = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2"/>
    <path d="M12 7v8"/>
    <path d="M8 9l4 2 4-2"/>
    <path d="M9 21l3-6 3 6"/>
  </svg>
)

export const IconDog = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2 .336-3.5 2-3.5 4 0 1.381.956 2.521 2.286 2.885"/>
    <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2 .336 3.5 2 3.5 4 0 1.381-.956 2.521-2.286 2.885"/>
    <path d="M8 14v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4"/>
    <path d="M6 10c0 3.314 2.686 6 6 6s6-2.686 6-6"/>
    <circle cx="9" cy="9" r="1" fill={color}/>
    <circle cx="15" cy="9" r="1" fill={color}/>
  </svg>
)

export const IconMobile = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2"/>
    <circle cx="12" cy="17" r="1" fill={color}/>
    <path d="M9 6h6"/>
  </svg>
)

export const IconLaser = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 9V5"/>
  </svg>
)

export const IconHealth = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
)

export const IconDental = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5.5c-1.5-2-3.5-2.5-5-1.5S5 7.5 5 9c0 4 3 8 7 10 4-2 7-6 7-10 0-1.5-.5-3.5-2-4.5S13.5 3.5 12 5.5z"/>
    <path d="M12 5.5v8"/>
  </svg>
)

export const IconAfro = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5"/>
    <path d="M8 13c-2 1-3 3-3 5h14c0-2-1-4-3-5"/>
    <path d="M7 5c0-1 1-2 1-2s1 1 4 1 4-1 4-1 1 1 1 2"/>
  </svg>
)

export const IconIntegration = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c-2 2-4 6-4 10s2 8 4 10c2-2 4-6 4-10S14 4 12 2z"/>
    <path d="M2 12c2 2 6 4 10 4s8-2 10-4c-2-2-6-4-10-4S4 10 2 12z"/>
  </svg>
)

export const IconSemiPerm = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
    <path d="M12 8v2M12 14v2M8 12h2M14 12h2"/>
  </svg>
)

//  UI ICONS 
export const IconSearch = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35"/>
  </svg>
)

export const IconLocation = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
)

export const IconStar = ({ size=20, color='currentColor', filled=false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

export const IconHeart = ({ size=20, color='currentColor', filled=false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

export const IconCalendar = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
)

export const IconClock = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
)

export const IconCheck = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)

export const IconArrow = ({ size=20, color='currentColor', direction='right' }) => {
  const paths = { right:'M5 12h14M12 5l7 7-7 7', left:'M19 12H5M12 19l-7-7 7-7', down:'M12 5v14M5 12l7 7 7-7' }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {paths[direction].split('M').filter(Boolean).map((p, i) => <path key={i} d={'M' + p}/>)}
    </svg>
  )
}

export const IconVerified = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 4.8 5.6.8-4 3.9.9 5.5L12 14.4l-4.9 2.6.9-5.5-4-3.9 5.6-.8L12 2z"/>
    <path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2}/>
  </svg>
)

export const IconMenu = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h18M3 6h18M3 18h18"/>
  </svg>
)

export const IconClose = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
)

export const IconLock = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

export const IconChart = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 20V10M12 20V4M6 20v-6"/>
  </svg>
)

export const IconSettings = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

export const IconUser = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

export const IconBell = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

export const IconPhoto = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <path d="M21 15l-5-5L5 21"/>
  </svg>
)

export const IconReview = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)

export const IconCard = ({ size=20, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2"/>
    <path d="M1 10h22"/>
  </svg>
)

//  EDEN LOGO MARK 
export const EdenLogo = ({ size=32, color='#5a8a62' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M16 28C16 28 6 20 6 12C6 7.58 10.48 4 16 4C21.52 4 26 7.58 26 12C26 20 16 28 16 28Z"
      stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 12C16 12 13 9 10 10" stroke={color} strokeWidth={1.5} strokeLinecap="round"/>
    <path d="M16 12C16 12 19 9 22 10" stroke={color} strokeWidth={1.5} strokeLinecap="round"/>
    <path d="M16 12V22" stroke={color} strokeWidth={1.5} strokeLinecap="round"/>
    <path d="M16 16C16 16 14 14 12 15" stroke={color} strokeWidth={1.5} strokeLinecap="round"/>
    <path d="M16 16C16 16 18 14 20 15" stroke={color} strokeWidth={1.5} strokeLinecap="round"/>
  </svg>
)

//  CATEGORY ICON MAP 
export const CATEGORY_ICONS = {
  all:         IconBeauty,
  hair:        IconHair,
  barber:      IconBarber,
  nails:       IconNails,
  aesthetics:  IconAesthetics,
  beauty:      IconBeauty,
  spa:         IconSpa,
  makeup:      IconMakeup,
  tattoo:      IconTattoo,
  tanning:     IconTanning,
  fitness:     IconFitness,
  pt:          IconPT,
  dog:         IconDog,
  mobile:      IconMobile,
  integration: IconIntegration,
  laser:       IconLaser,
  health:      IconHealth,
  dental:      IconDental,
  afro:        IconAfro,
  semiperm:    IconSemiPerm,
}

export default {
  EdenLogo, CATEGORY_ICONS,
  IconHair, IconBarber, IconNails, IconAesthetics, IconBeauty,
  IconSpa, IconMakeup, IconTattoo, IconTanning, IconFitness,
  IconPT, IconDog, IconMobile, IconIntegration, IconLaser,
  IconHealth, IconDental, IconAfro, IconSemiPerm,
  IconSearch, IconLocation, IconStar, IconHeart, IconCalendar,
  IconClock, IconCheck, IconArrow, IconVerified, IconMenu,
  IconClose, IconLock, IconChart, IconSettings, IconUser,
  IconBell, IconPhoto, IconReview, IconCard,
}

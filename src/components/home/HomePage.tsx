import { useState } from 'react'
import { ABOUT_ME_CONTENT } from '@/data/aboutMeContent'
import { STORY_STEPS } from '@/data/storySteps'
import { entranceAudio } from '@/utils/entranceAudio'
import heroPortraitUrl from '@/assets/hero-bg.jpg'

interface HomePageProps {
  onEnter?: () => void
}

interface OrbitCardItem {
  id: string
  type: 'feature' | 'visual'
  title: string
  subtitle: string
  badgeBg?: string
  badgeColor?: string
  icon?: 'focus' | 'ideas' | 'plan' | 'code'
  imageGradient?: string
  stepIndex?: number
}

const ORBIT_CARDS: OrbitCardItem[] = [
  {
    id: 'ui-ux',
    type: 'feature',
    title: 'UI / UX',
    subtitle: 'Deep craft, Intuitive flows.',
    badgeBg: '#e4f7a1',
    badgeColor: '#365314',
    icon: 'focus',
    stepIndex: 3, // Notebook
  },
  {
    id: 'visual-1',
    type: 'visual',
    title: '3D Studio',
    subtitle: 'Interactive Room',
    imageGradient:
      'linear-gradient(135deg, #27272a 0%, #52525b 48%, #e4e4e7 100%)',
    stepIndex: 1, // Studio Workspace
  },
  {
    id: 'ideas',
    type: 'feature',
    title: 'Ideas',
    subtitle: 'Capture everything.',
    badgeBg: '#ddd6fe',
    badgeColor: '#5b21b6',
    icon: 'ideas',
    stepIndex: 7, // Gallery Art
  },
  {
    id: 'visual-2',
    type: 'visual',
    title: '1970 CB750',
    subtitle: 'Showroom Patio',
    imageGradient:
      'linear-gradient(135deg, #090d16 0%, #1e293b 55%, #94a3b8 100%)',
    stepIndex: 2, // Bike Showroom
  },
  {
    id: 'plan',
    type: 'feature',
    title: 'Build',
    subtitle: 'Turn ideas into code.',
    badgeBg: '#fed7aa',
    badgeColor: '#9a3412',
    icon: 'plan',
    stepIndex: 4, // Tech Stack Bookshelf
  },
  {
    id: 'visual-3',
    type: 'visual',
    title: 'Vinyl Audio',
    subtitle: 'Studio Atmosphere',
    imageGradient:
      'linear-gradient(135deg, #1c1917 0%, #44403c 50%, #d6d3d1 100%)',
    stepIndex: 5, // Music Player
  },
]

export function HomePage({ onEnter }: HomePageProps) {
  const [activeNav, setActiveNav] = useState<'about' | 'work' | 'stack' | 'contact'>('stack')

  const scrollToStudioStep = (stepIndex?: number) => {
    try {
      entranceAudio.playKnock()
    } catch {
      // Ignore audio autoplay restrictions
    }

    const studioEl = document.getElementById('studio-workspace')
    if (!studioEl) {
      onEnter?.()
      return
    }

    if (typeof stepIndex === 'number') {
      const rect = studioEl.getBoundingClientRect()
      const containerTop = window.scrollY + rect.top
      const scrollableDistance = studioEl.offsetHeight - window.innerHeight
      const clampedIdx = Math.max(0, Math.min(STORY_STEPS.length - 1, stepIndex))
      const targetProgress = (clampedIdx + 0.25) / STORY_STEPS.length
      window.scrollTo({
        top: containerTop + targetProgress * scrollableDistance,
        behavior: 'smooth',
      })
    } else if (onEnter) {
      onEnter()
    } else {
      studioEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero-section"
      aria-label="Hero Introduction"
      className="relative min-h-screen w-full bg-[#ffffff] text-[#141413] flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Inline Keyframes for True 3D Elliptical Card Orbit (Front & Back Depth Passing) */}
      <style>{`
        @keyframes heroCardOrbit {
          0% {
            transform: translate3d(0px, 34px, 180px) rotateY(0deg) rotateZ(-4deg) scale(1.06);
            z-index: 30;
            opacity: 1;
            filter: blur(0px);
          }
          16.6% {
            transform: translate3d(250px, 10px, 95px) rotateY(-28deg) rotateZ(4deg) scale(0.96);
            z-index: 25;
            opacity: 0.96;
            filter: blur(0px);
          }
          33.3% {
            transform: translate3d(295px, -38px, -110px) rotateY(-58deg) rotateZ(9deg) scale(0.76);
            z-index: 5;
            opacity: 0.52;
            filter: blur(1px);
          }
          50% {
            transform: translate3d(0px, -64px, -180px) rotateY(0deg) rotateZ(0deg) scale(0.66);
            z-index: 2;
            opacity: 0.28;
            filter: blur(2px);
          }
          66.6% {
            transform: translate3d(-295px, -38px, -110px) rotateY(58deg) rotateZ(-9deg) scale(0.76);
            z-index: 5;
            opacity: 0.52;
            filter: blur(1px);
          }
          83.3% {
            transform: translate3d(-250px, 10px, 95px) rotateY(28deg) rotateZ(-4deg) scale(0.96);
            z-index: 25;
            opacity: 0.96;
            filter: blur(0px);
          }
          100% {
            transform: translate3d(0px, 34px, 180px) rotateY(0deg) rotateZ(-4deg) scale(1.06);
            z-index: 30;
            opacity: 1;
            filter: blur(0px);
          }
        }

        @media (max-width: 640px) {
          @keyframes heroCardOrbit {
            0% {
              transform: translate3d(0px, 26px, 130px) rotateY(0deg) rotateZ(-3deg) scale(0.94);
              z-index: 30;
              opacity: 1;
              filter: blur(0px);
            }
            16.6% {
              transform: translate3d(145px, 8px, 75px) rotateY(-25deg) rotateZ(3deg) scale(0.86);
              z-index: 25;
              opacity: 0.94;
              filter: blur(0px);
            }
            33.3% {
              transform: translate3d(168px, -26px, -80px) rotateY(-52deg) rotateZ(7deg) scale(0.68);
              z-index: 5;
              opacity: 0.45;
              filter: blur(1px);
            }
            50% {
              transform: translate3d(0px, -46px, -135px) rotateY(0deg) rotateZ(0deg) scale(0.58);
              z-index: 2;
              opacity: 0.22;
              filter: blur(1.5px);
            }
            66.6% {
              transform: translate3d(-168px, -26px, -80px) rotateY(52deg) rotateZ(-7deg) scale(0.68);
              z-index: 5;
              opacity: 0.45;
              filter: blur(1px);
            }
            83.3% {
              transform: translate3d(-145px, 8px, 75px) rotateY(25deg) rotateZ(-3deg) scale(0.86);
              z-index: 25;
              opacity: 0.94;
              filter: blur(0px);
            }
            100% {
              transform: translate3d(0px, 26px, 130px) rotateY(0deg) rotateZ(-3deg) scale(0.94);
              z-index: 30;
              opacity: 1;
              filter: blur(0px);
            }
          }
        }

        @keyframes floatSlowLeft {
          0%, 100% { transform: rotate(-6deg) translateY(0px); }
          50% { transform: rotate(-4.5deg) translateY(-8px); }
        }

        @keyframes floatSlowRight {
          0%, 100% { transform: rotate(6deg) translateY(0px); }
          50% { transform: rotate(4.5deg) translateY(-8px); }
        }

        @keyframes spinBadgeSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Top Navigation Bar */}
      <header className="relative z-30 w-full max-w-[1360px] mx-auto px-6 sm:px-12 pt-5 sm:pt-7 flex items-center justify-between">
        {/* Brand Logo (Left) */}
        <a
          href="#hero-section"
          className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#141413] flex items-start"
        >
          <span>Benny</span>
          <span className="text-xs font-semibold ml-0.5 -mt-0.5 text-[#141413]/70">°</span>
        </a>

        {/* Center Pill Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-[#f6f5f2] border border-black/[0.05] shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
        >
          {[
            { id: 'about' as const, label: 'About Me', step: 3 },
            { id: 'work' as const, label: '3D Studio', step: 1 },
            { id: 'stack' as const, label: 'Capabilities', step: 4 },
            { id: 'contact' as const, label: 'Contact', step: 6 },
          ].map((item) => {
            const isActive = activeNav === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveNav(item.id)
                  scrollToStudioStep(item.step)
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-[#141413] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                    : 'text-[#52524e] hover:text-[#141413]'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Top-Right Dark Pill Action Button */}
        <button
          type="button"
          onClick={() => scrollToStudioStep(0)}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#141413] text-white px-4 sm:px-5 py-2.5 text-xs font-sans font-medium shadow-[0_8px_20px_rgba(20,20,19,0.16)] hover:bg-[#292927] active:scale-95 transition-all"
        >
          <span>Enter Studio</span>
          <span className="text-[11px] leading-none">↗</span>
        </button>
      </header>

      {/* Main Editorial Hero Content */}
      <div className="relative z-20 w-full max-w-[1360px] mx-auto px-6 sm:px-12 pt-4 sm:pt-6 flex flex-col items-center text-center">
        {/* Rotating Circular Stamp Badge (Top Right like Mindly reference) */}
        <div
          aria-hidden="true"
          className="hidden lg:flex items-center justify-center absolute right-16 top-6 w-24 h-24 pointer-events-none"
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ animation: 'spinBadgeSlow 22s linear infinite' }}
          >
            <defs>
              <path
                id="heroStampCircle"
                d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
              />
            </defs>
            <text
              fill="#272725"
              fontSize="7.3"
              fontWeight="600"
              letterSpacing="2.4px"
              className="font-mono uppercase"
            >
              <textPath href="#heroStampCircle" startOffset="0%">
                • CREATIVE STUDIO • DESIGN &amp; CODE
              </textPath>
            </text>
          </svg>
          {/* 4-Point Star in Center of Badge */}
          <svg
            viewBox="0 0 24 24"
            className="absolute w-4 h-4 text-[#141413]"
            fill="currentColor"
          >
            <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
          </svg>
        </div>

        {/* Two-Line Editorial Serif Display Heading */}
        <h1 className="font-serif text-[2.5rem] sm:text-[4.1rem] md:text-[4.85rem] leading-[1.03] tracking-[-0.025em] text-[#141413] max-w-3xl">
          <span className="block font-normal">A clearer vision</span>
          <span className="block italic font-normal mt-0.5">
            for a brighter digital space.
          </span>
        </h1>

        {/* Clean Subtitle */}
        <p className="mt-3 sm:mt-4 text-xs sm:text-[15px] leading-relaxed text-[#6e6d68] max-w-md font-sans">
          {ABOUT_ME_CONTENT.greeting} — {ABOUT_ME_CONTENT.role.toLowerCase()}. Crafting thoughtful interfaces, interactive 3D spaces, and modern web experiences.
        </p>

        {/* Dual Pill CTA Buttons */}
        <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 z-30">
          <button
            type="button"
            onClick={() => scrollToStudioStep(0)}
            className="inline-flex items-center gap-2.5 rounded-full bg-[#141413] text-white px-6 py-3 text-xs sm:text-[13px] font-sans font-medium shadow-[0_10px_25px_rgba(20,20,19,0.2)] hover:bg-[#2a2a28] hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span>Explore 3D Studio</span>
            <span className="text-sm leading-none">→</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToStudioStep(3)}
            className="inline-flex items-center gap-2.5 rounded-full bg-[#f7f6f3] hover:bg-[#efede8] text-[#141413] border border-black/[0.07] px-5 py-3 text-xs sm:text-[13px] font-sans font-medium shadow-sm active:scale-95 transition-all"
          >
            <span className="w-4 h-4 rounded-full bg-[#141413] text-white flex items-center justify-center text-[8px]">
              ▶
            </span>
            <span>Read Story</span>
          </button>
        </div>
      </div>

      {/* Centerpiece Stage: Curved Connector Lines, Floating Side Cards, Portrait & Orbiting Cards */}
      <div className="relative w-full max-w-[1360px] mx-auto flex-1 flex flex-col justify-end items-center -mt-4 sm:-mt-6">
        {/* Delicate Curved SVG Connector Arcs (Connecting Left & Right Floating Cards to the Orbit) */}
        <svg
          viewBox="0 0 1200 560"
          fill="none"
          aria-hidden="true"
          className="pointer-events-none hidden lg:block absolute inset-0 w-full h-full z-10"
        >
          {/* Left curved connector line */}
          <path
            d="M 190 210 C 190 365, 300 420, 415 390"
            stroke="#dcdad3"
            strokeWidth="1.25"
            fill="none"
          />
          {/* Right curved connector line */}
          <path
            d="M 1010 245 C 990 385, 885 430, 785 390"
            stroke="#dcdad3"
            strokeWidth="1.25"
            fill="none"
          />
        </svg>

        {/* Left Tilted Floating Feature Card */}
        <div
          onClick={() => scrollToStudioStep(3)}
          style={{ animation: 'floatSlowLeft 6s ease-in-out infinite' }}
          className="hidden lg:flex flex-col justify-between cursor-pointer absolute left-8 xl:left-14 top-6 z-20 w-[195px] p-5 rounded-[24px] bg-white border border-black/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)] transition-shadow"
        >
          {/* Audio/Waveform Icon Badge */}
          <div className="w-9 h-9 rounded-xl bg-[#f5f4f0] flex items-center justify-center text-[#141413] mb-3">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="12" x2="4" y2="12.01" />
              <line x1="8" y1="8" x2="8" y2="16" />
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="16" y1="9" x2="16" y2="15" />
              <line x1="20" y1="12" x2="20" y2="12.01" />
            </svg>
          </div>
          <h2 className="font-sans text-[14px] font-semibold leading-snug text-[#141413]">
            Turn vision into interactive reality.
          </h2>
          <p className="mt-1.5 font-sans text-[11px] leading-relaxed text-[#7c7b76]">
            Design, prototype, and engineer in one space.
          </p>
        </div>

        {/* Right Tilted Floating Feature Card */}
        <div
          onClick={() => scrollToStudioStep(6)}
          style={{ animation: 'floatSlowRight 6.5s ease-in-out infinite' }}
          className="hidden lg:flex flex-col justify-between cursor-pointer absolute right-8 xl:right-14 top-14 z-20 w-[200px] p-5 rounded-[24px] bg-white border border-black/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)] transition-shadow"
        >
          {/* Avatar Cluster + Plus Badge */}
          <div className="flex items-center -space-x-2 mb-3">
            <img
              src={heroPortraitUrl}
              alt="Benny R avatar"
              width={28}
              height={28}
              loading="lazy"
              decoding="async"
              className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="w-7 h-7 rounded-full bg-[#e4f7a1] text-[#365314] border-2 border-white flex items-center justify-center text-[9px] font-bold">
              UI
            </div>
            <div className="w-7 h-7 rounded-full bg-[#ddd6fe] text-[#5b21b6] border-2 border-white flex items-center justify-center text-[9px] font-bold">
              3D
            </div>
            <div className="w-7 h-7 rounded-full bg-[#f5f4f0] text-[#141413] border-2 border-white flex items-center justify-center text-xs font-medium">
              +
            </div>
          </div>
          <h2 className="font-sans text-[14px] font-semibold leading-snug text-[#141413]">
            Crafted for web, built for speed.
          </h2>
          <p className="mt-1.5 font-sans text-[11px] leading-relaxed text-[#7c7b76]">
            Seamless 3D &amp; frontend across all devices.
          </p>
        </div>

        {/* Bottom-Left Social Proof Stack */}
        <div className="hidden md:flex flex-col items-start absolute left-6 sm:left-12 bottom-10 z-20">
          <div className="w-5 h-[1.5px] bg-[#c8c6be] mb-3" />
          <p className="font-sans text-xs leading-snug text-[#6e6d68] max-w-[155px] text-left">
            Interactive 3D stations &amp; curated works inside.
          </p>
          <div className="mt-3 flex items-center -space-x-2">
            <img
              src={heroPortraitUrl}
              alt="Benny R profile"
              width={28}
              height={28}
              loading="lazy"
              decoding="async"
              className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="w-7 h-7 rounded-full bg-[#141413] text-[#f5d000] border-2 border-white flex items-center justify-center text-[9px] font-mono font-bold">
              BR
            </div>
            <div className="w-7 h-7 rounded-full bg-[#439d8e] text-white border-2 border-white flex items-center justify-center text-[9px] font-mono font-bold">
              01
            </div>
            <button
              type="button"
              onClick={() => scrollToStudioStep(0)}
              className="w-7 h-7 rounded-full bg-[#f4f3ef] text-[#141413] border-2 border-white flex items-center justify-center text-xs font-medium hover:bg-[#e5e4df] transition-colors"
              title="Enter Studio"
            >
              +
            </button>
          </div>
        </div>

        {/* Bottom-Right Minimalist Tagline */}
        <div className="hidden md:flex flex-col items-start absolute right-6 sm:right-12 bottom-10 z-20">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-4 h-[1px] bg-[#c8c6be]" />
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#141413]" fill="currentColor">
              <path d="M12 2L14.1 9.9L22 12L14.1 14.1L12 22L9.9 14.1L2 12L9.9 9.9L12 2Z" />
            </svg>
          </div>
          <p className="font-sans text-xs leading-snug text-[#6e6d68] text-left">
            Less noise.
            <br />
            <span className="text-[#141413] font-medium">More craft.</span>
          </p>
        </div>

        {/* Central Portrait + 3D Orbiting Cards Stage (Enlarged Portrait) */}
        <div
          className="relative w-full max-w-[960px] h-[440px] sm:h-[540px] md:h-[600px] lg:h-[640px] flex items-end justify-center overflow-visible"
          style={{ perspective: '1300px', transformStyle: 'preserve-3d' }}
        >
          {/* Subtle Ambient Halo Behind Head */}
          <div
            className="pointer-events-none absolute top-12 w-[420px] sm:w-[560px] h-[300px] rounded-full blur-3xl opacity-65"
            style={{
              background:
                'radial-gradient(circle, rgba(235, 232, 222, 0.95) 0%, rgba(255, 255, 255, 0) 72%)',
              transform: 'translateZ(-40px)',
            }}
          />

          {/* The Man Portrait (src/assets/hero-bg.jpg) — Enlarged, Priority LCP Image with Explicit Dimensions */}
          <div
            className="relative w-[460px] sm:w-[620px] md:w-[740px] lg:w-[820px] h-full flex items-end justify-center pointer-events-none select-none"
            style={{ transform: 'translateZ(0px)' }}
          >
            <img
              src={heroPortraitUrl}
              alt="Benny R — UI/UX Designer and Creative Developer"
              width={1100}
              height={821}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-contain object-bottom mix-blend-darken contrast-[1.04] scale-[1.12] sm:scale-[1.16] origin-bottom"
              draggable={false}
            />
          </div>

          {/* 3D Orbiting Cards Ring Around His Head */}
          <div
            className="absolute inset-x-0 top-[24%] sm:top-[23%] flex items-center justify-center pointer-events-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {ORBIT_CARDS.map((card, index) => {
              const duration = 24 // seconds for a full smooth revolution
              const delay = -(duration / ORBIT_CARDS.length) * index

              return (
                <div
                  key={card.id}
                  onClick={() => scrollToStudioStep(card.stepIndex)}
                  style={{
                    animation: `heroCardOrbit ${duration}s linear infinite`,
                    animationDelay: `${delay}s`,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, opacity',
                  }}
                  className="pointer-events-auto cursor-pointer absolute"
                >
                  {card.type === 'feature' ? (
                    /* Frosted Glass Feature Pill Card */
                    <div className="w-[165px] sm:w-[195px] px-4 py-3.5 rounded-[20px] bg-white/75 backdrop-blur-xl border border-white/90 shadow-[0_14px_34px_rgba(0,0,0,0.08)] hover:bg-white/95 transition-colors flex items-center gap-3 text-left">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
                        style={{
                          backgroundColor: card.badgeBg,
                          color: card.badgeColor,
                        }}
                      >
                        {card.icon === 'focus' && (
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                            <circle cx="12" cy="12" r="6" />
                          </svg>
                        )}
                        {card.icon === 'ideas' && (
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
                          </svg>
                        )}
                        {card.icon === 'plan' && (
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <circle cx="12" cy="12" r="8" />
                            <path d="M12 8v4l2.5 2.5" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-sans text-xs sm:text-[13px] font-semibold text-[#141413] leading-tight">
                          {card.title}
                        </div>
                        <div className="font-sans text-[10px] text-[#6e6d68] truncate mt-0.5">
                          {card.subtitle}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Monochrome Architectural Visual Card */
                    <div
                      className="w-[148px] sm:w-[178px] h-[88px] sm:h-[102px] rounded-[20px] p-3.5 flex flex-col justify-between text-left border border-white/60 shadow-[0_16px_36px_rgba(0,0,0,0.12)] overflow-hidden relative"
                      style={{ background: card.imageGradient }}
                    >
                      <div className="pointer-events-none absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/15 blur-sm" />
                      <div className="flex items-center justify-between relative z-10">
                        <span className="w-2 h-2 rounded-full bg-white/80" />
                        <span className="text-[9px] font-mono uppercase tracking-wider text-white/70">
                          3D VIEW
                        </span>
                      </div>
                      <div className="relative z-10">
                        <div className="font-sans text-xs font-semibold text-white leading-tight">
                          {card.title}
                        </div>
                        <div className="font-sans text-[9px] text-white/75 mt-0.5">
                          {card.subtitle}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

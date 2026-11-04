'use client'

import React, { useState, useEffect } from 'react'
import { ReasonItem, DEFAULT_CONTENT } from '@/lib/contentData'

const PHOTO_OPTIONS = [
  { value: '', label: 'Default / Sticker Fallback' },
  { value: '/api/photos/01', label: 'Photo 01: Pencil Portrait (Art)' },
  { value: '/api/photos/02', label: 'Photo 02: Teal Top Selfie (Front)' },
  { value: '/api/photos/03', label: 'Photo 03: Pink Wall, Red Dupatta' },
  { value: '/api/photos/04', label: 'Photo 04: White Shirt Portrait' },
  { value: '/api/photos/05', label: 'Photo 05: Peach Dupatta' },
  { value: '/api/photos/06', label: 'Photo 06: Dolphin Ring on Hand' },
  { value: '/api/photos/07', label: 'Photo 07: Sunset Rooftop Talk (Couple AI)' },
  { value: '/api/photos/08', label: 'Photo 08: Maroon Velvet + Silver Hoops' },
  { value: '/api/photos/09', label: 'Photo 09: Red Flower in Hair' },
  { value: '/api/photos/10', label: 'Photo 10: Pink Dupatta, Hand on Chin' },
  { value: '/api/photos/11', label: 'Photo 11: White Outfit Couple' },
  { value: '/api/photos/12', label: 'Photo 12: Hoop Earring Side Profile' },
  { value: '/api/photos/13', label: 'Photo 13: Soft Natural Close-up' },
  { value: '/api/photos/14', label: 'Photo 14: Lawyer in Sunlit Library (AI)' },
  { value: '/api/photos/15', label: 'Photo 15: Lawyer at Courthouse (AI)' },
  { value: '/api/photos/16', label: 'Photo 16: Red Scarf Eyes' },
  { value: '/api/photos/17', label: 'Photo 17: Eyes Panoramic Close-up' },
  { value: '/api/photos/18', label: 'Photo 18: Freedom Green Field (AI)' },
  { value: '/api/photos/19', label: 'Photo 19: Freedom Sunrise Sky & Birds (AI)' },
  { value: '/api/photos/20', label: 'Photo 20: Red Hijab & Mask' },
  { value: '/api/photos/21', label: 'Photo 21: Bubu & Dudu Sunset Talk Sticker Scene' },
  { value: '/api/photos/22', label: 'Photo 22: Royal Fantasy Couple' },
  { value: '/api/photos/23', label: 'Photo 23: Pastel Portrait with Flowers (AI)' },
  { value: '/api/photos/24', label: 'Photo 24: Bubu & Dudu Hug (AI)' },
  { value: '/api/photos/25', label: 'Photo 25: Aaj Ki Maria (5 Nov 2026)' },
]

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Admin form state
  const [newGateWord, setNewGateWord] = useState('')
  const [letterText, setLetterText] = useState('')
  const [finalMsg, setFinalMsg] = useState('')
  const [unlockNow, setUnlockNow] = useState(true)
  const [reasons, setReasons] = useState<ReasonItem[]>(DEFAULT_CONTENT.reasons)
  const [statusMsg, setStatusMsg] = useState('')
  const [loadingData, setLoadingData] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password: adminPassword }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setIsAuthenticated(true)
        loadAdminData()
      } else {
        setLoginError(data.error || 'Galat password')
      }
    } catch {
      setLoginError('Connection error')
    }
  }

  const loadAdminData = async () => {
    setLoadingData(true)
    try {
      const res = await fetch('/api/admin')
      if (res.ok) {
        const data = await res.json()
        if (data.letter) setLetterText(data.letter)
        if (data.finalMessage) setFinalMsg(data.finalMessage)
        if (data.unlockNow !== undefined) setUnlockNow(data.unlockNow)
        if (Array.isArray(data.reasons) && data.reasons.length > 0) {
          setReasons(data.reasons)
        }
      }
    } catch (err) {
      console.warn('Could not load admin data:', err)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSavePassword = async () => {
    if (!newGateWord) return
    setStatusMsg('Saving password...')
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'changeGatePassword',
          newGatePassword: newGateWord,
        }),
      })
      const data = await res.json()
      setStatusMsg(data.message || 'Saved!')
      setNewGateWord('')
    } catch {
      setStatusMsg('Error saving password')
    }
  }

  const handleSaveContent = async () => {
    setStatusMsg('Saving content...')
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateContent',
          letter: letterText || undefined,
          finalMessage: finalMsg || undefined,
          unlockNow,
        }),
      })
      const data = await res.json()
      setStatusMsg(data.message || 'Content updated!')
    } catch {
      setStatusMsg('Error saving content')
    }
  }

  const handleReasonChange = (index: number, field: 'text' | 'photoUrl', val: string) => {
    setReasons((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: val }
      return copy
    })
  }

  const handleSaveReasons = async () => {
    setStatusMsg('Saving 25 reasons & photos...')
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateReasons',
          reasons,
        }),
      })
      const data = await res.json()
      setStatusMsg(data.message || 'Reasons saved!')
    } catch {
      setStatusMsg('Error saving reasons')
    }
  }

  if (!isAuthenticated) {
    return (
      <div
        className="screen p-6"
        style={{ background: 'linear-gradient(160deg, #FFF8F5 0%, #F9D5DE 100%)' }}
      >
        <div className="w-full max-w-sm sticker p-6 bg-white shadow-xl flex flex-col gap-4">
          <div className="text-center">
            <span className="text-4xl">🔒</span>
            <h1
              className="text-2xl font-bold mt-2"
              style={{ fontFamily: 'var(--font-dancing)', color: 'var(--deep-rose)' }}
            >
              Admin Gate
            </h1>
            <p
              className="text-sm opacity-70"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              Birthday site control panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="Admin password..."
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="input-field text-base"
              autoFocus
            />
            {loginError && (
              <p className="text-xs text-rose-600 font-bold text-center">
                {loginError}
              </p>
            )}
            <button type="submit" className="btn-primary w-full">
              Unlock Panel 🛠️
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-[100dvh] p-4 sm:p-6 pb-20"
      style={{ background: '#FFF8F5' }}
    >
      <div className="w-full max-w-lg mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 border-rose-200">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-dancing)', color: 'var(--deep-rose)' }}
            >
              Site 1 Admin 🛠️
            </h1>
            <p
              className="text-xs opacity-75"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              Control gate, countdown, 25 reasons & photos
            </p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs text-rose-600 underline font-bold"
          >
            Logout
          </button>
        </div>

        {statusMsg && (
          <div className="sticker p-3 bg-rose-50 border-rose-300 text-center text-sm font-bold text-rose-700">
            {statusMsg}
          </div>
        )}

        {/* Section 1: Gate Secret Word */}
        <div className="sticker p-4 bg-white shadow-sm flex flex-col gap-3">
          <h2
            className="text-base font-bold text-rose-600"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            1. Secret Gate Password
          </h2>
          <p className="text-xs opacity-70">
            Naya secret word likhein (e.g. &quot;jaan&quot;, &quot;bubu&quot;):
          </p>
          <input
            type="text"
            placeholder="Naya secret word..."
            value={newGateWord}
            onChange={(e) => setNewGateWord(e.target.value)}
            className="input-field text-base py-2"
          />
          <button onClick={handleSavePassword} className="btn-primary py-2 text-sm">
            Save Gate Password
          </button>
        </div>

        {/* Section 2: Unlock Testing Toggle */}
        <div className="sticker p-4 bg-white shadow-sm flex flex-col gap-3">
          <h2
            className="text-base font-bold text-rose-600"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            2. Countdown Date Bypass
          </h2>
          <label className="flex items-center gap-3 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={unlockNow}
              onChange={(e) => setUnlockNow(e.target.checked)}
              className="w-5 h-5 accent-rose-500 rounded"
            />
            <span className="font-bold">
              Unlock Now (testing mode)
            </span>
          </label>
          <p className="text-xs opacity-60">
            Agar enabled hai, to 5 November se pehle bhi open hoga.
          </p>
        </div>

        {/* Section 3: Letter Editor */}
        <div className="sticker p-4 bg-white shadow-sm flex flex-col gap-3">
          <h2
            className="text-base font-bold text-rose-600"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            3. Letter Text
          </h2>
          <textarea
            rows={5}
            placeholder="Letter ka text yahan edit karein..."
            value={letterText}
            onChange={(e) => setLetterText(e.target.value)}
            className="input-field text-base py-2 font-body"
          />
        </div>

        {/* Section 4: Final Message */}
        <div className="sticker p-4 bg-white shadow-sm flex flex-col gap-3">
          <h2
            className="text-base font-bold text-rose-600"
            style={{ fontFamily: 'var(--font-baloo)' }}
          >
            4. Finale Screen Message
          </h2>
          <textarea
            rows={3}
            placeholder="Aakhri message..."
            value={finalMsg}
            onChange={(e) => setFinalMsg(e.target.value)}
            className="input-field text-base py-2 font-body"
          />
        </div>

        <button onClick={handleSaveContent} className="btn-primary w-full shadow-lg py-3">
          Save All Content Changes ✨
        </button>

        {/* Section 5: 25 Reasons & Photos Editor */}
        <div className="sticker p-4 bg-white shadow-sm flex flex-col gap-4 mt-2">
          <div className="flex items-center justify-between border-b pb-2 border-rose-100">
            <div>
              <h2
                className="text-base font-bold text-rose-600"
                style={{ fontFamily: 'var(--font-baloo)' }}
              >
                5. 25 Reasons & Photo Dropdowns
              </h2>
              <p className="text-xs opacity-70">
                Har card ka Roman Urdu text aur associated photo select karein:
              </p>
            </div>
            <button
              onClick={handleSaveReasons}
              className="btn-primary text-xs py-1.5 px-3"
            >
              Save Reasons 💾
            </button>
          </div>

          <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
            {reasons.map((r, idx) => (
              <div
                key={r.id || idx}
                className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-700" style={{ fontFamily: 'var(--font-baloo)' }}>
                    Card #{r.order || idx + 1}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    ID: {r.id || idx + 1}
                  </span>
                </div>

                <textarea
                  rows={2}
                  value={r.text}
                  onChange={(e) => handleReasonChange(idx, 'text', e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-rose-200 bg-white font-body"
                  placeholder="Reason text (Roman Urdu)..."
                />

                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-rose-600 shrink-0">
                    Photo:
                  </label>
                  <select
                    value={r.photoUrl || ''}
                    onChange={(e) => handleReasonChange(idx, 'photoUrl', e.target.value)}
                    className="w-full text-xs p-1.5 rounded-lg border border-rose-200 bg-white"
                  >
                    {PHOTO_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveReasons}
            className="btn-primary w-full shadow-md py-2.5 text-sm"
          >
            Save All 25 Reasons & Photos 💾✨
          </button>
        </div>
      </div>
    </div>
  )
}

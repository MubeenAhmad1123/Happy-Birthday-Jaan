'use client'

import React, { useState } from 'react'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Admin form state
  const [newGateWord, setNewGateWord] = useState('')
  const [letterText, setLetterText] = useState('')
  const [finalMsg, setFinalMsg] = useState('')
  const [unlockNow, setUnlockNow] = useState(true)
  const [statusMsg, setStatusMsg] = useState('')

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
      } else {
        setLoginError(data.error || 'Galat password')
      }
    } catch {
      setLoginError('Connection error')
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
      className="min-h-[100dvh] p-6 pb-16"
      style={{ background: '#FFF8F5' }}
    >
      <div className="w-full max-w-sm mx-auto flex flex-col gap-6">
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
              Control gate, content & testing
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
            Naya secret word likhein (e.g. "jaan", "bubu"):
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
      </div>
    </div>
  )
}

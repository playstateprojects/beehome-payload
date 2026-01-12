'use client'

import { Button, useDocumentInfo } from '@payloadcms/ui'
import { useState } from 'react'

export const LocalizeButton = () => {
  const { id } = useDocumentInfo()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [forceOverwrite, setForceOverwrite] = useState(false)

  // Get collection slug from URL
  const collectionSlug = typeof window !== 'undefined' ? window.location.pathname.split('/')[3] : null

  const handleLocalize = async () => {
    if (!id) {
      setMessage('No document ID found')
      return
    }

    if (!collectionSlug) {
      setMessage('No collection found')
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/${collectionSlug}/${id}/localize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ forceOverwrite }),
      })

      const result = (await response.json()) as {
        success: boolean
        message: string
        localesUpdated?: string[]
      }

      if (result.success) {
        setMessage(`✓ ${result.message}`)
        // Reload the page to show the new translations
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        setMessage(`✗ ${result.message}`)
      }
    } catch (error) {
      setMessage(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
        <Button onClick={handleLocalize} disabled={loading}>
          {loading ? 'Localizing...' : 'AI Localize'}
        </Button>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <input
            type="checkbox"
            checked={forceOverwrite}
            onChange={(e) => setForceOverwrite(e.target.checked)}
            disabled={loading}
          />
          Force overwrite existing translations
        </label>
      </div>
      {message && (
        <div
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: message.startsWith('✓') ? '#d4edda' : '#f8d7da',
            color: message.startsWith('✓') ? '#155724' : '#721c24',
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}
        >
          {message}
        </div>
      )}
    </div>
  )
}

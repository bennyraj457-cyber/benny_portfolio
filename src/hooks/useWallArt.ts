import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface WallArtData {
  imageUrl: string | null
  title: string
  isLoading: boolean
}

/**
 * Fetches active wall art image from Supabase 'wall_art' table or 'gallery' / 'artwork' bucket.
 * Falls back gracefully to the clean default artwork if offline or not configured.
 */
export function useWallArt(): WallArtData {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [title, setTitle] = useState<string>('Geometric Study')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    let isMounted = true

    async function fetchWallArt() {
      if (!isSupabaseConfigured || !supabase) {
        if (isMounted) setIsLoading(false)
        return
      }

      try {
        // 1. Try querying the 'wall_art' table for active artwork
        const { data, error } = await supabase
          .from('wall_art')
          .select('image_url, title, is_active')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)

        if (!error && data && data.length > 0 && data[0].image_url) {
          if (isMounted) {
            setImageUrl(data[0].image_url)
            if (data[0].title) setTitle(data[0].title)
            setIsLoading(false)
          }
          return
        }

        // 2. Alternatively check for an image in 'gallery' or 'artwork' storage bucket
        const { data: bucketFiles } = await supabase.storage.from('gallery').list('', {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' },
        })

        if (bucketFiles && bucketFiles.length > 0 && bucketFiles[0].name) {
          const { data: publicUrlData } = supabase.storage
            .from('gallery')
            .getPublicUrl(bucketFiles[0].name)

          if (publicUrlData?.publicUrl && isMounted) {
            setImageUrl(publicUrlData.publicUrl)
            setIsLoading(false)
            return
          }
        }
      } catch {
        // Fallback gracefully
      }

      if (isMounted) {
        setIsLoading(false)
      }
    }

    fetchWallArt()

    return () => {
      isMounted = false
    }
  }, [])

  return { imageUrl, title, isLoading }
}

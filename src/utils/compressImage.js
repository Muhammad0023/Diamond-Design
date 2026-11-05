// Shrinks and converts product photos to WebP before upload.
// Tweak these numbers to change the behavior:
const MAX_SIDE = 1500                 // longest side limit (never upscaled)
const MIN_SIDE = 500                  // Google Merchant minimum; never shrink below it
const QUALITIES = [0.82, 0.78, 0.75]  // start at 82, step down, never below 75
const TARGET_BYTES = 150 * 1024       // stop lowering quality once under this
const SKIP_WEBP_UNDER = 200 * 1024    // already-optimized WebP is uploaded as is

export async function compressImage(file) {
  try {
    if (typeof window === 'undefined' || !file?.type?.startsWith('image/')) return file
    // Leave animated or vector formats alone
    if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file

    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const { width, height } = bitmap

    // Already-optimized WebP: don't re-encode it
    if (
      file.type === 'image/webp' &&
      Math.max(width, height) <= MAX_SIDE &&
      file.size <= SKIP_WEBP_UNDER
    ) {
      bitmap.close()
      return file
    }

    // Never upscale, and never let the shorter side drop below MIN_SIDE
    let scale = Math.min(1, MAX_SIDE / Math.max(width, height))
    if (Math.min(width, height) * scale < MIN_SIDE) {
      scale = Math.min(1, MIN_SIDE / Math.min(width, height))
    }
    const w = Math.round(width * scale)
    const h = Math.round(height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close()

    // Try quality 82, then lower (down to 75) only if the file is still over target
    let blob = null
    for (const q of QUALITIES) {
      blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', q))
      if (!blob || blob.type !== 'image/webp') break
      if (blob.size <= TARGET_BYTES) break
    }

    // If WebP isn't supported or the result isn't smaller, keep the original
    if (!blob || blob.type !== 'image/webp' || blob.size >= file.size) return file

    const baseName = file.name.replace(/\.[^.]+$/, '')
    console.log(
      `Image compressed: ${file.name} ${Math.round(file.size / 1024)}KB (${width}x${height})` +
      ` -> ${Math.round(blob.size / 1024)}KB (${w}x${h})`
    )
    return new File([blob], `${baseName}.webp`, { type: 'image/webp' })
  } catch (err) {
    if (/hei[cf]/i.test(file?.type || '') || /\.hei[cf]$/i.test(file?.name || '')) {
      throw new Error('HEIC photos are not supported. Please convert to JPG or PNG first.')
    }
    console.warn('Image compression skipped:', err)
    return file
  }
}

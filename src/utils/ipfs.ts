import toast from 'react-hot-toast'

export interface UploadedFile {
  cid: string
  url: string
  name: string
  size: number
  type: string
}

/**
 * Upload file to Pinata IPFS
 */
export const uploadToIPFS = async (file: File): Promise<UploadedFile> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const pinataJWT = process.env.REACT_APP_PINATA_JWT
    if (!pinataJWT) {
      throw new Error('Pinata JWT not configured')
    }

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pinataJWT}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.reason || 'Upload failed')
    }

    const data = await response.json()
    const cid = data.IpfsHash
    const gateway = process.env.REACT_APP_PINATA_GATEWAY || 'gateway.pinata.cloud'
    const url = `https://${gateway}/ipfs/${cid}`

    return {
      cid,
      url,
      name: file.name,
      size: file.size,
      type: file.type,
    }
  } catch (err) {
    console.error('❌ IPFS upload failed:', err)
    throw new Error('Failed to upload file to IPFS')
  }
}

/**
 * Download file from IPFS (with CORS proxy)
 */
export const downloadFromIPFS = async (cid: string, filename: string): Promise<void> => {
  try {
    const gateway = process.env.REACT_APP_PINATA_GATEWAY || 'gateway.pinata.cloud'
    const url = `https://${gateway}/ipfs/${cid}`
    
    // Use CORS proxy for production
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`

    const response = await fetch(proxyUrl)
    if (!response.ok) throw new Error('Failed to fetch file')

    const blob = await response.blob()
    const downloadUrl = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(downloadUrl)

    toast.success(`Downloaded ${filename}`)
  } catch (err) {
    console.error('❌ Download failed:', err)
    toast.error('Failed to download file')
  }
}

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

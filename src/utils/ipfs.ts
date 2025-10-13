import axios from 'axios'
import toast from 'react-hot-toast'

const PINATA_JWT = process.env.REACT_APP_PINATA_JWT!
const PINATA_GATEWAY = process.env.REACT_APP_PINATA_GATEWAY || 'gateway.pinata.cloud'

export interface UploadedFile {
  cid: string
  url: string
  name: string
  size: number
  type: string
}

/**
 * Upload file to Pinata IPFS (proper method)
 */
export const uploadToIPFS = async (file: File): Promise<UploadedFile> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const metadata = JSON.stringify({
      name: file.name,
    })
    formData.append('pinataMetadata', metadata)

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
          'Content-Type': 'multipart/form-data',
        },
        maxBodyLength: Infinity,
      }
    )

    const cid = response.data.IpfsHash
    const url = `https://${PINATA_GATEWAY}/ipfs/${cid}`

    console.log('✅ Uploaded to IPFS:', cid)

    return {
      cid,
      url,
      name: file.name,
      size: file.size,
      type: file.type,
    }
  } catch (err: any) {
    console.error('❌ IPFS upload failed:', err.response?.data || err.message)
    throw new Error('Failed to upload file to IPFS')
  }
}

/**
 * Download file from IPFS (direct download)
 */
export const downloadFromIPFS = async (cid: string, filename: string): Promise<void> => {
  try {
    const url = `https://${PINATA_GATEWAY}/ipfs/${cid}`
    
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
    })

    if (!response.ok) throw new Error('Download failed')

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
    // Fallback: open in new tab
    const url = `https://${PINATA_GATEWAY}/ipfs/${cid}`
    window.open(url, '_blank')
    toast('Opening in new tab...', { icon: '🔗' })
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
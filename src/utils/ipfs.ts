import { PinataSDK } from 'pinata-web3'
import toast from 'react-hot-toast'

// Initialize Pinata
const pinata = new PinataSDK({
  pinataJwt: process.env.REACT_APP_PINATA_JWT,
  pinataGateway: process.env.REACT_APP_PINATA_GATEWAY,
})

export interface UploadedFile {
  cid: string
  url: string
  name: string
  size: number
  type: string
}

/**
 * Upload file to IPFS via Pinata
 */
export const uploadToIPFS = async (file: File): Promise<UploadedFile> => {
  try {
    console.log('📤 Uploading to IPFS:', file.name)

    // Upload to Pinata
    const upload = await pinata.upload.file(file)
    
    const cid = upload.IpfsHash
    const gateway = process.env.REACT_APP_PINATA_GATEWAY || 'gateway.pinata.cloud'
    const url = `https://${gateway}/ipfs/${cid}`

    console.log('✅ Uploaded to IPFS:', cid)

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
 * Download file from IPFS
 */
export const downloadFromIPFS = async (cid: string, filename: string): Promise<void> => {
  try {
    const gateway = process.env.REACT_APP_PINATA_GATEWAY || 'gateway.pinata.cloud'
    const url = `https://${gateway}/ipfs/${cid}`

    const response = await fetch(url)
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

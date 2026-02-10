'use client'

import React from "react"

import { useState, useRef, useEffect, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Loader2, X, Check } from 'lucide-react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface ImageUploadProps {
  label: string
  name: string
  currentImage?: string | null
  onChange: (url: string) => void
  onUploadingChange?: (uploading: boolean) => void
  required?: boolean
  circularCrop?: boolean
  aspectRatio?: number
}

export function ImageUpload({
  label,
  name,
  currentImage,
  onChange,
  onUploadingChange,
  required = false,
  circularCrop = false,
  aspectRatio,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [uploadedUrl, setUploadedUrl] = useState<string>(currentImage || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cropping state
  const [showCropDialog, setShowCropDialog] = useState(false)
  const [imageToCrop, setImageToCrop] = useState<string>('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  // Notify parent of uploading state changes
  useEffect(() => {
    onUploadingChange?.(uploading)
  }, [uploading, onUploadingChange])

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Read file for cropping
    const reader = new FileReader()
    reader.onloadend = () => {
      setImageToCrop(reader.result as string)
      setShowCropDialog(true)
    }
    reader.readAsDataURL(file)
  }

  const getCroppedImg = useCallback(
    (imageSrc: string, pixelCrop: any): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const image = document.createElement('img')
        image.src = imageSrc

        image.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            reject(new Error('No canvas context'))
            return
          }

          canvas.width = pixelCrop.width
          canvas.height = pixelCrop.height

          ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
          )

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Canvas to blob failed'))
            }
          }, 'image/jpeg')
        }

        image.onerror = () => {
          reject(new Error('Image load failed'))
        }
      })
    },
    []
  )

  const handleCropConfirm = async () => {
    if (!croppedAreaPixels || !imageToCrop) return

    setUploading(true)
    setShowCropDialog(false)

    try {
      // Crop the image
      const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels)

      // Create preview
      const previewUrl = URL.createObjectURL(croppedBlob)
      setPreview(previewUrl)

      // Upload to Vercel Blob
      const formData = new FormData()
      formData.append('file', croppedBlob, 'cropped-image.jpg')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setUploadedUrl(data.url)
      onChange(data.url)

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image. Please try again.')
      setPreview(currentImage || null)
    } finally {
      setUploading(false)
      // Reset crop state
      setImageToCrop('')
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedAreaPixels(null)
    }
  }

  const handleCropCancel = () => {
    setShowCropDialog(false)
    setImageToCrop('')
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCroppedAreaPixels(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setUploadedUrl('')
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>

        {preview ? (
          <div className={`relative w-full max-w-md overflow-hidden rounded-lg border ${circularCrop || aspectRatio === 1 ? 'aspect-square' : 'aspect-video'}`}>
            <Image
              src={preview || "/placeholder.svg"}
              alt="Preview"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              id={name}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              required={required && !uploadedUrl}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Image
                </>
              )}
            </Button>
          </div>
        )}

        <input type="hidden" name={name} value={uploadedUrl} />
        <p className="text-xs text-muted-foreground">
          Upload an image file. You'll be able to crop it before saving.
        </p>
      </div>

      {/* Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>

          <div className="relative h-[400px] w-full bg-muted">
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio ?? (circularCrop ? 1 : undefined)}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropShape={circularCrop ? 'round' : 'rect'}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCropCancel}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCropConfirm}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Apply & Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

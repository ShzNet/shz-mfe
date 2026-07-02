import * as React from 'react'
import { ImagePlus, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Skeleton } from '../skeleton'

type ImageUploaderSize = 'md' | 'lg' | 'xl'

const sizeClasses: Record<ImageUploaderSize, string> = {
  md: 'h-20 w-20',
  lg: 'h-28 w-28',
  xl: 'h-36 w-36',
}

const iconSizeClasses: Record<ImageUploaderSize, string> = {
  md: 'size-7',
  lg: 'size-9',
  xl: 'size-11',
}

interface ImageUploaderProps {
  previewUrl?: string | null
  uploading?: boolean
  disabled?: boolean
  size?: ImageUploaderSize
  accept?: string
  className?: string
  onUpload: (file: File) => void
  onClear?: () => void
}

export function ImageUploader({
  previewUrl,
  uploading,
  disabled,
  size = 'lg',
  accept = '.png,.svg,image/png,image/svg+xml',
  className,
  onUpload,
  onClear,
}: ImageUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [failed, setFailed] = React.useState(false)
  const isInactive = disabled || uploading

  React.useEffect(() => {
    setFailed(false)
  }, [previewUrl])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
    e.target.value = ''
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onClear?.()
  }

  return (
    <div
      role='button'
      tabIndex={isInactive ? -1 : 0}
      aria-disabled={isInactive}
      onClick={() => !isInactive && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (isInactive) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      className={cn(
        'group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border bg-muted transition-colors hover:border-primary aria-disabled:cursor-not-allowed aria-disabled:opacity-60',
        sizeClasses[size],
        className,
      )}
    >
      {uploading ? (
        <Skeleton className='h-full w-full' />
      ) : previewUrl && !failed ? (
        <>
          <img
            src={previewUrl}
            alt=''
            className='h-full w-full object-contain'
            onError={() => setFailed(true)}
          />
          <div className='absolute inset-0 hidden items-center justify-center bg-black/50 group-hover:flex'>
            <ImagePlus className={cn('text-white', iconSizeClasses[size])} />
          </div>
          {!disabled && onClear && (
            <button
              type='button'
              onClick={handleClear}
              className='absolute right-1 top-1 hidden rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80 group-hover:block'
            >
              <X className='size-3.5' />
            </button>
          )}
        </>
      ) : (
        <ImagePlus className={cn('text-muted-foreground group-hover:text-primary', iconSizeClasses[size])} />
      )}

      <input
        ref={inputRef}
        type='file'
        accept={accept}
        className='hidden'
        onChange={handleChange}
      />
    </div>
  )
}

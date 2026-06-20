import * as React from 'react'
import { Upload, FileText } from 'lucide-react'
import { cn } from '../../lib/utils'

interface FileUploaderProps {
  onFilesChange?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  className?: string
}

export function FileUploader({ onFilesChange, accept, multiple = true, className }: FileUploaderProps) {
  const [files, setFiles] = React.useState<File[]>([])

  function handleFiles(next: FileList | null) {
    if (!next) return
    const list = Array.from(next)
    setFiles(list)
    onFilesChange?.(list)
  }

  return (
    <div className={cn('space-y-3', className)}>
      <label className='flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 text-center hover:bg-muted/50'>
        <Upload className='mb-2 size-5 text-muted-foreground' />
        <p className='text-sm font-medium'>Click to upload</p>
        <p className='text-xs text-muted-foreground'>or drag and drop files</p>
        <input type='file' className='hidden' multiple={multiple} accept={accept} onChange={(e) => handleFiles(e.target.files)} />
      </label>
      {files.length > 0 && (
        <ul className='space-y-2'>
          {files.map((f) => (
            <li key={f.name} className='flex items-center gap-2 rounded border p-2 text-sm'>
              <FileText className='size-4 text-muted-foreground' />
              <span className='truncate'>{f.name}</span>
              <span className='ml-auto text-xs text-muted-foreground'>{Math.ceil(f.size / 1024)} KB</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

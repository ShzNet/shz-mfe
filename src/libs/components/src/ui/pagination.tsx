import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'
import { cn } from '../lib/utils'
import { buttonVariants } from './button'
import { type VariantProps } from 'class-variance-authority'
import { useComponentsLocale } from '../i18n/components-locale'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  const { pagination: messages } = useComponentsLocale()
  return (
    <nav
      role='navigation'
      aria-label={messages.navigationLabel}
      data-slot='pagination'
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot='pagination-content'
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot='pagination-item' {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<VariantProps<typeof buttonVariants>, 'size'> &
  React.ComponentProps<'a'>

function PaginationLink({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      data-slot='pagination-link'
      data-active={isActive}
      className={cn(
        buttonVariants({ variant: isActive ? 'outline' : 'ghost', size }),
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  const { pagination: messages } = useComponentsLocale()
  return (
    <PaginationLink
      aria-label={messages.goToPreviousPage}
      size='default'
      className={cn('gap-1 pl-2.5', className)}
      {...props}
    >
      <ChevronLeftIcon className='size-4' />
      <span>{messages.previous}</span>
    </PaginationLink>
  )
}

function PaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  const { pagination: messages } = useComponentsLocale()
  return (
    <PaginationLink
      aria-label={messages.goToNextPage}
      size='default'
      className={cn('gap-1 pr-2.5', className)}
      {...props}
    >
      <span>{messages.next}</span>
      <ChevronRightIcon className='size-4' />
    </PaginationLink>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  const { pagination: messages } = useComponentsLocale()
  return (
    <span
      aria-hidden
      data-slot='pagination-ellipsis'
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className='size-4' />
      <span className='sr-only'>{messages.morePages}</span>
    </span>
  )
}

export {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
}

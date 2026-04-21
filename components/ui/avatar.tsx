"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

interface AvatarSharedProps {
  size?: number // custom size in pixels
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & AvatarSharedProps
>(({ className, size = 40, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative inline-flex shrink-0 overflow-hidden rounded-full",
      className
    )}
    style={{
      width: size,
      height: size,
    }}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & AvatarSharedProps
>(({ className, size = 40, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square object-cover", className)}
    style={{
      width: size,
      height: size,
    }}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  name?: string
  size?: number
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, name = "", size = 40, ...props }, ref) => {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  const stringToColor = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const color = Math.floor(Math.abs(Math.sin(hash) * 16777215) % 16777215).toString(16)
    return `#${color.padStart(6, "0")}`
  }

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex items-center justify-center font-medium text-white",
        className
      )}
      style={{
        backgroundColor: stringToColor(name),
        width: size,
        height: size,
        fontSize: size * 0.4,
        borderRadius: "9999px",
      }}
      {...props}
    >
      {getInitials(name)}
    </AvatarPrimitive.Fallback>
  )
})
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }

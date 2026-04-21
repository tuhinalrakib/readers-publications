"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Search, ShoppingCart, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MainNav() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-2 font-bold">
                Readers Publications
              </Link>
              <Link href="/books" className="text-muted-foreground transition-colors hover:text-foreground">
                Books
              </Link>
              <Link href="/journals" className="text-muted-foreground transition-colors hover:text-foreground">
                Journals
              </Link>
              <Link href="/educational" className="text-muted-foreground transition-colors hover:text-foreground">
                Educational
              </Link>
              <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                About Us
              </Link>
              <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
                Contact
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">Readers Publications</span>
        </Link>
        <nav className="hidden md:flex md:gap-6 lg:gap-10">
          <Link href="/books" className="text-sm font-medium transition-colors hover:text-foreground/80">
            Books
          </Link>
          <Link href="/journals" className="text-sm font-medium transition-colors hover:text-foreground/80">
            Journals
          </Link>
          <Link href="/educational" className="text-sm font-medium transition-colors hover:text-foreground/80">
            Educational
          </Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-foreground/80">
            About Us
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-foreground/80">
            Contact
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {isSearchOpen ? (
            <div className="relative flex w-full max-w-sm items-center md:w-auto">
              <Input
                type="search"
                placeholder="Search..."
                className="pr-10"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

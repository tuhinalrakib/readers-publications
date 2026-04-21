import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function NewsletterSignup() {
  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-2">
        <CardHeader className="space-y-5 bg-slate-900 p-8 text-white md:p-10">
          <CardTitle className="text-3xl font-bold">Stay Updated</CardTitle>
          <CardDescription className="text-slate-300">
            Subscribe to our newsletter to receive updates on new releases, exclusive offers, and literary events.
          </CardDescription>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600">
                <CheckIcon className="h-4 w-4 text-white" />
              </div>
              <span>New release notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600">
                <CheckIcon className="h-4 w-4 text-white" />
              </div>
              <span>Exclusive subscriber discounts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600">
                <CheckIcon className="h-4 w-4 text-white" />
              </div>
              <span>Author interviews and features</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col justify-center p-8 md:p-10">
          <form className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Full Name
              </label>
              <Input id="name" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email
              </label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="interests"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Interests
              </label>
              <select
                id="interests"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select your interests</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="educational">Educational</option>
                <option value="children">Children's Books</option>
                <option value="academic">Academic</option>
              </select>
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
              Subscribe
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </div>
    </Card>
  )
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

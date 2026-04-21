import type { Metadata } from "next"
import { Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export const metadata: Metadata = {
  title: "Contact Us | Readers Publications",
  description: "Get in touch with Readers Publications for inquiries, feedback, or support.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Contact Us</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Have questions, feedback, or need assistance? We're here to help. Reach out to us using any of the methods
            below.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-red-600" />
                Call Us
              </CardTitle>
              <CardDescription>Our support team is available Monday-Friday, 9am-5pm EST.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">Main Office: (555) 123-4567</p>
              <p className="font-medium">Customer Support: (555) 987-6543</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-red-600" />
                Email Us
              </CardTitle>
              <CardDescription>We aim to respond to all inquiries within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">General Inquiries: info@Readerspubs.com</p>
              <p className="font-medium">Customer Support: support@Readerspubs.com</p>
              <p className="font-medium">Submissions: submissions@Readerspubs.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-600" />
                Visit Us
              </CardTitle>
              <CardDescription>Our headquarters and main offices are located in Boston.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">
                123 Publishing Lane
                <br />
                Boston, MA 02108
                <br />
                United States
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Enter your last name" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input id="phone" placeholder="Enter your phone number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Enter the subject of your message" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Enter your message here" className="min-h-[150px] resize-y" />
                </div>
                <div>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    Send Message
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <Card>
            <CardContent className="p-0">
              <div className="aspect-[16/9] w-full overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.8442639328655!2d-71.06170492346177!3d42.35977413417336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e370868bc2ce7b%3A0x82fa7db94f5fea9e!2sBoston%2C%20MA%2C%20USA!5e0!3m2!1sen!2sca!4v1683890283106!5m2!1sen!2sca"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Sample data
const faqs = [
  {
    question: "How can I submit a manuscript for consideration?",
    answer:
      "You can submit your manuscript by emailing submissions@Readerspubs.com with your complete manuscript, a synopsis, and your author bio. Our editorial team reviews all submissions and will contact you if interested.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can view shipping options during checkout.",
  },
  {
    question: "How can I request a review copy of a book?",
    answer:
      "Review copies are available for educators, librarians, and media professionals. Please email reviews@Readerspubs.com with your request, including your credentials and the title you're interested in.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of purchase for items in original condition. Please contact customer service to initiate a return and receive a return authorization number.",
  },
]

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/1iORZIaujx6
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <section className="w-full pt-12 md:pt-24 lg:pt-32">
        <div className="container space-y-10 xl:space-y-16">
          <div className="grid gap-4 px-10 md:grid-cols-2 md:gap-4">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
                Optimize Your Operations with Automated SOP Management
              </h1>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Streamline your workflows, ensure compliance, and drive efficiency with our comprehensive SOP management
                platform.
              </p>
              <div className="space-x-4">
                <Link
                  href="/sign-in"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
          <img
            src="/placeholder.svg"
            width="1270"
            height="550"
            alt="Hero"
            className="mx-auto aspect-[2.3/1] overflow-hidden rounded-t-xl object-cover"
          />
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container space-y-12 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Streamline Your SOP Management</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform provides a comprehensive solution for managing your standard operating procedures (SOPs),
                ensuring consistency, compliance, and efficiency across your organization.
              </p>
            </div>
          </div>
          <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Assessment Framework</h3>
              <p className="text-sm text-muted-foreground">
                Define your SOP quality parameters and assess your existing procedures to identify areas for
                improvement.
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Automated Evaluation</h3>
              <p className="text-sm text-muted-foreground">
                Our platform automatically evaluates your SOPs against your defined quality criteria, ensuring
                consistency and compliance.
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Collaborative Workflows</h3>
              <p className="text-sm text-muted-foreground">
                Streamline the creation, review, and approval of your SOPs with our intuitive collaborative tools.
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Version Control</h3>
              <p className="text-sm text-muted-foreground">
                Maintain a comprehensive history of your SOPs, track changes, and ensure your team is always working
                with the latest version.
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Reporting and Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Gain valuable insights into your SOP management with our robust reporting and analytics capabilities.
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Compliance Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                Continuously monitor your SOPs to ensure they meet regulatory requirements and industry standards.
              </p>
            </div>
          </div>
          <div className="flex justify-center flex-col sm:flex-row items-start gap-4">
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 SOP Management Platform. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

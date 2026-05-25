export function SiteFooter() {
  return (
    <footer className="border-t py-6 sm:py-8 text-center text-sm text-muted-foreground bg-background" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-left">
            <span className="font-semibold text-foreground">PagePilot DZ</span> — AI-Powered Social Media Audits for Algerian Businesses.
          </p>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} PagePilot DZ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}


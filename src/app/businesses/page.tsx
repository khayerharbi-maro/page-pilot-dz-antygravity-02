import Link from "next/link";
import { Plus, Building2, MapPin, Store, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { getBusinessesAction } from "@/lib/actions/businesses";
import { Badge } from "@/components/ui/badge";

export default async function BusinessesPage() {
  const businesses = await getBusinessesAction();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Businesses</h1>
          <p className="text-sm text-muted-foreground font-medium">
            Manage your brand profiles, track product catalogs, and coordinate local marketing audits.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium cursor-pointer">
          <Link href="/businesses/new" className="flex items-center gap-1.5">
            <Plus className="size-4" />
            Add Business
          </Link>
        </Button>
      </div>

      {businesses.length === 0 ? (
        /* Premium Empty State */
        <div className="max-w-md w-full mx-auto text-center space-y-6 border p-8 rounded-lg bg-card shadow-xs py-16 backdrop-blur-sm bg-card/60">
          <div className="size-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Store className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">No Businesses Yet</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create your first localized brand profile to start auditing performance, tracking products, and designing native social schedules.
            </p>
          </div>
          <div className="pt-2">
            <Button asChild size="lg" className="w-full sm:w-auto h-11 px-8 cursor-pointer">
              <Link href="/businesses/new" className="flex items-center gap-1.5">
                Create First Business
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        /* Listing Grid with hover scaling */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {businesses.map((business) => (
            <Card 
              key={business.id} 
              className="border shadow-xs backdrop-blur-sm bg-card/60 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
                        <Building2 className="size-4" />
                      </div>
                      <CardTitle className="text-xl font-bold tracking-tight">{business.name}</CardTitle>
                    </div>
                    <div className="pt-1.5 flex items-center gap-1">
                      <Badge variant="secondary" className="font-semibold text-[10px]">
                        {business.category === "Other" && business.customNiche ? business.customNiche : business.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-accent/40 px-2.5 py-1 rounded-md border">
                    <MapPin className="size-3.5 text-primary" />
                    <span>{business.wilaya.split(" - ")[1] || business.wilaya}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-6">
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {business.description}
                </p>
              </CardContent>
              
              <CardFooter className="border-t pt-4 flex items-center justify-between bg-accent/15 rounded-b-lg">
                <span className="text-xs text-muted-foreground font-medium">
                  Created {new Date(business.createdAt).toLocaleDateString()}
                </span>
                
                <Button asChild size="sm" variant="ghost" className="gap-1 hover:text-primary cursor-pointer">
                  <Link href={`/businesses/${business.id}`}>
                    Enter Workspace
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

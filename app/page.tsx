import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default async function Home() {


  return (
    <div className="flex flex-col items-center gap-2">
      <Card>
        <CardHeader>
        <Label style={{fontSize: "32px"}}>Welcome!</Label>
        </CardHeader>
        <CardContent>
        <Button>
        <a href="/app">Go to the App</a>

        </Button>

        </CardContent>
      </Card>
      </div>
      
  )
}


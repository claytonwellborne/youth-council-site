import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
export default function Releases(){
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Research & Policy Releases</h2>
      <Card>
        <CardHeader><CardTitle>Coming soon</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-gray-700">This is a placeholder for your publications, press, and policy work. We’ll add create/edit later.</p>
          <Button>Create First Release</Button>
        </CardContent>
      </Card>
    </div>
  );
}

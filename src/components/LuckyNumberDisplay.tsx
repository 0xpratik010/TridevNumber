import { Button } from "@/components/ui/button";
import { DisplayPanel } from "./DisplayPanel";

interface LuckyNumberDisplayProps {
  onViewPast: () => void;
}

export const LuckyNumberDisplay = ({ onViewPast }: LuckyNumberDisplayProps) => {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center p-4 space-y-8">
      <DisplayPanel dnflag={0} title="Trideo Day" timeRange="Morning 11:00 am - 12:00 pm" />
      <DisplayPanel dnflag={1} title="Trideo Night" timeRange="Evening 7:00 pm - 8:00 pm" />

      {/* View Past Numbers Button */}
      <Button
        onClick={onViewPast}
        variant="outline"
        size="lg"
        className="w-full max-w-md border-golden/30 hover:bg-golden/10 hover:border-golden/50 text-foreground"
      >
        View Past Numbers
      </Button>
    </div>
  );
};
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LuckyNumberFormProps {
  formData: {
    date: string;
    number: string;
    revealTime: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isEditing: boolean;
}

export default function LuckyNumberForm({
  formData,
  setFormData,
  handleSubmit,
  isLoading,
  isEditing,
}: LuckyNumberFormProps) {
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 7);
    setFormData((prev) => ({ ...prev, number: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, date: e.target.value }))}
          className="bg-muted/30 border-border/50"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="number">Lucky Number</Label>
        <Input
          id="number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formData.number.toString()}
          onChange={handleNumberChange}
          placeholder="Enter lucky number"
          maxLength={7}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="revealTime">Reveal Time</Label>
        <Input
          id="revealTime"
          type="time"
          value={formData.revealTime}
          onChange={(e) => setFormData((prev: any) => ({ ...prev, revealTime: e.target.value }))}
          className="bg-muted/30 border-border/50"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-golden hover:shadow-golden transition-all duration-300"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
            {isEditing ? "Updating..." : "Saving..."}
          </>
        ) : isEditing ? (
          "Update Number"
        ) : (
          "Add Number"
        )}
      </Button>
    </form>
  );
}
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { ArrowLeft, Calendar, TrendingUp, Loader2 } from "lucide-react";
import CenteredNumberDisplay from "./CenteredNumberDisplay";
import { getPastNumbers, LuckyNumber, parseLocalDate } from "@/lib/api";

interface PastNumbersProps {
  onBack: () => void;
}

interface WeeklyNumbers {
  weekLabel: string;
  numbers: (LuckyNumber | null)[]; // Array will always have 7 elements for 7 days
}

export const PastNumbers = ({ onBack }: PastNumbersProps) => {
  const [dnflagFilter, setDnflagFilter] = useState("0"); // 0 for Day, 1 for Night
  const [dateFilter, setDateFilter] = useState<"all" | "week" | "month">("all");
  const [weeklyNumbers, setWeeklyNumbers] = useState<WeeklyNumbers[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNumbers = async () => {
      setIsLoading(true);
      const data = await getPastNumbers(parseInt(dnflagFilter, 10), dateFilter);
      
      const groupedByWeek = data.reduce((acc, number) => { // Group fetched numbers by week
        const date = parseLocalDate(number.date);
        const day = date.getDay(); // Sunday - 0, Saturday - 6
        const weekStartDate = new Date(date);
        weekStartDate.setDate(date.getDate() - day);
        const weekKey = weekStartDate.toLocaleDateString('en-CA'); // YYYY-MM-DD for the start of the week

        if (!acc[weekKey]) {
          acc[weekKey] = [];
        }
        acc[weekKey].push(number);
        return acc;
      }, {} as Record<string, LuckyNumber[]>); // Key: week start date, Value: array of numbers in that week

      const formattedWeeks: WeeklyNumbers[] = Object.entries(groupedByWeek).map(([weekKey, numbers]) => {
        const startOfWeek = parseLocalDate(weekKey);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const weekLabel = `${startOfWeek.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
        
        // Create a 7-element array for the week, with null placeholders
        const weekWithPlaceholders: (LuckyNumber | null)[] = Array(7).fill(null);
        numbers.forEach(num => {
          const dayOfWeek = parseLocalDate(num.date).getDay(); // Sunday - 0, Saturday - 6
          weekWithPlaceholders[dayOfWeek] = num;
        });

        return {
          weekLabel,
          numbers: weekWithPlaceholders,
        };
      });

      setWeeklyNumbers(formattedWeeks.sort((a, b) => new Date(b.weekLabel.split(' - ')[0].split('/').reverse().join('-')).getTime() - new Date(a.weekLabel.split(' - ')[0].split('/').reverse().join('-')).getTime()));
      setIsLoading(false);
    };

    fetchNumbers();
  }, [dnflagFilter, dateFilter]);

  const handleFilterChange = (value: string) => {
    setDnflagFilter(value);
  };

  const handleDateFilterChange = (value: "all" | "week" | "month") => {
    setDateFilter(value);
  }

  const formatDate = (dateString: string) => {
    const date = parseLocalDate(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 md:p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-golden/30 hover:bg-golden/10 hover:border-golden/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Calendar className="w-8 h-8 text-golden" />
              Panel
            </h1>
          </div>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>

        {/* Filter Controls */}
        <Card className="bg-gradient-card border-border/50 backdrop-blur-sm shadow-elegant">
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-mystical" />
                <span className="font-medium text-foreground">Filter by:</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <Select value={dnflagFilter} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-40 bg-muted/30 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/50">
                    <SelectItem value="0">Day</SelectItem>
                    <SelectItem value="1">Night</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={handleDateFilterChange}>
                  <SelectTrigger className="w-40 bg-muted/30 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/50">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Weekly Numbers Display */}
        {isLoading ? (
          <Card className="bg-gradient-card border-border/50 backdrop-blur-sm shadow-elegant flex items-center justify-center h-48">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-mystical" />
          </Card>
        ) : (
          weeklyNumbers.length === 0 ? (
            <Card className="bg-gradient-card border-border/50 backdrop-blur-sm shadow-elegant flex items-center justify-center h-48">
              <p className="text-muted-foreground">No past numbers found for this filter.</p>
            </Card>
          ) : (
          <div className="space-y-4">
            {weeklyNumbers.map((week) => (
              <Card key={week.weekLabel} className="bg-gradient-card border-border/50 backdrop-blur-sm shadow-elegant">
                <div className="p-4 flex flex-col lg:flex-row items-center gap-4">
                  <div className="w-full lg:w-auto text-center lg:text-left mb-4 lg:mb-0">
                    <p className="font-semibold text-foreground">{week.weekLabel}</p>
                    <p className="text-xs text-muted-foreground">Week View</p>
                  </div>
                  <div className="w-full grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {week.numbers.map((entry, index) =>
                    entry ? (
                      <div key={entry.id} className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <CenteredNumberDisplay value={entry.number} size="small" />
                          <p className="text-xs text-muted-foreground hidden sm:block">{formatDate(entry.date)}</p>
                        </div>
                      </div>
                    ) : (
                      <div key={`placeholder-${week.weekLabel}-${index}`} className={cn("text-center", index > 3 && "hidden sm:block")}>
                        <div className="w-full aspect-[4/3] flex items-center justify-center bg-muted/10 rounded-2xl border border-dashed border-border/20" />
                        <p className="text-xs text-muted-foreground mt-1 opacity-0">-</p> {/* For alignment */}
                      </div>
                    )
                  )}
                </div>

                </div>
              </Card>
            ))}
          </div>
          )
        )}
      </div>
    </div>
  );
};
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, TrendingUp, Loader2 } from "lucide-react";
import { getPastNumbers, LuckyNumber, parseLocalDate } from "@/lib/api";

interface PastNumbersProps {
  onBack: () => void;
}

export const PastNumbers = ({ onBack }: PastNumbersProps) => {
  const [filter, setFilter] = useState("week");
  const [filteredNumbers, setFilteredNumbers] = useState<LuckyNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNumbers = async () => {
      setIsLoading(true);
      const data = await getPastNumbers(filter);
      setFilteredNumbers(data);
      setIsLoading(false);
    };

    fetchNumbers();
  }, [filter]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const formatDate = (dateString: string) => {
    const date = parseLocalDate(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-4xl mx-auto space-y-6">
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
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-8 h-8 text-golden" />
              Past Lucky Numbers
            </h1>
          </div>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>

        {/* Filter Controls */}
        <Card className="bg-gradient-card border-border/50 backdrop-blur-sm shadow-elegant">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-mystical" />
                <span className="font-medium text-foreground">Filter by:</span>
              </div>
              <Select value={filter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-48 bg-muted/30 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50">
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Numbers Table */}
        <Card className="bg-gradient-card border-border/50 backdrop-blur-sm shadow-elegant">
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-muted/20">
                  <TableHead className="text-foreground font-semibold">Date</TableHead>
                  <TableHead className="text-foreground font-semibold">Lucky Number</TableHead>
                  <TableHead className="text-foreground font-semibold">Reveal Time</TableHead>
                </TableRow>
              </TableHeader>
              {isLoading ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-mystical" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {filteredNumbers.map((entry) => (
                    <TableRow
                      key={entry.id}
                      className="border-border/20 hover:bg-muted/10 transition-colors"
                    >
                      <TableCell className="text-muted-foreground">
                        {formatDate(entry.date)}
                      </TableCell>
                      <TableCell>
                        <span className="text-2xl font-bold text-golden bg-gradient-golden bg-clip-text text-transparent">
                          {entry.number}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono">
                        {entry.revealTime}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};
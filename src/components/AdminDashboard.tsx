import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Calendar,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getAllNumbers,
  addLuckyNumber,
  updateLuckyNumber,
  deleteLuckyNumber,
  LuckyNumber,
  getLocalDateString,
  parseLocalDate,
} from "@/lib/api";
import LuckyNumberForm from "./LuckyNumberForm";

interface AdminDashboardProps {
  onLogout: () => void;
}

const getInitialFormState = () => ({
  date: getLocalDateString(new Date()),
  number: "",
  revealTime: "14:00",
  dnflag: 0,
});

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [numbers, setNumbers] = useState<LuckyNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNumber, setEditingNumber] = useState<LuckyNumber | null>(null);
  const [formData, setFormData] = useState(getInitialFormState());
  const { toast } = useToast();

  const fetchNumbers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllNumbers();
      setNumbers(data);
    } catch (err) {
      toast({ title: "Failed to fetch", description: "Could not load numbers" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNumbers();
  }, []);

  const sanitizeNumber = (raw: string) => {
    // remove non-digits, limit to 3 characters
    return raw.replace(/\D/g, "").slice(0, 3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numeric = parseInt(formData.number, 10);
    if (Number.isNaN(numeric) || numeric < 1) {
      toast({
        title: "Invalid number",
        description: "Please enter a valid numeric lucky number (1 - 999).",
      });
      return;
    }

    try {
      setIsLoading(true);
      if (editingNumber) {
        await updateLuckyNumber(editingNumber.id, {
          ...formData,
          // number: numeric,
        });
        toast({
          title: "Number Updated",
          description: "Lucky number has been updated successfully",
        });
        setEditingNumber(null);
      } else {
        await addLuckyNumber({
          ...formData,
          // number: numeric,
        });
        toast({
          title: "Number Added",
          description: "New lucky number has been added successfully",
        });
        setIsAddDialogOpen(false);
      }
      setFormData(getInitialFormState());
      await fetchNumbers();
    } catch (err) {
      toast({
        title: "Save failed",
        description: "Could not save lucky number. Try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (number: LuckyNumber) => {
    setEditingNumber(number);
    setFormData({
      date: number.date,
      number: number.number.toString(),
      revealTime: number.revealTime,
      dnflag: number.dnflag,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLuckyNumber(id);
      toast({
        title: "Number Deleted",
        description: "Lucky number has been deleted successfully",
      });
      await fetchNumbers();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: "Could not delete the number. Try again.",
      });
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-golden" />
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-destructive/50 hover:bg-destructive/10 text-destructive hover:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Add Number Button */}
        <div className="flex justify-end">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-mystical hover:shadow-mystical transition-all duration-300">
                <Plus className="mr-2 h-4 w-4" />
                Add Lucky Number
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border/50">
              <DialogHeader>
                <DialogTitle className="text-foreground">Add New Lucky Number</DialogTitle>
              </DialogHeader>
              <LuckyNumberForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                isEditing={false}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Numbers Table */}
        <Card className="bg-gradient-card border-border/50 backdrop-blur-sm shadow-elegant">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-mystical" />
              <h2 className="text-xl font-semibold text-foreground">Manage Lucky Numbers</h2>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-muted/20">
                  <TableHead className="text-foreground font-semibold">Date</TableHead>
                  <TableHead className="text-foreground font-semibold">Lucky Number</TableHead>
                  <TableHead className="text-foreground font-semibold">Reveal Time</TableHead>
                  <TableHead className="text-foreground font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              {isLoading ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-mystical" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {numbers.map((entry) => (
                    <TableRow
                      key={entry.id}
                      className="border-border/20 hover:bg-muted/10 transition-colors"
                    >
                      <TableCell className="text-muted-foreground">
                        {
                          // Using parseLocalDate avoids timezone issues where `new Date(YYYY-MM-DD)`
                          // is parsed as UTC and can result in the previous day.
                          parseLocalDate(entry.date).toLocaleDateString()
                        }
                      </TableCell>
                      <TableCell>
                        <span className="text-2xl font-bold text-golden bg-gradient-golden bg-clip-text text-transparent">
                          {entry.number}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono">
                        {entry.revealTime}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEdit(entry)}
                            variant="outline"
                            size="sm"
                            className="border-mystical/30 hover:bg-mystical/10 text-mystical hover:text-mystical"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(entry.id)}
                            variant="outline"
                            size="sm"
                            className="border-destructive/30 hover:bg-destructive/10 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
        </Card>

        {/* Edit Dialog */}
        <Dialog
          open={!!editingNumber}
          onOpenChange={(open) => {
            if (!open) setEditingNumber(null);
          }}
        >
          <DialogContent className="bg-card border-border/50">
            <DialogHeader>
              <DialogTitle className="text-foreground">Edit Lucky Number</DialogTitle>
            </DialogHeader>
            <LuckyNumberForm
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              isEditing={true}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
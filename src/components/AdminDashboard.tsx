import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Plus, Edit, Trash2, LogOut, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardProps {
  onLogout: () => void;
}

// Mock data - replace with real API calls
const mockNumbers = [
  { id: 1, date: "2024-01-07", number: 777, revealTime: "14:00" },
  { id: 2, date: "2024-01-06", number: 342, revealTime: "14:00" },
  { id: 3, date: "2024-01-05", number: 891, revealTime: "14:00" },
];

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [numbers, setNumbers] = useState(mockNumbers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNumber, setEditingNumber] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    number: "",
    revealTime: "14:00"
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNumber) {
      // Update existing number
      setNumbers(prev => prev.map(num => 
        num.id === editingNumber.id 
          ? { ...num, ...formData, number: parseInt(formData.number) }
          : num
      ));
      toast({
        title: "Number Updated",
        description: "Lucky number has been updated successfully",
      });
      setEditingNumber(null);
    } else {
      // Add new number
      const newNumber = {
        id: Date.now(),
        ...formData,
        number: parseInt(formData.number)
      };
      setNumbers(prev => [newNumber, ...prev]);
      toast({
        title: "Number Added",
        description: "New lucky number has been added successfully",
      });
      setIsAddDialogOpen(false);
    }
    
    setFormData({ date: new Date().toISOString().split('T')[0], number: "", revealTime: "14:00" });
  };

  const handleEdit = (number: any) => {
    setEditingNumber(number);
    setFormData({
      date: number.date,
      number: number.number.toString(),
      revealTime: number.revealTime
    });
  };

  const handleDelete = (id: number) => {
    setNumbers(prev => prev.filter(num => num.id !== id));
    toast({
      title: "Number Deleted",
      description: "Lucky number has been deleted successfully",
    });
  };

  const NumberForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          className="bg-muted/30 border-border/50"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="number">Lucky Number</Label>
        <Input
          id="number"
          type="number"
          value={formData.number}
          onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
          className="bg-muted/30 border-border/50"
          placeholder="Enter lucky number"
          min="1"
          max="999"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="revealTime">Reveal Time</Label>
        <Input
          id="revealTime"
          type="time"
          value={formData.revealTime}
          onChange={(e) => setFormData(prev => ({ ...prev, revealTime: e.target.value }))}
          className="bg-muted/30 border-border/50"
          required
        />
      </div>
      
      <Button
        type="submit"
        className="w-full bg-gradient-golden hover:shadow-golden transition-all duration-300"
      >
        {editingNumber ? "Update Number" : "Add Number"}
      </Button>
    </form>
  );

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
              <NumberForm />
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
              <TableBody>
                {numbers.map((entry) => (
                  <TableRow
                    key={entry.id}
                    className="border-border/20 hover:bg-muted/10 transition-colors"
                  >
                    <TableCell className="text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString()}
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
            </Table>
          </div>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingNumber} onOpenChange={() => setEditingNumber(null)}>
          <DialogContent className="bg-card border-border/50">
            <DialogHeader>
              <DialogTitle className="text-foreground">Edit Lucky Number</DialogTitle>
            </DialogHeader>
            <NumberForm />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
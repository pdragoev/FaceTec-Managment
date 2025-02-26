import { Search, Globe, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Header() {
  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4 gap-4">
        <h1 className="text-xl font-bold">Фейстек ЕООД</h1>
        
        <div className="flex-1 ml-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Global search..." className="pl-8" />
          </div>
        </div>

        <Select defaultValue="bg">
          <SelectTrigger className="w-32">
            <Globe className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="bg">Български</SelectItem>
            <SelectItem value="ru">Русский</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 border rounded-full px-3 py-1.5">
          <User className="h-5 w-5" />
          <span>Admin User</span>
        </div>
      </div>
    </header>
  );
}

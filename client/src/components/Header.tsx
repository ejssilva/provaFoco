import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <header className="w-full h-20 px-4 bg-primary/10 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50">
      <div className="container mx-auto h-full flex items-start justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group relative z-50">
            <img 
              src="/logo.png" 
              alt="Prova Foco" 
              className="h-24 md:h-32 w-auto object-contain mix-blend-multiply group-hover:scale-105 transition-transform mt-[-16px]" 
            />
          </div>
        </Link>
        
        <div className="flex items-center gap-4 self-center">
           <nav className="hidden md:flex items-center gap-6 mr-4">
             <Link href="/questions">
               <a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                 Questões
               </a>
             </Link>
             <Link href="/stats">
               <a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                 Estatísticas
               </a>
             </Link>
           </nav>

           {user ? (
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                   <Avatar className="h-8 w-8">
                     <AvatarFallback>{user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                   </Avatar>
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="w-56" align="end" forceMount>
                 <DropdownMenuItem onClick={() => setLocation("/stats")}>
                   <User className="mr-2 h-4 w-4" />
                   <span>Minhas Estatísticas</span>
                 </DropdownMenuItem>
                 <DropdownMenuItem onClick={handleLogout}>
                   <LogOut className="mr-2 h-4 w-4" />
                   <span>Sair</span>
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
           ) : (
             <Link href="/admin/login">
               <Button variant="ghost" size="sm">Entrar</Button>
             </Link>
           )}
        </div>
      </div>
    </header>
  );
}

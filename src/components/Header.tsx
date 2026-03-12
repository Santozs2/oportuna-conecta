import { Users, TrendingUp, FileCheck, Briefcase, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import logo from "../assets/logo.png";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  userName: string;
  onOpenAIAssistant: () => void;
}

export function Header({ activeTab, onTabChange, onLogout, userName, onOpenAIAssistant }: HeaderProps) {
  return (
    <header className="border-b bg-secondary sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md p-1">
              <img src={logo} alt="Oportuna" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-white">Oportuna Conecta</h1>
              <p className="text-white/80 text-sm">Qualificação e Oportunidades</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={onOpenAIAssistant}
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Assistente de IA</span>
            </Button>
            <span className="text-white text-sm hidden md:inline">Olá, {userName}</span>
            <Button 
              variant="outline" 
              className="border-white text-[rgb(12,0,0)] hover:bg-white hover:text-secondary bg-[rgb(255,255,255)]"
              onClick={onLogout}
            >
              Sair
            </Button>
          </div>
        </div>
        
        <nav className="flex gap-2">
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            onClick={() => onTabChange("dashboard")}
            className={`gap-2 ${activeTab !== "dashboard" ? "text-white hover:text-white hover:bg-white/10" : ""}`}
          >
            <TrendingUp className="w-4 h-4" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === "candidates" ? "default" : "ghost"}
            onClick={() => onTabChange("candidates")}
            className={`gap-2 ${activeTab !== "candidates" ? "text-white hover:text-white hover:bg-white/10" : ""}`}
          >
            <Users className="w-4 h-4" />
            Alunos
          </Button>
          <Button
            variant={activeTab === "jobs" ? "default" : "ghost"}
            onClick={() => onTabChange("jobs")}
            className={`gap-2 ${activeTab !== "jobs" ? "text-white hover:text-white hover:bg-white/10" : ""}`}
          >
            <Briefcase className="w-4 h-4" />
            Vagas
          </Button>
          <Button
            variant={activeTab === "assessments" ? "default" : "ghost"}
            onClick={() => onTabChange("assessments")}
            className={`gap-2 ${activeTab !== "assessments" ? "text-white hover:text-white hover:bg-white/10" : ""}`}
          >
            <FileCheck className="w-4 h-4" />
            Avaliações
          </Button>
        </nav>
      </div>
    </header>
  );
}
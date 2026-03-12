import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Sparkles, Send, Loader2 } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  location: string;
  program: string;
  skills: string[];
  availability: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  requiredSkills: string[];
}

interface Assessment {
  skill: string;
  candidateId: number;
  status: string;
  correctAnswers: number;
  totalTechnicalQuestions: number;
  totalQuestions: number;
  completedAt: string;
}

interface AIMatchingAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  jobs: Job[];
  skillAssessments: Record<number, Assessment[]>;
}

interface Message {
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const MAX_MESSAGES = 3;

export function AIMatchingAssistant({ isOpen, onClose, candidates, jobs, skillAssessments }: AIMatchingAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addAIMessage(
          "Olá! Sou o assistente de IA do Oportuna Conecta. 🤖\n\nPosso te ajudar a:\n• Analisar o desempenho dos alunos nas avaliações\n• Identificar os melhores matches entre alunos e vagas\n• Gerar insights sobre competências\n• Sugerir próximas ações\n\nComo posso ajudar?",
          ["Analisar alunos", "Encontrar matches", "Estatísticas", "Top performers"]
        );
      }, 500);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addAIMessage = (content: string, suggestions?: string[]) => {
    setIsTyping(true);
    setTimeout(() => {
      const msg: Message = { type: "ai", content, timestamp: new Date(), suggestions };
      setMessages(prev => [...prev, msg].slice(-MAX_MESSAGES));
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const pushUserMessage = (content: string) => {
    const msg: Message = { type: "user", content, timestamp: new Date() };
    setMessages(prev => [...prev, msg].slice(-MAX_MESSAGES));
  };

  const analyzeAllCandidates = () => {
    const allAssessments = Object.values(skillAssessments).flat();
    const totalAssessments = allAssessments.length;
    const approvedAssessments = allAssessments.filter(a => a.status === "approved").length;
    const approvalRate = totalAssessments > 0 ? Math.round((approvedAssessments / totalAssessments) * 100) : 0;
    const candidatesWithAssessments = Object.keys(skillAssessments).length;

    const topCandidates = Object.entries(skillAssessments)
      .map(([candidateId, assessments]) => {
        const candidate = candidates.find(c => c.id === Number(candidateId));
        const approvedCount = assessments.filter(a => a.status === "approved").length;
        const avgScore = assessments.reduce(
          (acc, a) => acc + (a.correctAnswers / a.totalTechnicalQuestions) * 100, 0
        ) / assessments.length;
        return { candidate, approvedCount, avgScore: Math.round(avgScore), totalAssessments: assessments.length };
      })
      .filter(item => item.candidate)
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 3);

    let response = `📊 **Análise Completa das Avaliações**\n\n`;
    response += `✅ **${approvedAssessments}** competências aprovadas de **${totalAssessments}** avaliações (${approvalRate}%)\n`;
    response += `👥 **${candidatesWithAssessments}** alunos avaliados\n\n`;

    if (topCandidates.length > 0) {
      response += `🏆 **Top 3 Alunos com Melhor Desempenho:**\n`;
      topCandidates.forEach((item, index) => {
        response += `\n${index + 1}. **${item.candidate?.name}**\n`;
        response += `   • Aproveitamento médio: ${item.avgScore}%\n`;
        response += `   • ${item.approvedCount}/${item.totalAssessments} competências aprovadas\n`;
        response += `   • Localização: ${item.candidate?.location}\n`;
      });
    }

    addAIMessage(response, ["Encontrar matches", "Estatísticas", "Menu principal"]);
  };

  const findMatches = () => {
    const matches: any[] = [];

    Object.entries(skillAssessments).forEach(([candidateId, assessments]) => {
      const candidate = candidates.find(c => c.id === Number(candidateId));
      if (!candidate) return;

      const approvedSkills = assessments.filter(a => a.status === "approved").map(a => a.skill);

      jobs.forEach(job => {
        const matchingSkills = job.requiredSkills.filter(skill => approvedSkills.includes(skill));
        if (matchingSkills.length > 0) {
          const matchScore = Math.round((matchingSkills.length / job.requiredSkills.length) * 100);
          if (matchScore >= 60) {
            matches.push({ candidate, job, matchingSkills, matchScore });
          }
        }
      });
    });

    matches.sort((a, b) => b.matchScore - a.matchScore);

    if (matches.length === 0) {
      addAIMessage(
        "⚠️ No momento, não encontrei matches com score superior a 60% entre os alunos avaliados e as vagas disponíveis.\n\nIsso pode acontecer porque:\n• As competências avaliadas ainda não foram todas aprovadas\n• As vagas requerem competências diferentes\n\nSugestão: Continue avaliando mais competências dos alunos!",
        ["Analisar alunos", "Estatísticas", "Menu principal"]
      );
      return;
    }

    let response = `🎯 **Matches Encontrados** (${matches.length} combinações)\n\n`;
    matches.slice(0, 5).forEach((match, index) => {
      response += `${index + 1}. **${match.candidate.name}** ↔️ **${match.job.title}**\n`;
      response += `   📍 ${match.candidate.location} → ${match.job.location}\n`;
      response += `   📊 Match: **${match.matchScore}%**\n`;
      response += `   ✓ Competências compatíveis: ${match.matchingSkills.join(", ")}\n`;
      response += `   🏢 Empresa: ${match.job.company}\n\n`;
    });

    if (matches.length > 5) response += `\n... e mais ${matches.length - 5} matches disponíveis!`;

    addAIMessage(response, ["Estatísticas", "Analisar alunos", "Menu principal"]);
  };

  const showStatistics = () => {
    const allAssessments = Object.values(skillAssessments).flat();
    const evaluatedCandidates = Object.keys(skillAssessments).length;

    const skillsDistribution: Record<string, number> = {};
    allAssessments.forEach(a => {
      if (a.status === "approved") {
        skillsDistribution[a.skill] = (skillsDistribution[a.skill] || 0) + 1;
      }
    });

    const topSkills = Object.entries(skillsDistribution).sort((a, b) => b[1] - a[1]).slice(0, 5);

    let response = `📈 **Estatísticas Gerais do Sistema**\n\n`;
    response += `**Alunos:**\n• Total cadastrado: ${candidates.length}\n• Com avaliações: ${evaluatedCandidates}\n• Pendentes de avaliação: ${candidates.length - evaluatedCandidates}\n\n`;
    response += `**Vagas:**\n• Total disponível: ${jobs.length}\n\n`;
    response += `**Avaliações:**\n• Total realizado: ${allAssessments.length}\n\n`;

    if (topSkills.length > 0) {
      response += `**🏅 Top 5 Competências Aprovadas:**\n`;
      topSkills.forEach(([skill, count], index) => {
        response += `${index + 1}. ${skill}: ${count} aprovação(ões)\n`;
      });
    }

    addAIMessage(response, ["Analisar alunos", "Encontrar matches", "Menu principal"]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    pushUserMessage(suggestion);
    routeMessage(suggestion.toLowerCase());
  };

  const routeMessage = (msg: string) => {
    if (msg.includes("analis") || msg.includes("aluno") || msg.includes("candidato") || msg.includes("top performer")) {
      analyzeAllCandidates();
    } else if (msg.includes("match") || msg.includes("vaga") || msg.includes("compatib")) {
      findMatches();
    } else if (msg.includes("estatistic") || msg.includes("número") || msg.includes("quantos")) {
      showStatistics();
    } else if (msg.includes("menu principal")) {
      addAIMessage("Como posso ajudar?", ["Analisar alunos", "Encontrar matches", "Estatísticas", "Top performers"]);
    } else {
      addAIMessage(
        "Entendi! Para resultados mais precisos, tente usar uma das sugestões abaixo:",
        ["Analisar alunos", "Encontrar matches", "Estatísticas"]
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input.trim();
    pushUserMessage(userMessage);
    setInput("");
    routeMessage(userMessage.toLowerCase());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[70vw] max-w-[70vw] h-[70vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-secondary to-secondary/90 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-white">Assistente de IA - Análise e Matching</DialogTitle>
              <DialogDescription className="text-white/80">
                Análise inteligente de competências e cruzamento de dados
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4" ref={scrollRef}>
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg p-4 ${message.type === "user" ? "bg-secondary text-white" : "bg-muted"}`}>
                  <div className="whitespace-pre-line">{message.content}</div>

                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <p className="text-xs text-muted-foreground">Sugestões:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {message.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs h-7 px-3 py-1"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground mt-2">
                    {message.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                    <span className="text-sm text-muted-foreground">Analisando dados...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 pt-4 border-t bg-muted/30 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua pergunta ou solicitação..."
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              className="h-[60px] w-[60px] flex-shrink-0"
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Pressione Enter para enviar • Shift+Enter para nova linha
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
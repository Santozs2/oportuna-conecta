import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { CandidatesList } from "./components/CandidatesList";
import { JobsList } from "./components/JobsList";
import { Auth } from "./components/Auth";
import { AIMatchingAssistant } from "./components/AIMatchingAssistant";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import {
  apiLogin,
  apiRegister,
  getCandidates,
  getJobs,
  getAssessments,
  addCandidate,
  addJob,
  addAssessment,
} from "./api";

type UserType = { id: number; name: string; email: string; type: string };

const INITIAL_MATCHES = [
  { id: 1, candidateName: "Ana Silva Santos", jobTitle: "Operador de Processos Júnior", matchScore: 95, status: "contacted" },
  { id: 2, candidateName: "Carlos Eduardo Oliveira", jobTitle: "Técnico de Manutenção Mecânica", matchScore: 88, status: "placed" },
  { id: 3, candidateName: "Maria Fernanda Costa", jobTitle: "Técnico em Instrumentação", matchScore: 92, status: "interviewed" },
  { id: 4, candidateName: "João Pedro Almeida", jobTitle: "Técnico de Segurança do Trabalho", matchScore: 90, status: "contacted" },
  { id: 5, candidateName: "Patricia Souza Lima", jobTitle: "Analista de Controle de Qualidade", matchScore: 87, status: "placed" },
];

export default function App() {
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [skillAssessments, setSkillAssessments] = useState<Record<number, any[]>>({});
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const matches = INITIAL_MATCHES;

  useEffect(() => {
    if (!user?.id) return;

    getCandidates(user.id!).then(setCandidates).catch(() => {
      toast.error("Erro ao carregar alunos.");
    });

    getJobs(user.id!).then(setJobs).catch(() => {
      toast.error("Erro ao carregar vagas.");
    });

    getAssessments(user.id!).then((data) => {
      const grouped: Record<number, any[]> = {};
      data.forEach((a: any) => {
        if (!grouped[a.candidate_id]) grouped[a.candidate_id] = [];
        const group = grouped[a.candidate_id];
        if (!group) return;
        group.push({
          skill: a.skill,
          status: a.status,
          scores: {
            technical: a.technical_score,
            psychological: a.psychological_score,
            total: a.total_score,
          },
          completedAt: a.completed_at,
        });
      });
      setSkillAssessments(grouped);
    }).catch(() => {
      toast.error("Erro ao carregar avaliações.");
    });
  }, [user]);

  const handleLogin = async (userData: { name: string; email: string; type: string; password: string }) => {
    try {
      const data = await apiLogin(userData.email, userData.password);
      if (data.error) {
        toast.error(data.error);
        return;
      }
      if (data.id) {
        localStorage.setItem("token", data.token);
        setUser({ id: data.id, name: data.name, email: data.email, type: data.type });
      }
    } catch {
      toast.error("Erro ao fazer login. Verifique sua conexão.");
    }
  };

  const handleRegister = async (userData: { name: string; email: string; type: string; password: string }) => {
    try {
      const data = await apiRegister(userData.name, userData.email, userData.password, userData.type);
      if (data.error) {
        toast.error(data.error);
        return;
      }
      if (data.id) {
        localStorage.setItem("token", data.token);
        setUser({ id: data.id, name: data.name, email: data.email, type: data.type });
      }
    } catch {
      toast.error("Erro ao criar conta. Verifique sua conexão.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCandidates([]);
    setJobs([]);
    setSkillAssessments({});
    setActiveTab("dashboard");
  };

  const handleAddCandidate = async (candidate: any) => {
    try {
      const newCandidate = await addCandidate({ ...candidate, user_id: user?.id });
      setCandidates((prev) => [...prev, newCandidate]);
      toast.success("Aluno adicionado com sucesso!");
    } catch {
      toast.error("Erro ao adicionar aluno.");
    }
  };

  const handleAddJob = async (job: any) => {
    try {
      const newJob = await addJob({ ...job, user_id: user?.id });
      setJobs((prev) => [...prev, newJob]);
      toast.success("Vaga adicionada com sucesso!");
    } catch {
      toast.error("Erro ao adicionar vaga.");
    }
  };

  const handleSkillAssessed = async (candidateId: number, assessment: any) => {
    try {
      await addAssessment({
        candidate_id: candidateId,
        skill: assessment.skill,
        status: assessment.status,
        technical_score: assessment.scores.technical,
        psychological_score: assessment.scores.psychological,
        total_score: assessment.scores.total,
      });

      setSkillAssessments((prev) => ({
        ...prev,
        [candidateId]: [...(prev[candidateId] || []), assessment],
      }));

      const statusMessage =
        assessment.status === "approved"
          ? `Competência "${assessment.skill}" aprovada com ${assessment.scores.total}%!`
          : `Avaliação de "${assessment.skill}" concluída. Requer atenção.`;

      toast.success(statusMessage, {
        description: `Pontuação: Técnica ${assessment.scores.technical}% | Psicológica ${assessment.scores.psychological}%`,
      });
    } catch {
      toast.error("Erro ao salvar avaliação.");
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          userName={user.name}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        />

        <main className="container mx-auto px-4 py-8">
          {activeTab === "dashboard" && (
            <Dashboard candidates={candidates} jobs={jobs} matches={matches} />
          )}

          {activeTab === "candidates" && (
            <CandidatesList
              candidates={candidates}
              onAddCandidate={handleAddCandidate}
              skillAssessments={skillAssessments}
              onSkillAssessed={handleSkillAssessed}
            />
          )}

          {activeTab === "jobs" && (
            <JobsList jobs={jobs} onAddJob={handleAddJob} candidates={candidates} />
          )}

          {activeTab === "assessments" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-secondary mb-2">Histórico de Avaliações de Competências</h2>
                <p className="text-muted-foreground">Acompanhe todas as avaliações realizadas pelos alunos</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {Object.entries(skillAssessments)
                  .flatMap(([candidateId, assessments]) =>
                    assessments.map((assessment, index) => {
                      const candidate = candidates.find((c) => c.id === Number(candidateId));
                      if (!candidate) return null;
                      return (
                        <div
                          key={`${candidateId}-${index}`}
                          className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-secondary">{candidate.name}</h3>
                              <p className="text-sm text-muted-foreground">{candidate.program}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs ${
                              assessment.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                              {assessment.status === "approved" ? "Aprovado" : "Não Aprovado"}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span>Competência:</span>
                              <span className="text-secondary">{assessment.skill}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground mb-1">Geral</p>
                                <p className={`text-2xl ${
                                  assessment.scores.total >= 80 ? "text-green-600" :
                                  assessment.scores.total >= 60 ? "text-yellow-600" : "text-red-600"
                                }`}>
                                  {assessment.scores.total}%
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground mb-1">Técnica</p>
                                <p className="text-2xl text-secondary">{assessment.scores.technical}%</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-muted-foreground mb-1">Psicológica</p>
                                <p className="text-2xl text-primary">{assessment.scores.psychological}%</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Data:</span>
                              <span>{new Date(assessment.completedAt).toLocaleDateString("pt-BR")}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )
                  .filter(Boolean)}

                {Object.keys(skillAssessments).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Nenhuma avaliação realizada ainda.</p>
                    <p className="text-sm mt-2">
                      As avaliações aparecerão aqui assim que os alunos completarem suas avaliações de competências.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        <AIMatchingAssistant
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
          candidates={candidates}
          jobs={jobs}
          skillAssessments={skillAssessments}
        />

        <Toaster />
      </div>
    </ThemeProvider>
  );
}
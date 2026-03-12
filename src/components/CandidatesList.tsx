import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { Mail, Phone, MapPin, Award, Plus, CheckCircle2, XCircle, ClipboardList, AlertCircle } from "lucide-react";
import { SkillAssessment } from "./SkillAssessment";
import { Progress } from "./ui/progress";

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  program: string;
  completionDate: string;
  skills: string[];
  availability: string;
}

interface CandidatesListProps {
  candidates: Candidate[];
  onAddCandidate: (candidate: Omit<Candidate, 'id'>) => void;
  skillAssessments?: Record<number, any[]>;
  onSkillAssessed?: (candidateId: number, assessment: any) => void;
}

export function CandidatesList({ candidates, onAddCandidate, skillAssessments = {}, onSkillAssessed }: CandidatesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [selectedSkillForAssessment, setSelectedSkillForAssessment] = useState<string>("");
  const [selectedCandidateForAssessment, setSelectedCandidateForAssessment] = useState<any>(null);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    program: "",
    completionDate: "",
    skills: "",
    availability: "Imediata"
  });

  const availableSkills = {
    "Operação": ["Operação de Equipamentos", "Controle de Processos", "Análises Laboratoriais", "Controle de Qualidade"],
    "Manutenção": ["Manutenção Mecânica", "Manutenção Elétrica", "Soldagem", "Hidráulica", "Pneumática"],
    "Instrumentação": ["Instrumentação Industrial", "Automação", "CLP", "Elétrica Industrial"],
    "Segurança": ["NR-10", "NR-35", "NR-33", "Gestão de Riscos", "Primeiros Socorros", "Segurança Industrial"],
    "Gestão": ["Leitura de Desenhos", "Gestão de Projetos", "Controle de Documentação"]
  };

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const toggleSkill = (skillName: string) => {
    const exists = selectedSkills.includes(skillName);
    if (exists) {
      setSelectedSkills(selectedSkills.filter(s => s !== skillName));
    } else {
      if (selectedSkills.length >= 3) {
        return;
      }
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    candidate.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    onAddCandidate({
      ...newCandidate,
      skills: selectedSkills
    });
    
    setIsDialogOpen(false);
    
    setNewCandidate({
      name: "",
      email: "",
      phone: "",
      location: "",
      program: "",
      completionDate: "",
      skills: "",
      availability: "Imediata"
    });
    setSelectedSkills([]);
  };

  const handleStartAssessment = (candidate: any, skill: string) => {
    setSelectedCandidateForAssessment(candidate);
    setSelectedSkillForAssessment(skill);
    setAssessmentDialogOpen(true);
  };

  const handleAssessmentComplete = (result: any) => {
    if (onSkillAssessed && selectedCandidateForAssessment) {
      onSkillAssessed(selectedCandidateForAssessment.id, result);
    }
    setAssessmentDialogOpen(false);
    setSelectedCandidateForAssessment(null);
    setSelectedSkillForAssessment("");
  };

  const getCandidateAssessments = (candidateId: number) => {
    return skillAssessments[candidateId] || [];
  };

  const getSkillAssessment = (candidateId: number, skillName: string) => {
    const assessments = getCandidateAssessments(candidateId);
    return assessments.find(a => a.skill === skillName);
  };

  const calculateCandidateProgress = (candidateId: number, skills: string[]) => {
    const assessments = getCandidateAssessments(candidateId);
    const approvedSkills = assessments.filter(a => a.status === "approved").length;
    return skills.length > 0 ? (approvedSkills / skills.length) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Buscar por nome, competência ou programa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Aluno
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Aluno</DialogTitle>
              <DialogDescription>
                Cadastre um novo aluno e selecione até 5 competências para avaliação
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome Completo</Label>
                  <Input
                    value={newCandidate.name}
                    onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newCandidate.email}
                    onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={newCandidate.phone}
                    onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Localização</Label>
                  <Input
                    value={newCandidate.location}
                    onChange={(e) => setNewCandidate({ ...newCandidate, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Programa de Qualificação</Label>
                  <Input
                    value={newCandidate.program}
                    onChange={(e) => setNewCandidate({ ...newCandidate, program: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Data de Conclusão</Label>
                  <Input
                    type="date"
                    value={newCandidate.completionDate}
                    onChange={(e) => setNewCandidate({ ...newCandidate, completionDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Disponibilidade</Label>
                <Select
                  value={newCandidate.availability}
                  onValueChange={(value) => setNewCandidate({ ...newCandidate, availability: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Imediata">Imediata</SelectItem>
                    <SelectItem value="15 dias">Em 15 dias</SelectItem>
                    <SelectItem value="30 dias">Em 30 dias</SelectItem>
                    <SelectItem value="A combinar">A combinar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-secondary">Seleção de Competências</h3>
                    <p className="text-sm text-muted-foreground">Selecione até 5 competências para avaliação</p>
                  </div>
                  <Badge variant={selectedSkills.length >= 5 ? "default" : "outline"} className="text-sm">
                    {selectedSkills.length}/5 competências
                  </Badge>
                </div>

                {selectedSkills.length >= 5 && (
                  <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary rounded-lg mb-4">
                    <AlertCircle className="w-4 h-4 text-primary" />
                    <p className="text-sm text-primary">Limite de 5 competências atingido</p>
                  </div>
                )}

                <div className="space-y-4">
                  {Object.entries(availableSkills).map(([category, skills]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-secondary">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {skills.map((skill) => {
                          const isSelected = selectedSkills.includes(skill);
                          const isDisabled = !isSelected && selectedSkills.length >= 5;

                          return (
                            <div
                              key={skill}
                              className={`flex items-center gap-2 border rounded-lg p-3 transition-colors ${
                                isSelected ? "border-secondary bg-secondary/5" : ""
                              } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-muted/50"}`}
                              onClick={() => !isDisabled && toggleSkill(skill)}
                            >
                              <Checkbox
                                id={skill}
                                checked={isSelected}
                                disabled={isDisabled}
                              />
                              <Label htmlFor={skill} className="cursor-pointer text-sm flex-1">
                                {skill}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1"
                  disabled={selectedSkills.length === 0 || !newCandidate.name}
                >
                  Adicionar Aluno ({selectedSkills.length} competências)
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedSkills([]);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCandidates.map((candidate) => {
          const candidateAssessments = getCandidateAssessments(candidate.id);
          const progress = calculateCandidateProgress(candidate.id, candidate.skills);
          
          return (
            <Card key={candidate.id} className="p-6 hover:shadow-lg transition-shadow border-t-4 border-t-secondary">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-secondary">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{candidate.program}</p>
                  </div>
                  <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-secondary" />
                  </div>
                </div>

                {/* Progress da avaliação */}
                {candidate.skills.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progresso de Avaliação</span>
                      <span className="text-secondary">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {candidate.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {candidate.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {candidate.location}
                  </div>
                </div>

                <div>
                  <p className="text-sm mb-2">Competências:</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => {
                      const assessment = getSkillAssessment(candidate.id, skill);
                      return (
                        <div key={skill} className="relative group">
                          <Badge 
                            variant={
                              assessment?.status === "approved" ? "default" :
                              assessment?.status === "rejected" ? "destructive" :
                              "secondary"
                            }
                            className="cursor-pointer"
                            onClick={() => handleStartAssessment(candidate, skill)}
                          >
                            {skill}
                            {assessment?.status === "approved" && (
                              <CheckCircle2 className="w-3 h-3 ml-1" />
                            )}
                            {assessment?.status === "rejected" && (
                              <XCircle className="w-3 h-3 ml-1" />
                            )}
                            {!assessment && (
                              <ClipboardList className="w-3 h-3 ml-1" />
                            )}
                          </Badge>
                          {assessment && (
                            <div className="absolute hidden group-hover:block bg-secondary text-white text-xs rounded px-2 py-1 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10">
                              {assessment.scores.total}% - {assessment.status === "approved" ? "Aprovado" : "Não Aprovado"}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {candidate.skills.length > 0 && candidateAssessments.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Clique nas competências para iniciar avaliação
                    </p>
                  )}
                </div>

                {/* Resultados das avaliações */}
                {candidateAssessments.length > 0 && (
                  <div className="pt-3 border-t border-secondary/20">
                    <p className="text-xs mb-2">Resultados das Avaliações:</p>
                    <div className="space-y-2">
                      {candidateAssessments.map((assessment, index) => (
                        <div key={index} className="flex items-center justify-between text-xs bg-muted/30 rounded p-2">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{assessment.skill}:</span>
                            <Badge 
                              variant={assessment.status === "approved" ? "default" : "destructive"}
                              className="text-xs h-5"
                            >
                              {assessment.status === "approved" ? "Aprovado" : "Não Aprovado"}
                            </Badge>
                          </div>
                          <span className={`${
                            assessment.scores.total >= 80 ? "text-green-600" :
                            assessment.scores.total >= 60 ? "text-yellow-600" :
                            "text-red-600"
                          }`}>
                            {assessment.scores.total}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-secondary/20">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Disponibilidade:</span>
                    <span className="text-secondary">{candidate.availability}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-muted-foreground">Conclusão:</span>
                    <span className="text-secondary">{new Date(candidate.completionDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal de Avaliação */}
      {selectedCandidateForAssessment && selectedSkillForAssessment && (
        <SkillAssessment
          skill={selectedSkillForAssessment}
          candidate={selectedCandidateForAssessment}
          isOpen={assessmentDialogOpen}
          onClose={() => {
            setAssessmentDialogOpen(false);
            setSelectedCandidateForAssessment(null);
            setSelectedSkillForAssessment("");
          }}
          onComplete={handleAssessmentComplete}
        />
      )}
    </div>
  );
}

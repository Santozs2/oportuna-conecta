import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Building2, MapPin, DollarSign, Clock, Plus, Users, Mail, Phone, Award } from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requiredSkills: string[];
  status: string;
  postedDate: string;
}

interface JobsListProps {
  jobs: Job[];
  onAddJob: (job: Omit<Job, "id">) => void;
  candidates: any[];
}

const BLANK_JOB: {
  title: string; company: string; location: string; salary: string;
  type: string; description: string; requiredSkills: string;
  status: string; postedDate: string;
} = {
  title: "", company: "", location: "", salary: "",
  type: "Tempo Integral", description: "", requiredSkills: "",
  status: "open", postedDate: new Date().toISOString().split("T")[0] as string,
};

export function JobsList({ jobs, onAddJob, candidates }: JobsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [matchedCandidatesDialogOpen, setMatchedCandidatesDialogOpen] = useState(false);
  const [selectedJobMatches, setSelectedJobMatches] = useState<any[]>([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [newJob, setNewJob] = useState(BLANK_JOB);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.requiredSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getMatchingCandidates = (job: Job) =>
    candidates.filter(candidate =>
      job.requiredSkills.some(skill =>
        candidate.skills.some((cs: string) =>
          cs.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs.toLowerCase())
        )
      )
    );

  const handleViewMatches = (job: Job) => {
    setSelectedJobMatches(getMatchingCandidates(job));
    setSelectedJobTitle(job.title);
    setMatchedCandidatesDialogOpen(true);
  };

  const handleSubmit = () => {
    onAddJob({
      ...newJob,
      requiredSkills: newJob.requiredSkills.split(",").map(s => s.trim()).filter(Boolean),
    });
    setIsDialogOpen(false);
    setNewJob(BLANK_JOB);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Buscar por título, empresa ou competência..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Vaga
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nova Vaga de Emprego</DialogTitle>
              <DialogDescription>
                Preencha as informações da vaga para publicá-la no sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Título da Vaga</Label>
                  <Input
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Empresa</Label>
                  <Input
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Localização</Label>
                  <Input
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Faixa Salarial</Label>
                  <Input
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    placeholder="Ex: R$ 3.000 - R$ 5.000"
                  />
                </div>
              </div>

              <div>
                <Label>Tipo de Contrato</Label>
                <Input
                  value={newJob.type}
                  onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                />
              </div>

              <div>
                <Label>Descrição da Vaga</Label>
                <Textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label>Competências Requeridas (separadas por vírgula)</Label>
                <Input
                  value={newJob.requiredSkills}
                  onChange={(e) => setNewJob({ ...newJob, requiredSkills: e.target.value })}
                  placeholder="Ex: Soldagem, Segurança do Trabalho, NR-10"
                />
              </div>

              <Button onClick={handleSubmit} className="w-full">Publicar Vaga</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const matchCount = getMatchingCandidates(job).length;
          return (
            <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-secondary">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-secondary" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-secondary">{job.title}</h3>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>
                    <Badge variant={job.status === "open" ? "default" : "secondary"}>
                      {job.status === "open" ? "Aberta" : "Fechada"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {matchCount} alunos compatíveis
                    </div>
                  </div>

                  <p className="text-sm mt-4 text-muted-foreground">{job.description}</p>

                  <div className="mt-4">
                    <p className="text-sm mb-2">Competências Requeridas:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  {matchCount > 0 && (
                    <div className="mt-4 pt-4 border-t border-primary/20">
                      <Button
                        variant="outline"
                        className="w-full md:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleViewMatches(job)}
                      >
                        Ver {matchCount} Alunos Compatíveis
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={matchedCandidatesDialogOpen} onOpenChange={setMatchedCandidatesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Alunos Compatíveis - {selectedJobTitle}</DialogTitle>
            <DialogDescription>
              Lista de alunos que possuem as competências necessárias para esta vaga
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedJobMatches.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhum aluno compatível encontrado.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedJobMatches.map((candidate) => (
                  <Card key={candidate.id} className="p-4 border-l-4 border-l-secondary">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-secondary">{candidate.name}</h4>
                          <p className="text-sm text-muted-foreground">{candidate.program}</p>
                        </div>
                        <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-secondary" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3.5 h-3.5" />
                          {candidate.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" />
                          {candidate.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          {candidate.location}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs mb-1.5">Competências:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {candidate.skills.map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-secondary/20">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Disponibilidade:</span>
                          <span className="text-secondary">{candidate.availability}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { Card } from "./ui/card";
import { Users, Briefcase, TrendingUp, Award } from "lucide-react";
import { Progress } from "./ui/progress";

interface DashboardProps {
  candidates: any[];
  jobs: any[];
  matches: any[];
}

export function Dashboard({ candidates, jobs, matches }: DashboardProps) {
  const placedCandidates = matches.filter(m => m.status === "placed").length;
  const placementRate = candidates.length > 0 ? (placedCandidates / candidates.length) * 100 : 0;
  
  const topSkills = candidates
    .flatMap(c => c.skills)
    .reduce((acc: any, skill: string) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {});
  
  const topSkillsList = Object.entries(topSkills)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-l-4 border-l-secondary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total de Alunos</p>
              <h2 className="mt-1 text-secondary">{candidates.length}</h2>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-secondary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Vagas Disponíveis</p>
              <h2 className="mt-1 text-secondary">{jobs.filter(j => j.status === "open").length}</h2>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-accent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Matches Realizados</p>
              <h2 className="mt-1" style={{ color: '#7CAE00' }}>{matches.length}</h2>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#7CAE0020' }}>
              <TrendingUp className="w-6 h-6" style={{ color: '#7CAE00' }} />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4" style={{ borderLeftColor: '#0288D1' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Taxa de Colocação</p>
              <h2 className="mt-1" style={{ color: '#0288D1' }}>{placementRate.toFixed(0)}%</h2>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0288D120' }}>
              <Award className="w-6 h-6" style={{ color: '#0288D1' }} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-4">Competências Mais Procuradas</h3>
          <div className="space-y-4">
            {topSkillsList.map(([skill, count]: any) => (
              <div key={skill}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">{skill}</span>
                  <span className="text-sm text-muted-foreground">{count} alunos</span>
                </div>
                <Progress value={(count / candidates.length) * 100} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Matches Recentes</h3>
          <div className="space-y-4">
            {matches.slice(0, 5).map((match) => (
              <div key={match.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-primary/20">
                <div className="flex-1">
                  <p>{match.candidateName}</p>
                  <p className="text-sm text-muted-foreground">{match.jobTitle}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm bg-primary/20 text-secondary px-2 py-1 rounded">
                    {match.matchScore}% match
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

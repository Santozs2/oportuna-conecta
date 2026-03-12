import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, ChevronRight, ChevronLeft, Award, AlertCircle } from "lucide-react";
import { Card } from "./ui/card";

interface SkillAssessmentProps {
  skill: string;
  candidate: any;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: any) => void;
}

// Banco de perguntas técnicas por tipo de competência
const technicalQuestions: Record<string, any[]> = {
  // Operação
  "Operação de Equipamentos": [
    {
      id: 1,
      question: "Qual é o procedimento correto antes de iniciar a operação de um equipamento industrial?",
      options: [
        "Iniciar imediatamente após ligar o equipamento",
        "Verificar checklist de segurança, inspeção visual e testes de funcionamento",
        "Apenas verificar se o equipamento está ligado",
        "Esperar instrução de outro operador"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Em caso de alarme durante a operação, qual a primeira ação?",
      options: [
        "Continuar operando e verificar depois",
        "Desligar imediatamente todos os equipamentos",
        "Identificar o tipo de alarme e seguir procedimento específico",
        "Chamar a manutenção"
      ],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "Descreva brevemente como você realizaria uma partida segura de um equipamento.",
      type: "text"
    }
  ],
  "Controle de Processos": [
    {
      id: 1,
      question: "O que é um fluxograma de processo (P&ID)?",
      options: [
        "Um documento financeiro",
        "Diagrama que mostra equipamentos, instrumentação e fluxo de processo",
        "Um manual de operação",
        "Uma lista de equipamentos"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Qual a importância do controle de variáveis de processo (pressão, temperatura, vazão)?",
      options: [
        "Apenas para documentação",
        "Garantir qualidade do produto e segurança da operação",
        "Para satisfazer auditores",
        "Não é importante"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Explique como você agiria ao detectar um desvio nos parâmetros de processo.",
      type: "text"
    }
  ],
  "Controle de Qualidade": [
    {
      id: 1,
      question: "O que significa não conformidade em controle de qualidade?",
      options: [
        "Produto dentro das especificações",
        "Produto ou processo que não atende aos requisitos estabelecidos",
        "Documento de aprovação",
        "Equipamento funcionando"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Qual a frequência ideal para calibração de instrumentos de medição?",
      options: [
        "Apenas quando quebram",
        "Conforme plano de calibração estabelecido e normas aplicáveis",
        "Uma vez por ano sempre",
        "Não é necessário calibrar"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Descreva o processo de amostragem e análise que você conhece.",
      type: "text"
    }
  ],
  "Análises Laboratoriais": [
    {
      id: 1,
      question: "Qual o princípio básico de uma titulação?",
      options: [
        "Misturar substâncias aleatoriamente",
        "Determinar concentração através de reação com volume conhecido",
        "Aquecer a amostra",
        "Filtrar impurezas"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Por que é importante o uso de EPIs em laboratório?",
      options: [
        "Apenas por exigência legal",
        "Proteção contra agentes químicos, físicos e biológicos",
        "Para parecer profissional",
        "Não é importante"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Explique como você garante a rastreabilidade das amostras analisadas.",
      type: "text"
    }
  ],

  // Manutenção
  "Manutenção Mecânica": [
    {
      id: 1,
      question: "Qual a diferença entre manutenção preventiva e corretiva?",
      options: [
        "Não há diferença",
        "Preventiva evita falhas, corretiva repara após falha",
        "Preventiva é mais cara",
        "Corretiva é programada"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Quais ferramentas são essenciais para alinhamento de eixos?",
      options: [
        "Apenas uma chave inglesa",
        "Relógio comparador, base magnética e ferramentas de ajuste",
        "Martelo e alicate",
        "Não são necessárias ferramentas"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Descreva o procedimento para substituição de um rolamento.",
      type: "text"
    }
  ],
  "Manutenção Elétrica": [
    {
      id: 1,
      question: "Qual a função de um disjuntor?",
      options: [
        "Decoração do painel",
        "Proteção contra sobrecorrente e curto-circuito",
        "Apenas para desligar manualmente",
        "Economizar energia"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Antes de trabalhar em circuitos elétricos, qual procedimento é obrigatório?",
      options: [
        "Trabalhar apenas com uma mão",
        "Desenergização, teste de ausência de tensão e aterramento",
        "Usar luvas de couro",
        "Avisar o supervisor"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Explique como você identifica e corrige uma falha em motor elétrico.",
      type: "text"
    }
  ],
  "Soldagem": [
    {
      id: 1,
      question: "Qual a diferença entre solda MIG e TIG?",
      options: [
        "Não há diferença",
        "MIG usa arame contínuo com gás, TIG usa eletrodo de tungstênio",
        "MIG é mais forte",
        "TIG não usa gás"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Por que é importante o pré-aquecimento em algumas soldas?",
      options: [
        "Para gastar tempo",
        "Evitar trincas e melhorar propriedades metalúrgicas",
        "Apenas para materiais finos",
        "Não é importante"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Descreva os principais defeitos que podem ocorrer em uma solda.",
      type: "text"
    }
  ],
  "Hidráulica": [
    {
      id: 1,
      question: "Qual a função de uma válvula de alívio em sistemas hidráulicos?",
      options: [
        "Decoração",
        "Proteger sistema contra sobrepressão",
        "Apenas controlar vazão",
        "Economizar óleo"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "O que causa cavitação em bombas hidráulicas?",
      options: [
        "Excesso de óleo",
        "Pressão de sucção muito baixa formando bolhas de vapor",
        "Temperatura alta",
        "Não existe cavitação"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Explique como você diagnostica vazamentos em circuitos hidráulicos.",
      type: "text"
    }
  ],
  "Pneumática": [
    {
      id: 1,
      question: "Qual a pressão típica de trabalho em sistemas pneumáticos industriais?",
      options: [
        "1 bar",
        "6 a 8 bar",
        "20 bar",
        "100 bar"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Por que é importante o tratamento do ar comprimido?",
      options: [
        "Não é importante",
        "Remover umidade, óleo e partículas que danificam componentes",
        "Apenas para parecer profissional",
        "Para aumentar pressão"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Descreva o funcionamento de um cilindro pneumático de dupla ação.",
      type: "text"
    }
  ],

  // Instrumentação
  "Instrumentação Industrial": [
    {
      id: 1,
      question: "O que significa a sigla PT-100?",
      options: [
        "Pressão de 100 bar",
        "Sensor de temperatura de platina com 100 ohms a 0°C",
        "Processo de tratamento",
        "Potência de 100W"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Qual a função de um transmissor de pressão?",
      options: [
        "Apenas mostrar a pressão",
        "Converter sinal de pressão em sinal elétrico padronizado (4-20mA)",
        "Aumentar a pressão",
        "Decoração"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Explique o procedimento de calibração de um instrumento de medição.",
      type: "text"
    }
  ],
  "Automação": [
    {
      id: 1,
      question: "O que é um sistema SCADA?",
      options: [
        "Um tipo de sensor",
        "Sistema de supervisão e aquisição de dados",
        "Um protocolo de comunicação",
        "Um tipo de válvula"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Qual a diferença entre malha aberta e malha fechada?",
      options: [
        "Não há diferença",
        "Malha fechada tem realimentação (feedback), malha aberta não",
        "Malha aberta é melhor",
        "Malha fechada é mais simples"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Descreva como funciona um controle PID básico.",
      type: "text"
    }
  ],
  "CLP": [
    {
      id: 1,
      question: "O que significa CLP?",
      options: [
        "Controle Lógico Programável",
        "Circuito Lógico Principal",
        "Computador de Lógica Pesada",
        "Central de Processamento"
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Qual linguagem é mais comum em programação de CLPs?",
      options: [
        "Python",
        "Ladder (Diagrama de Contatos)",
        "Java",
        "C++"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Explique a diferença entre entrada digital e entrada analógica em um CLP.",
      type: "text"
    }
  ],
  "Elétrica Industrial": [
    {
      id: 1,
      question: "Qual a função de um soft-starter?",
      options: [
        "Desligar motores",
        "Partida suave de motores reduzindo corrente de partida",
        "Apenas economizar energia",
        "Não tem função específica"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "O que é fator de potência?",
      options: [
        "Potência do motor",
        "Relação entre potência ativa e aparente",
        "Voltagem da rede",
        "Frequência da rede"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Descreva o procedimento para dimensionar um cabo elétrico.",
      type: "text"
    }
  ],

  // Segurança
  "NR-10": [
    {
      id: 1,
      question: "Qual a tensão limite entre baixa e alta tensão segundo NR-10?",
      options: [
        "220V",
        "1000V em CA e 1500V em CC",
        "380V",
        "13,8kV"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "O que é zona controlada em trabalhos com eletricidade?",
      options: [
        "Área de trabalho comum",
        "Área ao redor de parte energizada onde só pode entrar profissional autorizado",
        "Área administrativa",
        "Sala de controle"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Explique os 5 passos da desenergização segura.",
      type: "text"
    }
  ],
  "NR-35": [
    {
      id: 1,
      question: "A partir de qual altura é considerado trabalho em altura?",
      options: [
        "1 metro",
        "2 metros",
        "3 metros",
        "5 metros"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Quais os componentes obrigatórios de um sistema de proteção contra quedas?",
      options: [
        "Apenas o cinto",
        "Ponto de ancoragem, dispositivo de conexão e cinturão tipo paraquedista",
        "Capacete",
        "Luvas"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Descreva os cuidados na inspeção de equipamentos de proteção contra quedas.",
      type: "text"
    }
  ],
  "NR-33": [
    {
      id: 1,
      question: "O que caracteriza um espaço confinado?",
      options: [
        "Qualquer sala fechada",
        "Área não projetada para ocupação contínua com entrada/saída limitada",
        "Apenas tanques",
        "Elevadores"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Quais as principais medidas de segurança antes de entrar em espaço confinado?",
      options: [
        "Apenas avisar o supervisor",
        "PET, teste atmosférico, ventilação e vigia",
        "Usar capacete",
        "Levar lanterna"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Explique os principais riscos em espaços confinados.",
      type: "text"
    }
  ],
  "Gestão de Riscos": [
    {
      id: 1,
      question: "O que é uma APR (Análise Preliminar de Riscos)?",
      options: [
        "Documento financeiro",
        "Ferramenta para identificar e avaliar riscos antes da atividade",
        "Relatório final",
        "Procedimento de emergência"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Qual a hierarquia de controle de riscos?",
      options: [
        "EPIs sempre primeiro",
        "Eliminação, Substituição, Engenharia, Administrativa, EPI",
        "Apenas treinamento",
        "Não existe hierarquia"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Descreva como você realizaria uma análise de risco para uma tarefa específica.",
      type: "text"
    }
  ],
  "Primeiros Socorros": [
    {
      id: 1,
      question: "Qual a sequência correta de atendimento em primeiros socorros?",
      options: [
        "Avaliar vítima primeiro",
        "Avaliar cena, vítima e chamar ajuda",
        "Chamar ambulância apenas",
        "Mover a vítima imediatamente"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Qual a taxa de compressões por minuto em RCP (adulto)?",
      options: [
        "60 compressões",
        "100 a 120 compressões",
        "200 compressões",
        "Não importa"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Explique como proceder em caso de queimadura química.",
      type: "text"
    }
  ],
  "Segurança Industrial": [
    {
      id: 1,
      question: "O que é LOTO (Lockout/Tagout)?",
      options: [
        "Um jogo",
        "Procedimento de bloqueio e etiquetagem de energia",
        "Tipo de cadeado",
        "Sistema de alarme"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Qual a cor da sinalização de equipamentos de combate a incêndio?",
      options: [
        "Azul",
        "Vermelho",
        "Verde",
        "Amarelo"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Descreva os elementos essenciais de um Diálogo Diário de Segurança (DDS).",
      type: "text"
    }
  ],

  // Gestão
  "Leitura de Desenhos": [
    {
      id: 1,
      question: "O que indica uma linha tracejada em um desenho técnico?",
      options: [
        "Erro no desenho",
        "Linha oculta ou contorno não visível",
        "Linha de centro",
        "Linha de corte"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Para que serve a escala em um desenho?",
      options: [
        "Decoração",
        "Relação entre tamanho do desenho e tamanho real da peça",
        "Apenas para desenhos grandes",
        "Não é importante"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Explique o que são vistas ortogonais em um desenho técnico.",
      type: "text"
    }
  ],
  "Gestão de Projetos": [
    {
      id: 1,
      question: "O que é o caminho crítico em um projeto?",
      options: [
        "A parte mais cara",
        "Sequência de atividades que determina a duração mínima do projeto",
        "A atividade mais difícil",
        "O maior risco"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Quais são as principais áreas de conhecimento em gestão de projetos?",
      options: [
        "Apenas custo e prazo",
        "Escopo, Tempo, Custo, Qualidade, RH, Comunicação, Risco, Aquisições, Partes Interessadas",
        "Apenas planejamento",
        "Somente recursos humanos"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Descreva como você faria o acompanhamento de um projeto.",
      type: "text"
    }
  ],
  "Controle de Documentação": [
    {
      id: 1,
      question: "O que é rastreabilidade de documentos?",
      options: [
        "Guardar documentos",
        "Capacidade de identificar origem, localização e histórico do documento",
        "Numerar páginas",
        "Arquivar em ordem alfabética"
      ],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Por que é importante o controle de revisões de documentos?",
      options: [
        "Apenas burocracia",
        "Garantir uso de versão atualizada e histórico de alterações",
        "Para ocupar espaço",
        "Não é importante"
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "Explique como você organizaria um sistema de gestão documental.",
      type: "text"
    }
  ]
};

// Perguntas psicológicas universais
const psychologicalQuestions = [
  {
    id: 1,
    question: "Como você lida com situações de alta pressão ou emergência?",
    type: "text"
  },
  {
    id: 2,
    question: "Em uma escala de 1 a 5, qual seu nível de confiança nesta competência?",
    options: ["1 - Iniciante", "2 - Básico", "3 - Intermediário", "4 - Avançado", "5 - Especialista"],
    isScale: true
  },
  {
    id: 3,
    question: "Descreva uma situação onde você aplicou esta competência com sucesso.",
    type: "text"
  },
  {
    id: 4,
    question: "Como você reage quando recebe feedback sobre seu trabalho?",
    options: [
      "Fico na defensiva",
      "Aceito mas não mudo nada",
      "Escuto e avalio o feedback",
      "Aceito e implemento melhorias ativamente"
    ],
    correctAnswer: 3
  }
];

export function SkillAssessment({ skill, candidate, isOpen, onClose, onComplete }: SkillAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);

  // Resetar estados quando o modal é aberto/fechado
  useEffect(() => {
    if (!isOpen) {
      // Resetar após fechar
      const timeout = setTimeout(() => {
        setCurrentStep(0);
        setAnswers({});
        setShowResults(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Obter perguntas específicas para a competência
  const skillQuestions = technicalQuestions[skill] || [];
  const allQuestions = [...skillQuestions, ...psychologicalQuestions];
  const totalQuestions = allQuestions.length;

  const currentQuestion = allQuestions[currentStep] || allQuestions[0];
  const isLastQuestion = currentStep === totalQuestions - 1;
  const progress = totalQuestions > 0 ? ((currentStep + 1) / totalQuestions) * 100 : 0;

  const handleAnswer = (answer: any) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      calculateResults();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateResults = () => {
    let technicalScore = 0;
    let psychologicalScore = 0;
    let technicalCount = 0;
    let psychologicalCount = 0;

    // Calcular pontuação técnica
    skillQuestions.forEach(q => {
      if (q.type === "text") {
        // Para perguntas abertas, dar pontuação se foi respondida
        if (answers[q.id] && answers[q.id].trim().length > 10) {
          technicalScore += 100;
        }
        technicalCount += 1;
      } else if (q.correctAnswer !== undefined) {
        if (answers[q.id] === q.correctAnswer) {
          technicalScore += 100;
        }
        technicalCount += 1;
      }
    });

    // Calcular pontuação psicológica
    psychologicalQuestions.forEach(q => {
      if (q.type === "text") {
        if (answers[q.id] && answers[q.id].trim().length > 10) {
          psychologicalScore += 100;
        }
        psychologicalCount += 1;
      } else if (q.isScale) {
        // Para escala de 1-5, converter para percentual
        const scaleValue = answers[q.id] !== undefined ? answers[q.id] : 0;
        psychologicalScore += (scaleValue + 1) * 20; // Converte 0-4 para 20-100
        psychologicalCount += 1;
      } else if (q.correctAnswer !== undefined) {
        if (answers[q.id] === q.correctAnswer) {
          psychologicalScore += 100;
        }
        psychologicalCount += 1;
      }
    });

    const avgTechnical = technicalCount > 0 ? Math.round(technicalScore / technicalCount) : 0;
    const avgPsychological = psychologicalCount > 0 ? Math.round(psychologicalScore / psychologicalCount) : 0;
    const totalScore = Math.round((avgTechnical + avgPsychological) / 2);

    // Apenas mostrar resultados
    setShowResults(true);
  };

  const handleApprove = (approved: boolean) => {
    const result = {
      skill,
      candidateId: candidate.id,
      scores: {
        technical: calculateTechnicalScore(),
        psychological: calculatePsychologicalScore(),
        total: calculateTotalScore()
      },
      answers,
      completedAt: new Date().toISOString(),
      status: approved ? "approved" : "rejected"
    };
    onComplete(result);
  };



  const calculateTechnicalScore = () => {
    let technicalScore = 0;
    let technicalCount = 0;

    skillQuestions.forEach(q => {
      if (q.type === "text") {
        if (answers[q.id] && answers[q.id].trim().length > 10) {
          technicalScore += 100;
        }
        technicalCount += 1;
      } else if (q.correctAnswer !== undefined) {
        if (answers[q.id] === q.correctAnswer) {
          technicalScore += 100;
        }
        technicalCount += 1;
      }
    });

    return technicalCount > 0 ? Math.round(technicalScore / technicalCount) : 0;
  };

  const calculatePsychologicalScore = () => {
    let psychologicalScore = 0;
    let psychologicalCount = 0;

    psychologicalQuestions.forEach(q => {
      if (q.type === "text") {
        if (answers[q.id] && answers[q.id].trim().length > 10) {
          psychologicalScore += 100;
        }
        psychologicalCount += 1;
      } else if (q.isScale) {
        const scaleValue = answers[q.id] !== undefined ? answers[q.id] : 0;
        psychologicalScore += (scaleValue + 1) * 20;
        psychologicalCount += 1;
      } else if (q.correctAnswer !== undefined) {
        if (answers[q.id] === q.correctAnswer) {
          psychologicalScore += 100;
        }
        psychologicalCount += 1;
      }
    });

    return psychologicalCount > 0 ? Math.round(psychologicalScore / psychologicalCount) : 0;
  };

  const calculateTotalScore = () => {
    const technical = calculateTechnicalScore();
    const psychological = calculatePsychologicalScore();
    return Math.round((technical + psychological) / 2);
  };

  const resetAssessment = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  if (!isOpen) return null;

  // Se não houver perguntas para esta competência
  if (totalQuestions === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Avaliação Não Disponível</DialogTitle>
            <DialogDescription>
              Aluno: {candidate.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <p className="text-muted-foreground">
              Não há perguntas cadastradas para a competência <span className="text-secondary">{skill}</span>.
            </p>
            <Button onClick={onClose} className="mt-6">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showResults) {
    const technicalScore = calculateTechnicalScore();
    const psychologicalScore = calculatePsychologicalScore();
    const totalScore = calculateTotalScore();
    const isApproved = totalScore >= 70;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resultado da Avaliação</DialogTitle>
            <DialogDescription>
              Avaliação de competência: {skill}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
                totalScore >= 80 ? "bg-green-100" :
                totalScore >= 70 ? "bg-yellow-100" :
                "bg-red-100"
              }`}>
                <span className={`text-3xl ${
                  totalScore >= 80 ? "text-green-700" :
                  totalScore >= 70 ? "text-yellow-700" :
                  "text-red-700"
                }`}>
                  {totalScore}%
                </span>
              </div>
              <p className="mt-4">
                {totalScore >= 80 ? "Excelente desempenho!" :
                 totalScore >= 70 ? "Bom desempenho" :
                 totalScore >= 60 ? "Desempenho regular" :
                 "Necessita desenvolvimento"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Pontuação Técnica</p>
                <p className="text-2xl text-secondary">{technicalScore}%</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Pontuação Psicológica</p>
                <p className="text-2xl text-primary">{psychologicalScore}%</p>
              </Card>
            </div>

            <div className="space-y-3">
              <p className="text-sm">Aluno: <span className="text-secondary">{candidate.name}</span></p>
              <p className="text-sm">Competência Avaliada: <span className="text-secondary">{skill}</span></p>
            </div>

            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              isApproved ? "bg-green-100" : "bg-yellow-100"
            }`}>
              {isApproved ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-700" />
                  <div>
                    <p className="text-green-700">Pontuação acima de 70%</p>
                    <p className="text-sm text-green-600">Recomendado para aprovação</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6 text-yellow-700" />
                  <div>
                    <p className="text-yellow-700">Pontuação abaixo de 70%</p>
                    <p className="text-sm text-yellow-600">Avaliar se aprova ou requer nova tentativa</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleApprove(true)}
                className="flex-1 gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Aprovar Competência
              </Button>
              <Button
                onClick={() => handleApprove(false)}
                variant="destructive"
                className="flex-1 gap-2"
              >
                <XCircle className="w-4 h-4" />
                Não Aprovar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Avaliação de Competência</DialogTitle>
          <DialogDescription>
            Aluno: {candidate.name} | Competência: {skill}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Questão {currentStep + 1} de {totalQuestions}
              </span>
              <span className="text-secondary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question type badge */}
          <div className="flex items-center gap-2">
            <Badge variant={currentStep < skillQuestions.length ? "default" : "secondary"}>
              {currentStep < skillQuestions.length ? "Técnica" : "Psicológica"}
            </Badge>
          </div>

          {/* Question */}
          <div className="space-y-4">
            <h3 className="text-secondary">{currentQuestion.question}</h3>

            {currentQuestion.type === "text" ? (
              <Textarea
                placeholder="Digite sua resposta aqui..."
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                rows={5}
                className="w-full"
              />
            ) : currentQuestion.isScale ? (
              <RadioGroup
                value={answers[currentQuestion.id]?.toString()}
                onValueChange={(value) => handleAnswer(parseInt(value))}
              >
                {currentQuestion.options.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <RadioGroup
                value={answers[currentQuestion.id]?.toString()}
                onValueChange={(value) => handleAnswer(parseInt(value))}
              >
                {currentQuestion.options?.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            <Button
              onClick={handleNext}
              disabled={answers[currentQuestion.id] === undefined || 
                       (currentQuestion.type === "text" && (!answers[currentQuestion.id] || (typeof answers[currentQuestion.id] === 'string' && answers[currentQuestion.id].trim().length === 0)))}
              className="flex-1 gap-2"
            >
              {isLastQuestion ? "Finalizar Avaliação" : "Próxima"}
              {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

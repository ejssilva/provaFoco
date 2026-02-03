import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import SchemaOrg from "@/components/SchemaOrg";
import Header from "@/components/Header";

export default function QuestionDetail() {
  const [, params] = useRoute("/question/:id");
  const id = params ? parseInt(params.id) : 0;

  const { data: question, isLoading } = trpc.questions.getById.useQuery(id, {
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Questão não encontrada</h1>
        <Link href="/questions">
          <Button>Voltar para Questões</Button>
        </Link>
      </div>
    );
  }

  // Schema.org for Q&A Page
  const schema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: `Questão de ${question.category || "Concurso"} - ${question.bank || "Banca"}`,
      text: question.questionText,
      answerCount: 1,
      upvoteCount: 0,
      dateCreated: question.createdAt,
      author: {
        "@type": "Organization",
        name: question.bank || "Banca Examinadora",
      },
      acceptedAnswer: {
        "@type": "Answer",
        text: question.explanation || "Resposta disponível no portal.",
        upvoteCount: 0,
        url: `https://provafoco.com.br/question/${question.id}`,
        author: {
          "@type": "Organization",
          name: "Prova Foco",
        },
      },
    },
  };

  const title = `Questão ${question.id} - ${question.category} | Prova Foco`;
  const description = `Resolva esta questão de ${question.category} da banca ${question.bank}. ${question.questionText.substring(0, 150)}...`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={title}
        description={description}
        canonicalUrl={`https://provafoco.com.br/question/${question.id}`}
      />
      <SchemaOrg schema={schema} />
      
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/questions">
          <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Questões
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                {question.category}
              </span>
              <span className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                {question.bank}
              </span>
              <span className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded-full">
                {question.difficulty}
              </span>
              <span className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded-full">
                {question.year}
              </span>
            </div>
            <CardTitle className="text-xl leading-relaxed">
              {question.questionText}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {["a", "b", "c", "d", "e"].map((opt) => {
                const text = question.alternatives[opt as keyof typeof question.alternatives];
                if (!text) return null;
                
                return (
                  <div
                    key={opt}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors flex gap-3"
                  >
                    <span className="font-bold uppercase text-muted-foreground">
                      {opt})
                    </span>
                    <span>{text}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 pt-6 border-t">
              <h3 className="font-semibold mb-2">Gabarito e Explicação</h3>
              <p className="text-muted-foreground italic">
                Para ver a resposta e explicação detalhada, acesse o modo de resolução.
              </p>
              <Link href="/questions">
                <Button className="mt-4 w-full md:w-auto">
                  Resolver Agora
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

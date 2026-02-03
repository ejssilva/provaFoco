import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { ArrowRight, BookOpen, BarChart3, Zap, Target, Users, Award, TrendingUp, Scale } from "lucide-react";
import SEO from "@/components/SEO";
import AdDisplay from "@/components/AdDisplay";

import Header from "@/components/Header";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <SEO
        title="Prova Foco - Questões de Concurso Público | CESPE, FGV, FCC"
        description="Portal de questões de concursos públicos com milhares de questões comentadas. Prepare-se para CESPE, FGV, FCC, Vunesp e outras bancas. Resolução de questões grátis."
        keywords="questões de concurso, simulado concurso, provas concurso, questões comentadas, cespe, fgv, fcc, concurso público"
        ogImage="https://provafoco.com.br/og-image.jpg"
        canonicalUrl="https://provafoco.com.br"
      />

      <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
        <Header />
        <AdDisplay placement="header_banner" className="bg-muted/50" />
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center animate-slide-up">
               <h1 className="text-5xl md:text-6xl font-bold gradient-text text-center mb-8">
                 Prova Foco
               </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Prepare-se para seus concursos com milhares de questões de qualidade,
                feedback imediato e estatísticas detalhadas de desempenho.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <>
                    <Link href="/questions">
                      <Button size="lg" className="w-full sm:w-auto">
                        Começar a Responder
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/stats">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto">
                        Ver Estatísticas
                      </Button>
                    </Link>
                    {user.role === "admin" && (
                      <Link href="/admin">
                        <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                          Painel Admin
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <Link href="/questions">
                      <Button size="lg" className="w-full sm:w-auto">
                        Começar a Responder Agora
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/admin/login">
                       <Button size="lg" variant="ghost" className="w-full sm:w-auto text-muted-foreground">
                        Área Administrativa
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">
              Por que escolher nosso portal?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: BookOpen,
                  title: "Milhares de Questões",
                  description: "Questões de diversas bancas, matérias e níveis de dificuldade",
                },
                {
                  icon: Zap,
                  title: "Feedback Imediato",
                  description: "Saiba se acertou ou errou com explicações detalhadas",
                },
                {
                  icon: BarChart3,
                  title: "Estatísticas Completas",
                  description: "Acompanhe seu progresso com gráficos e análises",
                },
                {
                  icon: Target,
                  title: "Modo Simulado",
                  description: "Pratique com tempo limitado como em provas reais",
                },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="card-elegant p-6 text-center hover:shadow-lg transition-all duration-300"
                  >
                    <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-muted/50 border-t border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">
              Matérias Disponíveis
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Português",
                  description: "Interpretação de texto, gramática, ortografia e redação",
                  icon: BookOpen,
                  color: "bg-red-50 border-red-200",
                },
                {
                  title: "Raciocínio Lógico",
                  description: "Aritmética, álgebra, geometria e lógica matemática",
                  icon: TrendingUp,
                  color: "bg-blue-50 border-blue-200",
                },
                {
                  title: "Legislação",
                  description: "Constitucional, Administrativo e Leis Específicas",
                  icon: Scale,
                  color: "bg-green-50 border-green-200",
                },
                {
                  title: "Informática",
                  description: "Sistemas operacionais, redes, segurança e programação",
                  icon: Award,
                  color: "bg-purple-50 border-purple-200",
                },
              ].map((category, idx) => {
                const Icon = category.icon;
                return (
                  <div
                    key={idx}
                    className={`p-8 rounded-lg border-2 ${category.color}`}
                  >
                    <Icon className="w-10 h-10 mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { number: "36+", label: "Questões Disponíveis" },
                { number: "3", label: "Bancas Examinadoras" },
                { number: "4", label: "Matérias Disponíveis" },
              ].map((stat, idx) => (
                <div key={idx}>
                  <p className="text-4xl font-bold gradient-text mb-2">{stat.number}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!user && (
          <section className="py-20 bg-primary/5 border-t border-border">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Acesse agora e comece a resolver questões de concurso com nosso portal elegante
                e intuitivo.
              </p>
              <Link href="/questions">
                <Button size="lg">
                  Começar a Responder Agora
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-border py-8 mt-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-4">Sobre</h3>
                <p className="text-sm text-muted-foreground">
                  Portal completo para preparação de concursos públicos.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Matérias</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li><a href="#" className="hover:text-foreground">Português</a></li>
                  <li><a href="#" className="hover:text-foreground">Raciocínio Lógico</a></li>
                  <li><a href="#" className="hover:text-foreground">Legislação</a></li>
                  <li><a href="#" className="hover:text-foreground">Informática</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Bancas</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li><a href="#" className="hover:text-foreground">CESPE</a></li>
                  <li><a href="#" className="hover:text-foreground">FCC</a></li>
                  <li><a href="#" className="hover:text-foreground">FGV</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li><a href="#" className="hover:text-foreground">Privacidade</a></li>
                  <li><a href="#" className="hover:text-foreground">Termos</a></li>
                  <li><a href="#" className="hover:text-foreground">Contato</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
              <p>&copy; 2026 Portal de Questões para Concursos. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
        <AdDisplay placement="footer" className="container mx-auto px-4" />
      </div>
    </>
  );
}

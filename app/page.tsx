
import Hero from "@/components/Hero";
import { Mail, Linkedin, Github } from "lucide-react";

export default async function Home() {

  const solutions = [
    {
      title: 'Gerenciamento de Finanças Pessoais',
      description: 'Monitore facilmente sua renda, despesas e orçamentos, obtendo insights para otimizar sua saúde financeira.'
    },
    {
      title: 'Engaje com a Comunidade',
      description: 'Participe de um fórum financeiro vibrante onde você pode postar, comentar, curtir e compartilhar conhecimento com outros usuários.'
    },
    {
      title: 'Plataforma de Estudos',
      description: 'Descubra uma comunidade de aprendizado colaborativo onde você pode compartilhar conhecimento, ensinar e aprender, fortalecendo ainda mais suas habilidades e expandindo seus horizontes.'
    }    
  ];

  const socials = [
    {
      icon: Mail,
      title: "Email",
      link: "mailto:arthur.cristo.dev@gmail.com",
      description: "Entre em contato comigo por Email",
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      link: "https://www.linkedin.com/in/arthur-cristo",
      description: "Conecte-se comigo no LinkedIn",
    },
    {
      icon: Github,
      title: "GitHub",
      link: "https://github.com/arthur-cristo",
      description: "Confira meus projetos no GitHub",
    },
  ];

  return (
    <>
      <Hero />
      <section id="about" className="py-16">
        <div className="container mx-auto text-center space-y-8 justify-center">
          <h2 className="text-4xl font-bold capitalize">Sobre Nós</h2>
          <p className="text-lg text-muted-foreground px-8 max-w-[800px] mx-auto">
            Com <span className="text-primary">Athlas</span>, você pode facilmente criar sua conta e entrar no mundo dos negócios. 
            A plataforma oferece uma experiência envolvente para aprender, gerenciar e aprimorar suas habilidades financeiras em um ambiente sem riscos.<br /><br />
            Nossa missão é tornar a educação financeira acessível e agradável para todos. Nossa visão é capacitar pessoas ao redor do mundo a alcançar a liberdade financeira.
          </p>
        </div>
      </section>
      <section id="solutions" className="py-16">
        <div className="text-center space-y-8 w-screen">
          <h2 className="text-4xl font-bold capitalize mx-auto">Nossas Soluções</h2>
          <div className="grid md:grid-cols-3 gap-8 bg-muted w-screen px-8 py-6">
            {solutions.map((solution) => (
              <div key={solution.title} className="bg-card rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold">{solution.title}</h3>
                <p className="text-muted-foreground mt-2">{solution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="contact" className="py-16">
        <div className="container mx-auto px-8 md:px-3 text-center space-y-8">
          <h2 className="text-4xl font-bold capitalize">Contato</h2>
          <p className="text-lg text-muted-foreground max-w-[800px] mx-auto">
            Sinta-se à vontade para se conectar comigo por meio de qualquer uma das plataformas abaixo.
          </p>
          <div className="flex flex-col justify-center items-center gap-8">
            {socials.map((social) => (
              <a
                key={social.title}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center w-72 rounded-md p-2 hover:shadow-xl transition-shadow text-left"
              >
                <social.icon className="h-12 w-12 text-primary" />
                <div className="flex flex-col ml-2">
                  {/* <h3 className="text-xl font-semibold">{social.title}</h3> */}
                  <p className="text-muted-foreground mt-2 ml-2">
                    {social.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

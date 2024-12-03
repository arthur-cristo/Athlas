import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { Mail, Linkedin, Github } from "lucide-react";

export default async function Home() {

  const solutions = [
    {
      title: 'Personal Finance Management',
      description: 'Effortlessly track your income, expenses, and budgets, and gain insights to optimize your financial health.'
    },
    {
      title: 'Engage with the Community',
      description: 'Join a vibrant financial forum where you can post, comment, like, and share knowledge with fellow users.'
    },
    {
      title: 'Coming Soon: Virtual Trading',
      description: 'Hone your trading skills in a lifelike simulation environment, completely risk-free and educational.'
    },
  ];

  const socials = [
    {
      icon: Mail,
      title: "Email",
      link: "mailto:arthur.cristo.dev@gmail.com",
      description: "Reach out to me via email",
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      link: "https://www.linkedin.com/in/arthur-cristo",
      description: "Connect with me on LinkedIn",
    },
    {
      icon: Github,
      title: "GitHub",
      link: "https://github.com/arthur-cristo",
      description: "Explore my projects on GitHub",
    },
  ];

  return (
    <div className="overflow-hidden">
      <Header />
      <Hero />
      <section id="about" className="py-16">
        <div className="container mx-auto text-center space-y-8 justify-center">
          <h2 className="text-4xl font-bold capitalize">About Us</h2>
          <p className="text-lg text-muted-foreground px-8 max-w-[800px] mx-auto">
            At <span className="text-primary">Athlas</span>, we are committed to empowering individuals to master their finances.
            The platform offers a seamless and engaging experience for learning, managing, and growing your financial skills in a risk-free environment.<br /><br />
            Our mission is to make financial literacy accessible and enjoyable for everyone, and our vision is to empower people worldwide to achieve financial freedom.
          </p>
        </div>
      </section>
      <section id="solutions" className="py-16">
        <div className="text-center space-y-8 w-screen">
          <h2 className="text-4xl font-bold capitalize mx-auto">Our Solutions</h2>
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
          <h2 className="text-4xl font-bold capitalize">Contact</h2>
          <p className="text-lg text-muted-foreground max-w-[800px] mx-auto">
            Feel free to connect with me through any of the platforms below.
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
                  <h3 className="text-xl font-semibold">{social.title}</h3>
                  <p className="text-muted-foreground mt-2 text-center">
                    {social.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

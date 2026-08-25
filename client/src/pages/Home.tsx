// Atelier Industrial — página de catálogo editorial da Lytex. Este arquivo mantém a composição assimétrica, o contraste preto/grafite/branco e o CTA verde-lima como assinatura.
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleArrowOutUpRight,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  X,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

const asset = "/manus-storage";
const whatsappUrl =
  "https://wa.me/5519996220753?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Lytex%20e%20gostaria%20de%20solicitar%20um%20or%C3%A7amento.";

const categories = [
  { id: "todos", label: "Todos" },
  { id: "uniformes", label: "Uniformes" },
  { id: "camisetas", label: "Camisetas" },
  { id: "saude", label: "Área da saúde" },
  { id: "brim", label: "BRIM" },
];

const gallery = [
  {
    id: "dolma",
    category: "uniformes",
    tag: "01 / Uniformes",
    title: "Dolmã",
    description: "Modelagem precisa para equipes de cozinha, atendimento e hospitalidade.",
    image: `${asset}/lytex-dolma-enhanced_3bcce8e2.png`,
    tone: "dark",
  },
  {
    id: "jalecos",
    category: "uniformes",
    tag: "02 / Uniformes",
    title: "Jalecos",
    description: "Presença profissional para ambientes que pedem conforto e confiança.",
    image: `${asset}/page-002_44f33275.png`,
    tone: "light",
  },
  {
    id: "camiseta-navy",
    category: "camisetas",
    tag: "03 / Camisetas",
    title: "Malha que comunica",
    description: "Malha penteada, PV e algodão com Silk Screen, DTF ou sublimação.",
    image: `${asset}/page-004_036fbd9e.png`,
    tone: "dark",
  },
  {
    id: "camiseta-estampa",
    category: "camisetas",
    tag: "04 / Camisetas",
    title: "Sua marca em foco",
    description: "Peças pensadas para divulgação, padronização e reconhecimento.",
    image: `${asset}/page-005_ce4cc1ef.png`,
    tone: "light",
  },
  {
    id: "polo",
    category: "uniformes",
    tag: "05 / Polo",
    title: "Camisa Polo",
    description: "Piquet, PA ou malha, com estampas e bordados de acabamento limpo.",
    image: `${asset}/lytex-polo-enhanced_0de41434.png`,
    tone: "dark",
  },
  {
    id: "polo-white",
    category: "uniformes",
    tag: "06 / Polo",
    title: "Base versátil",
    description: "Uma mesma linguagem visual para diferentes funções e equipes.",
    image: `${asset}/page-008_2ba28777.png`,
    tone: "light",
  },
  {
    id: "health",
    category: "saude",
    tag: "07 / Saúde",
    title: "Linha hospitalar",
    description: "Pijamas cirúrgicos em Oxford e Gabardine, com caimento funcional.",
    image: `${asset}/lytex-health-enhanced_0e72eced.png`,
    tone: "light",
  },
  {
    id: "brim",
    category: "brim",
    tag: "08 / BRIM",
    title: "Segurança em evidência",
    description: "Jaquetas e calças em BRIM, com faixas refletivas para a rotina industrial.",
    image: `${asset}/lytex-brim-enhanced_068383c8.png`,
    tone: "dark",
  },
  {
    id: "casual",
    category: "camisetas",
    tag: "09 / Varejo",
    title: "Produção para marcas",
    description: "Parcerias para varejo, e-commerce e vendas no atacado.",
    image: `${asset}/page-022_068b846f.png`,
    tone: "light",
  },
];

const proofPoints = [
  "Confecção desde 2018",
  "Uniformes industriais",
  "Atendimento em Limeira — SP",
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const { data: portfolioItems } = trpc.portfolio.list.useQuery();
  const [activeCategory, setActiveCategory] = useState("todos");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<(typeof gallery)[number] | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const catalogItems = useMemo(() => {
    if (!portfolioItems?.length) return gallery;
    return portfolioItems.map((item, index) => ({
      id: item.slug,
      category: item.category,
      tag: item.tag,
      title: item.title,
      description: item.description,
      image: item.imageUrl,
      tone: index % 2 === 0 ? "dark" : "light",
    }));
  }, [portfolioItems]);

  const visibleGallery = useMemo(
    () =>
      activeCategory === "todos"
        ? catalogItems
        : catalogItems.filter((item) => item.category === activeCategory),
    [activeCategory, catalogItems],
  );

  const openWhatsApp = () => window.open(whatsappUrl, "_blank", "noopener,noreferrer");

  return (
    <div className="lytex-page">
      <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
        <a className="brand-lockup" href="#top" aria-label="Lytex — início">
          <span className="brand-mark-wrap">
            <img src={`${asset}/lytex-mark_e8fe64b5.png`} alt="" className="brand-mark" />
          </span>
          <span className="brand-wordmark">LYTEX</span>
          <span className="brand-descriptor">CONFECÇÃO<br />& UNIFORMES</span>
        </a>

        <nav className={`main-nav ${mobileMenuOpen ? "main-nav--open" : ""}`} aria-label="Navegação principal">
          <button onClick={() => { scrollToId("colecao"); setMobileMenuOpen(false); }}>Coleção</button>
          <button onClick={() => { scrollToId("sobre"); setMobileMenuOpen(false); }}>A Lytex</button>
          <button onClick={() => { scrollToId("atendimento"); setMobileMenuOpen(false); }}>Atendimento</button>
          <button onClick={() => { scrollToId("contato"); setMobileMenuOpen(false); }}>Contato</button>
        </nav>

        <div className="header-actions">
          <span className="header-city">Limeira, SP</span>
          <button className="header-whatsapp" onClick={openWhatsApp} aria-label="Falar com a Lytex pelo WhatsApp">
            <MessageCircle size={17} strokeWidth={2.4} />
            <span>Falar agora</span>
          </button>
          <button className="menu-toggle" onClick={() => setMobileMenuOpen((open) => !open)} aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}>
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-image-wrap">
            <img className="hero-image" src={`${asset}/lytex-hero-atelier_75d2a2db.jpg`} alt="Máquina de costura trabalhando em um tecido escuro" />
            <div className="hero-image-shade" />
          </div>
          <div className="hero-grid-line hero-grid-line--one" />
          <div className="hero-grid-line hero-grid-line--two" />
          <div className="hero-content">
            <p className="eyebrow light-eyebrow"><span className="eyebrow-dot" /> Desde 2018 · Limeira, SP</p>
            <h1>Uniformes que<br /><em>trabalham</em><br />pela sua marca.</h1>
            <p className="hero-intro">Confecção de peças profissionais para equipes, operações e marcas que querem vestir presença.</p>
            <div className="hero-actions">
              <button className="button button--lime" onClick={() => scrollToId("colecao")}>
                Ver coleção <ArrowDownRight size={18} />
              </button>
              <button className="text-link text-link--light" onClick={() => scrollToId("sobre")}>
                Conheça a Lytex <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <div className="hero-side-note">
            <span>01</span>
            <span className="hero-side-rule" />
            <span>CATÁLOGO<br />DIGITAL</span>
          </div>
          <div className="hero-bottom-bar">
            <div className="hero-bottom-copy">Do corte ao acabamento, uma cadeia feita para a sua rotina.</div>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="hero-bottom-cta">Solicite um orçamento <CircleArrowOutUpRight size={17} /></a>
          </div>
        </section>

        <section id="sobre" className="intro-section section-padding">
          <div className="intro-left">
            <p className="eyebrow"><span className="eyebrow-dot" /> Muito prazer</p>
            <h2>Feito para o<br /><em>seu ritmo.</em></h2>
          </div>
          <div className="intro-center">
            <p className="lead-copy">Somos a LYTEX, uma confecção especializada em roupas profissionais, uniformes industriais e peças para marcas.</p>
            <p className="body-copy">Desde 2018, transformamos tecido em presença: soluções que respeitam o movimento de cada equipe, o posicionamento de cada negócio e a exigência de cada rotina.</p>
            <button className="text-link" onClick={() => scrollToId("atendimento")}>Como podemos atender <ArrowRight size={16} /></button>
          </div>
          <div className="intro-image-block">
            <img src={`${asset}/lytex-textile-detail_7439d4aa.jpg`} alt="Tecidos de uniformes em tons de grafite e branco" />
            <span className="image-caption">Matéria · cuidado · precisão</span>
          </div>
        </section>

        <section id="colecao" className="collection-section section-padding">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow"><span className="eyebrow-dot" /> Portfólio de produtos</p>
              <h2>Uma coleção para<br /><em>cada contexto.</em></h2>
            </div>
            <div className="section-heading-aside">
              <span>02 / 09</span>
              <p>Explore as categorias e encontre o ponto de partida para o próximo uniforme da sua equipe.</p>
            </div>
          </div>

          <div className="category-tabs" role="tablist" aria-label="Filtrar categorias">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-tab ${activeCategory === category.id ? "category-tab--active" : ""}`}
                onClick={() => setActiveCategory(category.id)}
                role="tab"
                aria-selected={activeCategory === category.id}
              >
                {category.label}
                {activeCategory === category.id && <Check size={14} />}
              </button>
            ))}
          </div>

          <div className="gallery-grid" key={activeCategory}>
            {visibleGallery.map((item, index) => (
              <article className={`gallery-card gallery-card--${item.tone} ${index % 5 === 1 ? "gallery-card--tall" : ""}`} key={item.id}>
                <button className="gallery-image-button" onClick={() => setSelectedImage(item)} aria-label={`Ampliar foto: ${item.title}`}>
                  <img src={item.image} alt={item.title} />
                  <span className="gallery-hover"><Plus size={19} /></span>
                </button>
                <div className="gallery-card-info">
                  <span className="gallery-tag">{item.tag}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <button className="gallery-detail" onClick={() => setSelectedImage(item)}>Ver detalhe <ArrowRight size={15} /></button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="feature-section">
          <div className="feature-image-column">
            <img src={`${asset}/lytex-sewing-enhanced_3a8bbb1f.png`} alt="Detalhe de uma máquina de costura trabalhando" />
            <div className="feature-image-label">03 <span /> dentro da oficina</div>
          </div>
          <div className="feature-copy-column">
            <p className="eyebrow light-eyebrow"><span className="eyebrow-dot" /> A diferença está no detalhe</p>
            <h2>Acabamento que<br /><em>fica na memória.</em></h2>
            <p>Conforto não é um extra. É o ponto de partida para peças que acompanham jornadas inteiras, sem perder o corte, a identidade ou a intenção.</p>
            <div className="feature-points">
              {proofPoints.map((point) => <div key={point} className="feature-point"><Check size={16} /> {point}</div>)}
            </div>
            <button className="button button--outline-light" onClick={openWhatsApp}>Fale sobre seu projeto <ArrowRight size={17} /></button>
          </div>
        </section>

        <section id="atendimento" className="service-section section-padding">
          <div className="service-heading">
            <p className="eyebrow"><span className="eyebrow-dot" /> Para quem precisa vestir</p>
            <h2>Da operação<br />ao <em>varejo.</em></h2>
          </div>
          <div className="service-content">
            <p className="lead-copy">A Lytex atende empresas, marcas de loja, equipes industriais e negócios que precisam transformar uma ideia em uma peça pronta para circular.</p>
            <div className="service-list">
              <div className="service-list-item"><span>01</span><div><strong>Uniformes industriais</strong><p>Resistência, padronização e visibilidade para a rotina de trabalho.</p></div><ArrowRight size={18} /></div>
              <div className="service-list-item"><span>02</span><div><strong>Saúde e atendimento</strong><p>Jalecos, pijamas cirúrgicos, dolmãs e linha hospitalar completa.</p></div><ArrowRight size={18} /></div>
              <div className="service-list-item"><span>03</span><div><strong>Marcas e e-commerce</strong><p>Produção para varejo, parcerias e vendas no atacado.</p></div><ArrowRight size={18} /></div>
            </div>
            <button className="text-link" onClick={openWhatsApp}>Vamos conversar sobre a sua demanda <ArrowRight size={16} /></button>
          </div>
        </section>

        <section className="contact-band" id="contato">
          <div className="contact-band-mark"><img src={`${asset}/lytex-mark_e8fe64b5.png`} alt="" /></div>
          <div className="contact-band-copy">
            <p className="eyebrow light-eyebrow"><span className="eyebrow-dot" /> Próximo passo</p>
            <h2>Vamos fazer<br /><em>acontecer?</em></h2>
            <p>Conte o que sua equipe precisa. A gente ajuda a transformar em peça.</p>
            <button className="button button--lime" onClick={openWhatsApp}><MessageCircle size={18} /> Chamar no WhatsApp</button>
          </div>
          <div className="contact-band-details">
            <div className="contact-qr-block"><img src={`${asset}/lytex-whatsapp-qr_a9359bfe.png`} alt="QR Code para falar com a Lytex pelo WhatsApp" /><span>Aponte a câmera<br />para falar conosco</span></div>
            <div className="contact-detail"><Phone size={17} /><a href="tel:+5519996220753">(19) 99622-0753</a></div>
            <div className="contact-detail"><Mail size={17} /><a href="mailto:comercial@Lytexconfeccoes.onmicrosoft.com">comercial@Lytexconfeccoes.onmicrosoft.com</a></div>
            <div className="contact-detail"><MapPin size={17} /><span>Limeira — SP</span></div>
            <div className="contact-social"><a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={18} /></a><a href="mailto:comercial@Lytexconfeccoes.onmicrosoft.com" aria-label="E-mail"><Mail size={18} /></a><a href="#top" aria-label="Voltar ao início"><ChevronUpIcon /></a></div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>LYTEX · CONFECÇÃO E UNIFORMES INDUSTRIAIS</span>
        <span>© {new Date().getFullYear()} · Limeira, SP</span>
        <button onClick={() => scrollToId("top")}>Voltar ao topo <ArrowRight size={15} /></button>
      </footer>

      <a className="floating-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Falar pelo WhatsApp">
        <MessageCircle size={23} />
        <span>WhatsApp</span>
      </a>

      {selectedImage && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Detalhe de ${selectedImage.title}`} onClick={() => setSelectedImage(null)}>
          <div className="lightbox-inner" onClick={(event) => event.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedImage(null)} aria-label="Fechar imagem"><X size={22} /></button>
            <img src={selectedImage.image} alt={selectedImage.title} />
            <div className="lightbox-caption"><span>{selectedImage.tag}</span><strong>{selectedImage.title}</strong><p>{selectedImage.description}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronUpIcon() {
  return <ChevronDown size={18} className="rotate-180" />;
}

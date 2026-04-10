import Link from 'next/link';

const sections = [
  {
    id: '1',
    title: 'Hardware e Eletrônica',
    subtitle: 'O Alicerce Físico da Tecnologia',
    overview:
      'Esta área é o coração físico de qualquer projeto. Sem o hardware, o software é apenas uma abstração. Os membros desta área focam em entender como os elétrons se movem, como os sinais se propagam pelo ar e como transformar conceitos lógicos em placas de circuito impresso (PCBs) ou sintetizá-los dentro de chips reconfiguráveis usando linguagens de descrição de hardware.',
    focus: [
      {
        topic: 'Análise de Circuitos',
        description: 'Corrente contínua e alternada, filtros passivos/ativos, amplificadores operacionais.',
        bibliography: 'Engineering Circuit Analysis — William H. Hayt, Jack E. Kemmerly, Steven M. Durbin',
      },
      {
        topic: 'Lógica Digital e HDLs (Foco em Verilog)',
        description:
          'Diferente de linguagens de programação de software (como C ou Python), o Verilog é uma Linguagem de Descrição de Hardware (HDL). Aqui, estuda-se como escrever códigos que descrevem a arquitetura física e o comportamento de portas lógicas, flip-flops e máquinas de estado. Esse "código" é então sintetizado para criar circuitos físicos reais dentro de FPGAs (Field Programmable Gate Arrays).',
        bibliography: 'Digital Design and Computer Architecture — David Money Harris & Sarah L. Harris',
      },
      {
        topic: 'Telecomunicações e RF',
        description: 'Propagação de ondas, antenas, modulação e transceptores wireless.',
        bibliography: 'Wireless Communications: Principles and Practice — Theodore S. Rappaport',
      },
    ],
    skills: [
      'Desenvolvimento em Linguagens de Descrição de Hardware (Verilog/VHDL) e síntese de circuitos lógicos em FPGAs.',
      'Uso de instrumentação de laboratório (Osciloscópios, Multímetros, Analisadores de Espectro).',
      'Prototipação em protoboard e design avançado de PCBs em softwares como Altium, KiCad ou Eagle.',
      'Soldagem SMD/PTH e montagem de componentes.',
    ],
    profile:
      'Ideal para estudantes que gostam de colocar a mão na massa, não têm medo de queimar componentes e sentem fascínio por eletrônica analógica, telecomunicações e pelo poder de desenhar seus próprios chips digitais usando FPGAs e Verilog.',
  },
  {
    id: '2',
    title: 'Arquitetura e Sistemas de Baixo Nível',
    subtitle: 'A Ponte entre o Silício e o Código',
    overview:
      'Esta área desmistifica o que acontece entre a compilação de um código e a execução elétrica. É o estudo de como os processadores são desenhados por dentro e como o Sistema Operacional atua como o grande maestro dos recursos de hardware.',
    focus: [
      {
        topic: 'Arquitetura de Computadores',
        description: 'Pipelines, hierarquia de memória (Cache, RAM), e conjunto de instruções (ISA), com forte foco em RISC-V ou ARM.',
        bibliography: 'Computer Organization and Design: The Hardware/Software Interface — David A. Patterson & John L. Hennessy',
      },
      {
        topic: 'Linguagem de Máquina',
        description: 'Programação em Assembly para extrair o máximo de performance de cada ciclo de clock.',
        bibliography: 'Programming from the Ground Up — Jonathan Bartlett',
      },
      {
        topic: 'Sistemas Operacionais',
        description: 'Construção de kernels, gerenciamento de processos, memória virtual e concorrência.',
        bibliography: 'Operating Systems: Three Easy Pieces (OSTEP) — Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau',
      },
    ],
    skills: [
      'Leitura e escrita de código Assembly.',
      'Desenvolvimento e compilação de módulos de Kernel (ex: Linux Drivers).',
      'Benchmarking extremo e otimização de tempo de execução (profiling de CPU e Memória).',
    ],
    profile:
      'Feito para os curiosos que nunca se contentam com bibliotecas prontas. Estudantes que gostam de entender o porquê as coisas funcionam, apaixonados por Linux, segurança de hardware e otimização extrema.',
  },
  {
    id: '3',
    title: 'Engenharia de Sistemas Embarcados',
    subtitle: 'A Inteligência das Máquinas Cotidianas',
    overview:
      'Sistemas embarcados estão em todos os lugares: do freio ABS de um carro ao micro-ondas, passando por smartwatches e satélites. Esta área foca em escrever o firmware (software duro) que roda em microcontroladores restritos, interagindo diretamente com sensores e atuadores no mundo real.',
    focus: [
      {
        topic: 'Microcontroladores (Bare-Metal)',
        description: 'Manipulação direta de registradores, interrupções (ISRs) e periféricos como I2C, SPI, UART, ADC e PWM.',
        bibliography: 'Embedded Systems: Introduction to Arm® Cortex™-M Microcontrollers — Jonathan Valvano',
      },
      {
        topic: 'Sistemas Operacionais de Tempo Real (RTOS)',
        description: 'Escalonamento determinístico, semáforos, mutexes e filas em sistemas onde o tempo de resposta é crítico.',
        bibliography: 'Real-Time Concepts for Embedded Systems — Qing Li & Caroline Yao',
      },
    ],
    skills: [
      'Programação avançada em C e C++ embarcado.',
      'Configuração e arquitetura de sistemas com FreeRTOS, Zephyr ou Mbed OS.',
      'Análise de consumo energético (Low Power) e integração com sensores de hardware.',
    ],
    profile:
      'Para aqueles que querem ver seu código gerar impacto físico imediato (como girar um motor ou acender um display). Exige muita paciência para debugar problemas que podem ser tanto de software quanto de hardware.',
  },
  {
    id: '4',
    title: 'Ciência da Computação',
    subtitle: 'A Arquitetura Lógica e Conectividade',
    overview:
      'Quando os sistemas embarcados e de hardware começam a crescer, eles precisam de códigos bem estruturados, algoritmos eficientes e conectividade com a internet. Esta área foca nas melhores práticas de engenharia de software aplicadas a dispositivos (Edge e Fog Computing), garantindo que os dados fluam perfeitamente do sensor até a nuvem.',
    focus: [
      {
        topic: 'Algoritmos e Estruturas de Dados',
        description: 'Otimização de tempo e espaço (Big-O) para operar em memórias restritas.',
        bibliography: 'Introduction to Algorithms — Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest & Clifford Stein',
      },
      {
        topic: 'Design de Software',
        description: 'Programação Orientada a Objetos (OOP) e Design Patterns adaptados para C++ ou MicroPython.',
        bibliography: 'Object-Oriented Design & Patterns — Cay S. Horstmann',
      },
      {
        topic: 'Redes e IoT',
        description: 'Protocolos de comunicação (TCP/UDP, MQTT, CoAP, HTTP) e topologias de rede.',
        bibliography: 'Computer Networking: A Top-Down Approach — James F. Kurose & Keith W. Ross',
      },
    ],
    skills: [
      'Criação de código limpo, modular e altamente escalável.',
      'Implementação de servidores e clientes em dispositivos IoT (ex: Gateways ESP32 ou Raspberry Pi).',
      'Análise de complexidade computacional e testes unitários.',
    ],
    profile:
      'Estudantes que amam lógica de programação, arquitetura de software e conectividade. É a área ideal para quem quer ser a ponte entre os dispositivos de hardware (Edge) e os servidores em nuvem (Cloud).',
  },
  {
    id: '5',
    title: 'Matemática Aplicada e Sistemas Inteligentes',
    subtitle: 'O Cérebro Analítico e Preditivo',
    overview:
      'Sistemas modernos não apenas reagem, eles prevêem. Esta área transforma ruído em informação útil e cria comportamentos autônomos. É onde o hardware encontra a inteligência artificial e a teoria de controle para criar robôs, estabilizar drones ou prever falhas industriais.',
    focus: [
      {
        topic: 'Fundamentos Matemáticos',
        description: 'Álgebra Linear e cálculo avançado para manipulação de tensores e estados espaciais.',
        bibliography: 'Introduction to Linear Algebra — Gilbert Strang',
      },
      {
        topic: 'Processamento de Sinais (DSP)',
        description: 'Filtros digitais (FIR/IIR) e Transformada de Fourier para limpar sinais de sensores ruidosos.',
        bibliography: 'Digital Signal Processing: A Practical Guide for Engineers and Scientists — Steven W. Smith',
      },
      {
        topic: 'Controle e Machine Learning',
        description: 'Sistemas de controle realimentado (PID) e treinamento de modelos de IA compactos para microcontroladores (TinyML).',
        bibliography:
          'Feedback Control of Dynamic Systems — Gene F. Franklin, J. David Powell & Abbas Emami-Naeini | Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow — Aurélien Géron',
      },
    ],
    skills: [
      'Programação em Python (TensorFlow, Keras, Scikit-Learn, SciPy).',
      'Desenvolvimento de algoritmos de filtro e controle (PID, Filtro de Kalman).',
      'Implantação de Inteligência Artificial na Borda (Edge AI / TinyML).',
    ],
    profile:
      'Focado nos estudantes analíticos que amam cálculo, estatística e modelagem. É perfeito para quem gosta de teoria pesada, mas que quer ver suas equações rodando dentro de um robô ou de um dispositivo inteligente.',
  },
];

export default function GuiaSubareasPage() {
  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 rounded-2xl border border-primary/40 bg-dark-900/80 p-6 sm:p-8 shadow-lg shadow-primary/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary/70">Liga Acadêmica de Hardware</p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-primary font-mono">Guia de Sub-áreas</h1>
              <p className="mt-4 text-gray-200 leading-relaxed max-w-3xl">
                Este documento serve como o guia oficial para apresentação e integração dos membros da Liga.
                Ele detalha o propósito, as habilidades desenvolvidas e as aplicações industriais de cada uma das
                5 sub-áreas de pesquisa e desenvolvimento.
              </p>
            </div>

            <Link
              href="/selection"
              className="inline-flex justify-center items-center px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition"
            >
              Voltar para seleção
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <article
              key={section.id}
              className="rounded-2xl border border-primary/25 bg-dark-900/60 p-6 sm:p-8 backdrop-blur-sm"
            >
              <header className="mb-6">
                <p className="text-primary/70 text-sm tracking-wider uppercase">Sub-área {section.id}</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mt-1">{section.title}</h2>
                <p className="text-lg text-gray-200 mt-1">{section.subtitle}</p>
              </header>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-primary mb-2">Visão Geral</h3>
                <p className="text-gray-200 leading-relaxed">{section.overview}</p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-primary mb-3">Foco de Estudo e Bibliografia Base</h3>
                <div className="space-y-3">
                  {section.focus.map((item) => (
                    <div key={item.topic} className="rounded-xl border border-primary/20 bg-dark-950/60 p-4">
                      <p className="font-semibold text-primary">{item.topic}</p>
                      <p className="text-gray-200 mt-1">{item.description}</p>
                      <p className="text-gray-300 mt-2 text-sm">
                        <span className="text-primary/90 font-medium">Bibliografia:</span> {item.bibliography}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-primary mb-3">Habilidades Desenvolvidas</h3>
                <ul className="space-y-2 list-disc list-inside text-gray-200">
                  {section.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-primary mb-2">Perfil do Membro</h3>
                <p className="text-gray-200 leading-relaxed">{section.profile}</p>
              </section>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

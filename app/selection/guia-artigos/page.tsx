import Link from 'next/link';

const articleGuide = [
  {
    id: '1',
    area: 'Hardware e Eletrônica',
    articles: [
      {
        title: 'Análise Empírica de Módulos RF de Baixo Custo em Ambientes Ruidosos',
        description:
          'Comparar o alcance e a perda de pacotes entre LoRa e NRF24L01 em um ambiente industrial ou de densa vegetação.',
        contribution: 'Dados práticos valiosos para implementações locais de IoT.',
      },
      {
        title: 'Design de um Frontend Analógico Aberto para Aquisição de Sinais de ECG',
        description:
          'Criação e validação de um circuito de baixo custo usando Amp-Ops comerciais para leitura biométrica.',
        contribution: 'Democratização e redução de custos de hardware biomédico para pesquisa.',
      },
      {
        title: 'Avaliação de Eficiência de Circuitos de Energy Harvesting',
        description:
          'Estudo comparativo da energia coletada por painéis solares minúsculos vs. piezoelétricos para alimentar um nó sensor por 24h.',
        contribution: 'Análise de viabilidade energética para wearables/IoT.',
      },
      {
        title: 'Otimização de Roteamento de PCB para Mitigação de EMI em Alta Frequência',
        description:
          'Comparar o ruído gerado em duas placas de 2 camadas com diferentes estratégias de plano de terra e trilhas para um sinal de clock elevado.',
        contribution: 'Guia prático e empírico de design para makers e estudantes.',
      },
      {
        title: 'Desenvolvimento de uma ALU Didática em FPGA com Debug Visual',
        description:
          'Implementação de uma arquitetura aberta no Verilog voltada para o ensino de portas lógicas.',
        contribution: 'Criação de uma ferramenta educacional em hardware de código aberto.',
      },
    ],
  },
  {
    id: '2',
    area: 'Arquitetura e Sistemas de Baixo Nível',
    articles: [
      {
        title: 'Aceleração de Algoritmos Criptográficos via Instruções Customizadas RISC-V',
        description:
          'Modificar um simulador RISC-V para incluir uma instrução dedicada a um passo de hash (ex: SHA-256) e medir o speedup.',
        contribution: 'Estudo de caso de co-design hardware/software.',
      },
      {
        title: 'Overhead de Troca de Contexto: RTOS vs Bare-metal em Microcontroladores RISC-V',
        description:
          'Benchmark medindo ciclos de clock exatos perdidos durante o context switch em arquiteturas modernas.',
        contribution: 'Fornecer métricas exatas de performance para desenvolvedores embarcados.',
      },
      {
        title: 'Impacto de Diferentes Políticas de Substituição de Cache em Workloads de IoT',
        description:
          'Simular (usando ferramentas como gem5) como algoritmos LRU vs Random se comportam rodando processamento de dados de sensores.',
        contribution: 'Análise de arquitetura voltada para um nicho específico de mercado.',
      },
      {
        title: 'Desenvolvimento e Latência de um Módulo Linux (Kernel Driver) Customizado',
        description:
          'Escrever um driver de kernel do zero para um sensor SPI não mapeado (ex: no Raspberry Pi) e comparar a latência de leitura com bibliotecas user-space (ex: Python).',
        contribution: 'Otimização de arquitetura de drivers.',
      },
      {
        title: 'C vs Assembly: Limites de Performance em MCU de 8-bits',
        description:
          'Benchmark detalhado de algoritmos matemáticos (ex: filtro FIR de ponto fixo) otimizados à mão em Assembly comparados com o GCC com -O3.',
        contribution: 'Mapeamento prático dos limites da compilação moderna vs código artesanal.',
      },
    ],
  },
  {
    id: '3',
    area: 'Engenharia de Sistemas Embarcados',
    articles: [
      {
        title: 'Zephyr OS vs FreeRTOS: Latência de Mensageria em Nodes IoT',
        description:
          'Estudo comparativo de throughput e latência usando MQTT via Wi-Fi no ESP32 sob diferentes cargas de processamento.',
        contribution: 'Guia empírico para seleção de RTOS em projetos IoT.',
      },
      {
        title: 'Análise de Consumo Energético (Power Profiling) em Modos de Sleep de Microcontroladores',
        description:
          'Medição prática do consumo de um ARM Cortex-M usando Tickless Idle do FreeRTOS vs modos de interrupção bare-metal.',
        contribution: 'Estratégias validadas de otimização de energia para baterias.',
      },
      {
        title: 'Arquitetura Tolerante a Falhas para Atualizações OTA (Over-The-Air)',
        description:
          'Implementação de um bootloader dual-bank de baixo custo e análise do tempo de recuperação em caso de corrupção de memória flash.',
        contribution: 'Engenharia de confiabilidade para sistemas remotos.',
      },
      {
        title: 'Edge Computing Industrial: Análise de Vibração com FFT em MCU',
        description:
          'Implementação de um firmware num Cortex-M4 para ler acelerômetros, calcular a FFT localmente e enviar apenas o diagnóstico da máquina.',
        contribution: 'Aplicação de processamento na borda reduzindo tráfego de rede.',
      },
      {
        title: 'Sensor Fusion para Sistemas de Navegação de Baixo Custo',
        description:
          'Comparação entre a implementação computacional do Filtro de Kalman vs Filtro de Mahony em um IMU rodando num MCU restrito.',
        contribution: 'Eficiência de algoritmos em hardware de baixo custo.',
      },
    ],
  },
  {
    id: '4',
    area: 'Ciência da Computação',
    articles: [
      {
        title: 'Otimização de Estruturas de Dados para Logs em Memória Flash (NAND/NOR)',
        description:
          'Comparativo de uso de memória RAM e ciclos de CPU usando Buffers Circulares vs Árvores B simplificadas num gateway IoT.',
        contribution: 'Escolha arquitetural para evitar desgaste prematuro de memória.',
      },
      {
        title: 'Avaliação de Padrões de Projeto (Design Patterns) em C++ para Sistemas Restritos',
        description:
          'Análise do custo computacional (tempo de execução e fragmentação de RAM) ao usar Polimorfismo e Virtual Functions num ESP32.',
        contribution: 'Onde o bom design de software colide com as limitações de hardware.',
      },
      {
        title: 'Tradução de Protocolos na Borda (Edge Gateway)',
        description:
          'Desenvolvimento e benchmark de um software em Python/C++ que recebe BLE e traduz para CoAP/MQTT. Avaliar vazamento de memória e uso de CPU sob estresse.',
        contribution: 'Análise de performance em interoperabilidade de redes.',
      },
      {
        title: 'Algoritmo Leve de Detecção de Anomalias de Rede em Roteadores IoT',
        description:
          'Implementação em C de uma heurística simples para identificar padrões de ataques DDoS sem depender de aprendizado de máquina pesado.',
        contribution: 'Algoritmo de segurança para dispositivos restritos.',
      },
      {
        title: 'Algoritmos de Roteamento Dinâmico em Redes Mesh de Baixa Potência',
        description:
          'Uma adaptação do algoritmo A* ou Dijkstra focada em economizar bateria dos nós pelo caminho, e não apenas velocidade.',
        contribution: 'Otimização algorítmica voltada para a vida útil da rede.',
      },
    ],
  },
  {
    id: '5',
    area: 'Matemática Aplicada e Sistemas Inteligentes',
    articles: [
      {
        title: 'Impacto da Quantização em Modelos de TinyML para Reconhecimento de Palavras-Chave (Keyword Spotting)',
        description:
          'Treinar uma CNN em Python, converter para INT8 usando TensorFlow Lite Micro e medir a queda de acurácia vs ganho de velocidade no Cortex-M4.',
        contribution: 'Otimização de IA na Borda.',
      },
      {
        title: 'Controle PID Adaptativo vs Lógica Fuzzy em Sistemas Instáveis',
        description:
          'Modelagem matemática e benchmark prático de controle usando um pêndulo invertido ou robô auto-equilibrado impresso em 3D.',
        contribution: 'Benchmarking prático de teoria de controle.',
      },
      {
        title: 'Autoencoders Leves para Manutenção Preditiva',
        description:
          'Treinar um modelo não-supervisionado minúsculo para rodar num microcontrolador e identificar anomalias térmicas lidas por uma matriz de sensores IR.',
        contribution: 'Aplicação inovadora de ML em ambientes industriais.',
      },
      {
        title: 'Filtro LMS Adaptativo para Cancelamento de Ruído em Tempo Real num DSP de Baixo Custo',
        description:
          'Implementação matemática de um filtro DSP para limpar a voz humana de um microfone em ambiente ruidoso, rodando em placa budget.',
        contribution: 'Processamento avançado de sinais em hardware acessível.',
      },
      {
        title: 'Classificação de Gestos (HCI) usando TinyML e Redes SVM embarcadas',
        description:
          'Utilização da matemática de Support Vector Machines num Arduino Nano 33 BLE para prever movimentos de mão lidos do IMU.',
        contribution: 'Avanço prático em Interação Humano-Computador.',
      },
    ],
  },
];

export default function GuiaArtigosPage() {
  return (
    <div className="min-h-screen px-4 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 rounded-2xl border border-primary/40 bg-dark-900/80 p-6 sm:p-8 shadow-lg shadow-primary/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary/70">Liga Acadêmica de Hardware</p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-primary font-mono">Guia de Artigos por Área</h1>
              <p className="mt-4 text-gray-200 leading-relaxed max-w-4xl">
                Esta página organiza os temas de publicação por sub-área, com foco do estudo e a contribuição esperada de cada proposta.
                Use este guia para escolher os artigos com mais clareza antes de continuar o formulário.
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

        <div className="space-y-7">
          {articleGuide.map((group) => (
            <section
              key={group.id}
              className="rounded-2xl border border-primary/25 bg-dark-900/60 p-6 sm:p-8 backdrop-blur-sm"
            >
              <header className="mb-5">
                <p className="text-primary/70 text-sm tracking-wider uppercase">Área {group.id}</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mt-1">{group.area}</h2>
                <p className="mt-2 text-gray-300">Artigos para publicação</p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {group.articles.map((article, index) => (
                  <article
                    key={article.title}
                    className="rounded-xl border border-primary/20 bg-dark-950/60 p-4"
                  >
                    <p className="text-xs uppercase tracking-wider text-primary/70 mb-2">Artigo {index + 1}</p>
                    <h3 className="text-lg font-semibold text-primary leading-snug">{article.title}</h3>
                    <p className="text-gray-200 mt-2 leading-relaxed">{article.description}</p>
                    <p className="text-sm text-gray-300 mt-3">
                      <span className="text-primary/90 font-medium">Contribuição:</span> {article.contribution}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

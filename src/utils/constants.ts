export const AREAS = [
  {
    id: 1,
    name: 'Hardware e Eletrônica',
    color: '#00F0FF',
    description: 'Design e otimização de circuitos, RF, e componentes eletrônicos',
  },
  {
    id: 2,
    name: 'Arquitetura e Sistemas de Baixo Nível',
    color: '#B020F0',
    description: 'Arquitetura de processadores, otimizações de cache e assembly',
  },
  {
    id: 3,
    name: 'Engenharia de Sistemas Embarcados',
    color: '#00D4FF',
    description: 'Sistemas embarcados, RTOS, e processamento em edge',
  },
  {
    id: 4,
    name: 'Ciência da Computação',
    color: '#A000FF',
    description: 'Algoritmos, estruturas de dados, roteamento e protocolos',
  },
  {
    id: 5,
    name: 'Matemática Aplicada e Sistemas Inteligentes',
    color: '#00FFAA',
    description: 'ML, TinyML, processamento de sinais e inteligência artificial',
  },
];

export const ARTICLES_BY_AREA = {
  1: [
    'Análise Empírica de Módulos RF em Ambientes Ruidosos',
    'Design de um Frontend Analógico Aberto para ECG',
    'Avaliação de Eficiência de Circuitos de Energy Harvesting',
    'Otimização de Roteamento de PCB para Mitigação de EMI',
    'Desenvolvimento de uma ALU Didática em FPGA',
  ],
  2: [
    'Aceleração de Algoritmos Criptográficos via RISC-V',
    'Overhead de Troca de Contexto: RTOS vs Bare-metal',
    'Impacto de Políticas de Substituição de Cache em IoT',
    'Desenvolvimento e Latência de um Módulo Linux',
    'C vs Assembly: Limites de Performance em MCU de 8-bits',
  ],
  3: [
    'Zephyr OS vs FreeRTOS: Latência de Mensageria',
    'Análise de Consumo Energético em Modos de Sleep',
    'Arquitetura Tolerante a Falhas para Atualizações OTA',
    'Edge Computing Industrial: Análise de Vibração',
    'Sensor Fusion para Sistemas de Navegação',
  ],
  4: [
    'Otimização de Estruturas de Dados para Logs em Flash',
    'Avaliação de Padrões de Projeto C++ para Sistemas Restritos',
    'Tradução de Protocolos na Borda (Edge Gateway)',
    'Algoritmo Leve de Detecção de Anomalias de Rede',
    'Algoritmos de Roteamento Dinâmico em Redes Mesh',
  ],
  5: [
    'Impacto da Quantização em Modelos de TinyML',
    'Controle PID Adaptativo vs Lógica Fuzzy',
    'Autoencoders Leves para Manutenção Preditiva',
    'Filtro LMS Adaptativo para Cancelamento de Ruído',
    'Classificação de Gestos (HCI) usando TinyML',
  ],
};

export const MATRICULA_REGEX = /^\d{12}$/;

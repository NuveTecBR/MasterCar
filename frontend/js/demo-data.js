// Dados demonstrativos estáticos para pré-visualização no GitHub Pages
export const DEMO_DATA = {
  "servicos": [
    {
      "id": 1,
      "codigo": "SRV-REV-40K",
      "nome": "Revisão Preventiva Completa + Checklist 60 Itens",
      "categoria": "Revisão Preventiva",
      "preco_base": 489,
      "tempo_estimado": "3h30 no box",
      "garantia_meses": 12,
      "descricao": "Troca de óleo 100% sintético API SP, filtro de óleo, filtro de ar do motor, filtro de combustível, leitura via Scanner OBD2 e inspeção de freios e suspensão.",
      "inclui_itens": "Óleo Sintético (4L), 3 Filtros Originais, Alinhamento Computadorizado 3D, Laudo Digital em PDF",
      "destaque": 1
    },
    {
      "id": 2,
      "codigo": "SRV-FRE-ABS",
      "nome": "Manutenção Completa de Freios ABS (Pastilhas + Fluido DOT4)",
      "categoria": "Freios & Suspensão",
      "preco_base": 379,
      "tempo_estimado": "2h00 no box",
      "garantia_meses": 6,
      "descricao": "Substituição do jogo de pastilhas dianteiras cerâmicas silenciosas, medição de empenamento dos discos com relógio comparador e sangria eletrônica do fluido DOT4.",
      "inclui_itens": "Jogo de Pastilhas Cerâmicas, Fluido Bosch DOT4, Sangria Eletrônica ABS, Limpeza Técnica das Pinças",
      "destaque": 1
    },
    {
      "id": 3,
      "codigo": "SRV-INJ-OBD",
      "nome": "Diagnóstico Computadorizado OBD2 + Limpeza de Bicos por Ultrassom",
      "categoria": "Injeção & Diagnóstico",
      "preco_base": 295,
      "tempo_estimado": "2h30 no box",
      "garantia_meses": 6,
      "descricao": "Rastreamento de falhas de ignição, consumo elevado ou luz de injeção acesa no painel. Equalização de bicos injetores em bancada de ultrassom e reset de parâmetros.",
      "inclui_itens": "Scanner Bosch KTS / Raven, Limpeza em Cuba Ultrassônica, Kit de Anéis O-Ring Viton, Descarbonização de TBI",
      "destaque": 1
    },
    {
      "id": 6,
      "codigo": "SRV-CAM-ATF",
      "nome": "Troca Total de Fluido de Câmbio Automático / CVT por Diálise",
      "categoria": "Câmbio & Motor",
      "preco_base": 890,
      "tempo_estimado": "4h30 no box",
      "garantia_meses": 12,
      "descricao": "Substituição de 100% do fluido da transmissão automática via máquina de diálise computadorizada, prevenindo trancos, patinação e superaquecimento.",
      "inclui_itens": "Máquina de Diálise Automática, Fluido Sintético Homologado (Dexron VI / CVT), Reset de Adaptação Eletrônica",
      "destaque": 1
    },
    {
      "id": 4,
      "codigo": "SRV-SUS-3D",
      "nome": "Kit Amortecedores, Bandejas + Geometria 3D",
      "categoria": "Freios & Suspensão",
      "preco_base": 440,
      "tempo_estimado": "4h00 no box",
      "garantia_meses": 12,
      "descricao": "Eliminação de barulhos na suspensão, troca de bieletas, buchas de bandeja ou amortecedores (mão de obra + geometria 3D e balanceamento das 4 rodas).",
      "inclui_itens": "Inspeção em Folgômetro, Alinhamento 3D a Laser, Balanceamento Dinâmico, Reaperto com Torquímetro",
      "destaque": 0
    },
    {
      "id": 5,
      "codigo": "SRV-ARC-HIG",
      "nome": "Carga de Gás R134a por Peso + Higienização por Ozônio",
      "categoria": "Ar-Condicionado",
      "preco_base": 239,
      "tempo_estimado": "1h30 no box",
      "garantia_meses": 6,
      "descricao": "Reciclagem completa do gás refrigerante em estação computadorizada, teste de estanqueidade com contraste UV, troca do filtro de cabine antipólen e oxi-sanitização.",
      "inclui_itens": "Gás R134a Puro + Óleo PAG, Filtro de Cabine Carvão Ativado, Aplicação de Ozônio Bactericida",
      "destaque": 0
    }
  ],
  "ordens": [
    {
      "id": 1,
      "protocolo_os": "OS-2026-8841",
      "placa_veiculo": "BRA2E19",
      "modelo_veiculo": "VW T-Cross 1.4 TSI Highline 2023",
      "nome_cliente": "Fernando Magalhães (Fictício)",
      "servico_principal": "Revisão Preventiva Completa + Freios ABS",
      "etapa_atual": "4. Teste de Rodagem",
      "progresso_pct": 85,
      "mecanico_responsavel": "Mestre Mecânico Rodrigo S.",
      "relatorio_tecnico": "Sangria ABS finalizada. Em teste dinâmico de pista.",
      "valor_orcamento": 868,
      "atualizado_em": "2026-11-17 14:04:11"
    },
    {
      "id": 2,
      "protocolo_os": "OS-2026-8842",
      "placa_veiculo": "QXZ4G88",
      "modelo_veiculo": "Honda Civic Touring 1.5 Turbo",
      "nome_cliente": "Patrícia Vasconcelos (Fictício)",
      "servico_principal": "Troca de Fluido de Câmbio CVT por Diálise",
      "etapa_atual": "5. Pronto para Retirada",
      "progresso_pct": 100,
      "mecanico_responsavel": "Eng. Henrique Vasconcelos",
      "relatorio_tecnico": "Diálise concluída com fluido genuíno HCF-2. Teste de rodagem de 8km realizado sem anomalias e lavagem de cortesia finalizada.",
      "valor_orcamento": 890,
      "atualizado_em": "2026-11-14 18:22:19"
    },
    {
      "id": 3,
      "protocolo_os": "OS-2026-8845",
      "placa_veiculo": "FSP9A12",
      "modelo_veiculo": "Jeep Renegade 1.8 Longitude",
      "nome_cliente": "Ricardo Gomes (Fictício)",
      "servico_principal": "Diagnóstico OBD2 + Arrefecimento",
      "etapa_atual": "2. Diagnóstico Scanner OBD2",
      "progresso_pct": 35,
      "mecanico_responsavel": "Técnico Diagnóstico André M.",
      "relatorio_tecnico": "Scanner identificou falha intermitente na válvula termostática e sensor de temperatura. Orçamento prévio enviado para aprovação no WhatsApp.",
      "valor_orcamento": 520,
      "atualizado_em": "2026-11-14 18:22:19"
    }
  ]
};

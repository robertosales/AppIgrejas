export type TriageColor = 'green' | 'yellow' | 'red'
export type TriageResult = {
  classification: TriageColor
  summary: string
  riskIndicators: string[]
  confidence: number
}

const riskKeywords: Record<string, TriageColor> = {
  suicídio: 'red',
  'morte': 'red',
  'urgência': 'red',
  'risco': 'red',
  'emergência': 'red',
  'depressão': 'yellow',
  'ansiedade': 'yellow',
  'luto': 'yellow',
  'conflito': 'yellow',
  'vício': 'yellow',
  'crise': 'yellow',
  'dúvida': 'green',
  'conselho': 'green',
  'oração': 'green',
  'gratidão': 'green',
  'informação': 'green',
}

export function analyzeTriage(text: string): TriageResult {
  const lower = text.toLowerCase()
  const found: string[] = []
  let maxSeverity: TriageColor = 'green'

  for (const [keyword, color] of Object.entries(riskKeywords)) {
    if (lower.includes(keyword)) {
      found.push(keyword)
      const severityOrder: TriageColor[] = ['green', 'yellow', 'red']
      if (severityOrder.indexOf(color) > severityOrder.indexOf(maxSeverity)) {
        maxSeverity = color
      }
    }
  }

  return {
    classification: maxSeverity,
    summary: found.length > 0
      ? `Palavras-chave detectadas: ${found.join(', ')}`
      : 'Nenhum indicador de risco detectado',
    riskIndicators: found,
    confidence: found.length > 0 ? Math.min(0.5 + found.length * 0.15, 0.95) : 0.3,
  }
}

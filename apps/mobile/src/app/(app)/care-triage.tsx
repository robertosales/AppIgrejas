import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme'
import { analyzeTriage, type TriageColor } from '../../services/triage-service'

export default function CareTriageScreen() {
  const [step, setStep] = useState<'intro' | 'chat' | 'result'>('intro')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<{ classification: TriageColor; summary: string } | null>(null)

  function handleAnalyze() {
    if (!message.trim()) return
    setResult(analyzeTriage(message))
    setStep('result')
  }

  const colorMap: Record<TriageColor, string> = { green: colors.triage.green, yellow: colors.triage.yellow, red: colors.triage.red }
  const labelMap: Record<TriageColor, string> = { green: 'Verde — Leve', yellow: 'Amarelo — Moderado', red: 'Vermelho — Urgente' }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
        <Text style={styles.title}>Triagem</Text>
      </View>

      {step === 'intro' && (
        <View style={styles.content}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>Olá! Sou o assistente de acolhimento. Vou fazer algumas perguntas para entender melhor como posso ajudar.</Text>
          </View>
          <Text style={styles.privacy}>Esta conversa é confidencial e será registrada para acompanhamento pela equipe pastoral.</Text>
          <TouchableOpacity style={styles.button} onPress={() => setStep('chat')}><Text style={styles.buttonText}>Entendi, quero conversar</Text></TouchableOpacity>
        </View>
      )}

      {step === 'chat' && (
        <View style={styles.content}>
          <View style={styles.bubble}><Text style={styles.bubbleText}>Conte um pouco sobre o que você está passando. Pode ficar à vontade para compartilhar.</Text></View>
          <TextInput style={styles.input} placeholder="Digite aqui..." value={message} onChangeText={setMessage} multiline numberOfLines={6} />
          <TouchableOpacity style={styles.button} onPress={handleAnalyze}><Text style={styles.buttonText}>Enviar</Text></TouchableOpacity>
        </View>
      )}

      {step === 'result' && result && (
        <View style={styles.content}>
          <View style={styles.resultCard}>
            <View style={[styles.badge, { backgroundColor: colorMap[result.classification] + '20' }]}>
              <View style={[styles.dot, { backgroundColor: colorMap[result.classification] }]} />
              <Text style={[styles.badgeText, { color: colorMap[result.classification] }]}>{labelMap[result.classification]}</Text>
            </View>
            <Text style={styles.resultText}>{result.summary}</Text>
            {result.classification === 'red' && <Text style={styles.urgent}>Caso urgente — Equipe será notificada imediatamente.</Text>}
          </View>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/(app)/care-chat')}><Text style={styles.buttonText}>Continuar para atendimento</Text></TouchableOpacity>
        </View>
      )}

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>Triagem por IA não substitui avaliação profissional. Casos graves são encaminhados para atendimento humano.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, paddingTop: 60, backgroundColor: colors.primary },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  bubble: { backgroundColor: '#eef2ff', padding: 20, borderRadius: 16, marginBottom: 20 },
  bubbleText: { fontSize: 16, color: colors.text, lineHeight: 24 },
  privacy: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: colors.border, padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 16, textAlignVertical: 'top', backgroundColor: colors.surface },
  button: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resultCard: { backgroundColor: colors.surface, padding: 24, borderRadius: 16, marginBottom: 20 },
  badge: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, marginBottom: 16, alignSelf: 'flex-start' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  badgeText: { fontSize: 14, fontWeight: '600' },
  resultText: { fontSize: 16, color: colors.text, lineHeight: 24 },
  urgent: { fontSize: 14, color: colors.error, fontWeight: '600', marginTop: 12, padding: 12, backgroundColor: '#fef2f2', borderRadius: 8 },
  disclaimer: { padding: 16, backgroundColor: '#fffbeb' },
  disclaimerText: { fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
})

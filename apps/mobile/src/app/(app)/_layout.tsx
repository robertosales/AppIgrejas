import { Stack } from 'expo-router'

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="agenda" />
      <Stack.Screen name="event-detail" />
      <Stack.Screen name="prayer" />
      <Stack.Screen name="content" />
      <Stack.Screen name="groups" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="subscription" />
      <Stack.Screen name="billing" />
      <Stack.Screen name="care" />
      <Stack.Screen name="care-triage" />
      <Stack.Screen name="care-chat" />
    </Stack>
  )
}

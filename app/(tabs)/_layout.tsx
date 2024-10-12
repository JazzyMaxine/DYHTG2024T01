import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          title: 'Play',
        }}
      />
      <Tabs.Screen
        name="scores"
        options={{
          title: 'High Scores',
        }}
      />
    </Tabs>
  );
}

import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to login screen by default
  return <Redirect href="/login" />;
}

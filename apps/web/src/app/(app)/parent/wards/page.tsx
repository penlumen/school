import { redirect } from 'next/navigation';

// The children overview now lives on the parent home page.
export default function WardsPage() {
  redirect('/parent/dashboard');
}

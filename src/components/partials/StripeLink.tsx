const BASE_URL = import.meta.env.PROD
  ? `https://dashboard.stripe.com/${import.meta.env.VITE_STRIPE_ACCOUNT_ID}`
  : `https://dashboard.stripe.com/${import.meta.env.VITE_STRIPE_ACCOUNT_ID}/test`;

interface StripeLinkProps {
  paymentIntentId?: string | null;
}

export function StripeLink({ paymentIntentId }: StripeLinkProps) {
  if (!paymentIntentId) return null;

  return (
    <a
      href={`${BASE_URL}/payments/${paymentIntentId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-primary underline-offset-4 hover:underline"
    >
      View in Stripe
    </a>
  );
}

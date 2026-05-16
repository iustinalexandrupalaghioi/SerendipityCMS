interface ResendLinkProps {
  resendId?: string | null;
}

export function ResendLink({ resendId }: ResendLinkProps) {
  if (!resendId) return null;

  return (
    <a
      href={`https://resend.com/emails/${resendId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-primary underline-offset-4 hover:underline"
    >
      View Email
    </a>
  );
}

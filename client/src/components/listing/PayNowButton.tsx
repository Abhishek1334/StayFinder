import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createStripeSession } from '@/api/paymentApi';

interface PayNowButtonProps {
  bookingId: string;
  className?: string;
}

export const PayNowButton = ({ bookingId, className }: PayNowButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await createStripeSession(bookingId);
      window.location.href = response.url;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initiate payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? "Processing..." : "Pay Now"}
    </Button>
  );
};

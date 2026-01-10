import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const RATE_LIMIT_KEY = 'inquiry_submissions';
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS = 3;

const checkRateLimit = (): { allowed: boolean; remainingTime: number } => {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    const submissions: number[] = stored ? JSON.parse(stored) : [];
    const now = Date.now();
    const recentSubmissions = submissions.filter(time => now - time < RATE_LIMIT_WINDOW);
    
    if (recentSubmissions.length >= MAX_SUBMISSIONS) {
      const oldestSubmission = Math.min(...recentSubmissions);
      const remainingTime = RATE_LIMIT_WINDOW - (now - oldestSubmission);
      return { allowed: false, remainingTime };
    }
    return { allowed: true, remainingTime: 0 };
  } catch {
    return { allowed: true, remainingTime: 0 };
  }
};

const recordSubmission = () => {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    const submissions: number[] = stored ? JSON.parse(stored) : [];
    const now = Date.now();
    const recentSubmissions = submissions.filter(time => now - time < RATE_LIMIT_WINDOW);
    recentSubmissions.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentSubmissions));
  } catch {
    // Ignore storage errors
  }
};

interface CartItem {
  product: { name?: string; title?: string };
  quantity: number;
  memberPrice?: number;
}

interface ContactInquiryFormProps {
  cartItems?: CartItem[];
  onSuccess?: () => void;
}

export const ContactInquiryForm = ({ cartItems, onSuccess }: ContactInquiryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ allowed: boolean; remainingTime: number }>({ allowed: true, remainingTime: 0 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    setRateLimitInfo(checkRateLimit());
    const interval = setInterval(() => {
      setRateLimitInfo(checkRateLimit());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const generateOrderSummary = () => {
    if (!cartItems || cartItems.length === 0) return '';
    
    return cartItems.map(item => 
      `- ${item.product.name || item.product.title || 'Product'} x${item.quantity}`
    ).join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in required fields');
      return;
    }

    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      const minutes = Math.ceil(rateCheck.remainingTime / 60000);
      toast.error(`Too many submissions. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-inquiry-email', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          message: formData.message.trim() || undefined,
          orderSummary: generateOrderSummary() || undefined,
        },
      });

      if (error) throw error;
      
      if (data?.rateLimited) {
        toast.error('Too many requests. Please try again later.');
        return;
      }

      recordSubmission();
      setIsSubmitted(true);
      toast.success('Inquiry sent! We\'ll contact you shortly.');
      onSuccess?.();
    } catch (error: any) {
      console.error('Error sending inquiry:', error);
      if (error.message?.includes('rate limit')) {
        toast.error('Too many requests. Please try again later.');
      } else {
        toast.error('Failed to send inquiry. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRemainingTime = (ms: number) => {
    const minutes = Math.ceil(ms / 60000);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  if (isSubmitted) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <CheckCircle className="h-12 w-12 text-primary mx-auto" />
            <h3 className="font-semibold text-lg">Inquiry Sent!</h3>
            <p className="text-muted-foreground text-sm">
              We've received your order inquiry and will contact you within 24 hours to complete your purchase.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5" />
          Order Inquiry
        </CardTitle>
        <CardDescription>
          Submit your details and we'll contact you to complete your order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              maxLength={100}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              maxLength={255}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              maxLength={20}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Additional Notes (optional)</Label>
            <Textarea
              id="message"
              placeholder="Any special requests or questions..."
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={3}
              maxLength={500}
            />
          </div>
          
          {!rateLimitInfo.allowed ? (
            <div className="text-center p-3 rounded-md bg-muted">
              <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Too many submissions. Try again in {formatRemainingTime(rateLimitInfo.remainingTime)}.
              </p>
            </div>
          ) : (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Inquiry
                </>
              )}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

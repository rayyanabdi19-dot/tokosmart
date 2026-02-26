import React from 'react';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  { q: 'How do I record a sale?', a: 'Tap the "+" button or "New Sale" on the dashboard. Enter the amount, category, and payment method, then confirm.' },
  { q: 'How do I close a shift?', a: 'Go to the Dashboard and tap "Close Shift" button. Review your summary and confirm to end the shift.' },
  { q: 'Can I edit a transaction?', a: 'Currently, transactions cannot be edited after recording. Make sure to double-check before confirming.' },
  { q: 'How do I add a top-up?', a: 'Use the "Top-up" button on the dashboard to add cash to your register balance.' },
  { q: 'Where can I see my reports?', a: 'Navigate to the Reports tab in the bottom menu for analytics and shift summaries.' },
];

const FaqPage = () => {
  const { setCurrentPage } = useApp();
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-12">
        <button onClick={() => setCurrentPage('account')} className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-xl font-bold text-foreground mb-1">FAQ & Help</h1>
        <p className="text-sm text-muted-foreground mb-6">Common questions answered</p>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                {openIndex === i ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;

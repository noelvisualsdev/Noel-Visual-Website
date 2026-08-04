import { ProcessStep } from '@/types';

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Discovery & Briefing',
    description:
      'We discuss your project, goals, preferred style, requirements, and deadline to create a clear direction.',
    deliverables: [
      'Project Brief',
      'Style References',
      'Final Quote'
    ],
    timeframe: 'Day 1'
  },
  {
    step: '02',
    title: 'Payment',
    description:
      'The agreed upfront payment is required before we begin working on your project.',
    deliverables: [
      'Invoice',
      'Payment Confirmation',
      'Project Start'
    ],
    timeframe: 'Day 1'
  },
  {
    step: '03',
    title: 'Production & Review',
    description:
      'We create your project based on the approved briefing and send you a preview for review and feedback.',
    deliverables: [
      'First Draft',
      'Preview',
      'Revision Round'
    ],
    timeframe: 'Day 2 – 4'
  },
  {
    step: '04',
    title: 'Final Delivery',
    description:
      'After your feedback has been implemented, we finalize the project and deliver all agreed files.',
    deliverables: [
      'Final Files',
      'High-Resolution Export',
      'Delivery Confirmation'
    ],
    timeframe: 'Final Day'
  }
];
/**
 * AFM spotlights — short, voiceable nuggets the Coach can teach on demand.
 *
 * Each item is written for spoken delivery: full sentences, no markdown,
 * no bullet points, no symbols that the speech engine would mangle.
 * Length is capped to roughly 90 seconds of speech (~220 words).
 */

export interface Spotlight {
  id: string;
  category: 'history' | 'technique' | 'examiner' | 'mindset' | 'real-world' | 'memory';
  title: string;
  hookLine: string;          // shown in the chat panel before the speech
  body: string;              // what the voice reads
  ties?: string[];           // optional related-topic ids
}

export const SPOTLIGHTS: Spotlight[] = [
  {
    id: 'mm-nobel',
    category: 'history',
    title: 'Why M and M won a Nobel',
    hookLine: 'The two propositions that changed corporate finance forever.',
    body:
      'In nineteen fifty eight, Franco Modigliani and Merton Miller published a paper that broke an entire industry. ' +
      'Their first proposition said that, in a perfect market, the value of a firm is independent of how it is financed. ' +
      'Debt or equity, it does not matter. The pie is the pie. ' +
      'Their second proposition added the twist that everyone forgets. ' +
      'As you add cheaper debt, the cost of equity rises to compensate, because equity holders now bear more risk. ' +
      'The two effects offset perfectly, leaving the weighted average cost of capital unchanged. ' +
      'Then Miller extended this to add tax. ' +
      'Suddenly debt has a real advantage, because interest is tax deductible. ' +
      'And that single insight is why the modern corporate balance sheet looks the way it does. ' +
      'Both men won the Nobel prize. ' +
      'Every time you ungear and regear a beta, you are walking through their proof.',
    ties: ['coc'],
  },
  {
    id: 'roll-hubris',
    category: 'history',
    title: 'The hubris hypothesis',
    hookLine: 'Why most takeovers destroy value, by Richard Roll.',
    body:
      'Richard Roll, in nineteen eighty six, looked at decades of takeover data and noticed something embarrassing. ' +
      'Most acquirers lose money for their shareholders. ' +
      'Yet executives keep doing deals. ' +
      'His explanation was hubris. ' +
      'In any auction with imperfect information, the winning bid comes from the most optimistic bidder, who has overestimated the value the most. ' +
      'The combination of executive overconfidence, investment banker fees that depend on completion, and the social status of running a bigger company all push the same direction. ' +
      'Synergies are pitched as huge, integration is modelled as smooth, and the premium paid is justified by spreadsheets the bidder builds themselves. ' +
      'Three years later, the goodwill is impaired. ' +
      'The lesson for the exam is simple. ' +
      'Whenever you see a deal in a Section A scenario, name Roll, identify the hubris signals, and recommend independent due diligence and a binding maximum bid.',
    ties: ['mna', 'behav'],
  },
  {
    id: 'black-scholes-story',
    category: 'history',
    title: 'The most famous formula in finance',
    hookLine: 'How a physicist, an economist and a derivatives trader built Black Scholes.',
    body:
      'Fischer Black, Myron Scholes, and Robert Merton built a formula in nineteen seventy three that priced options. ' +
      'The breakthrough was hedging. ' +
      'They proved that you can construct a portfolio of the underlying stock and a riskless bond that perfectly replicates the option payoff at every moment. ' +
      'If two strategies pay the same in every possible state, they must cost the same today. ' +
      'That single argument forces the option price. ' +
      'The five inputs are now muscle memory for any AFM candidate. ' +
      'Asset price, exercise price, time to expiry, volatility, and the risk free rate. ' +
      'Real options take this and apply it to projects. ' +
      'The asset price becomes the present value of cash flows on exercise. ' +
      'The exercise price becomes the capex. ' +
      'And volatility becomes the uncertainty of the project value itself. ' +
      'Map those five inputs before you touch d one. ' +
      'Get the mapping wrong and the entire calculation is wrong.',
    ties: ['real'],
  },
  {
    id: 'fisher-trap',
    category: 'technique',
    title: 'The Fisher trap',
    hookLine: 'The single mistake that wipes a Section A NPV.',
    body:
      'The Fisher equation says that one plus the nominal rate equals one plus the real rate, multiplied by one plus the inflation rate. ' +
      'Mix the two systems and the answer collapses. ' +
      'Real cash flows must be discounted at a real rate. ' +
      'Nominal cash flows must be discounted at a nominal rate. ' +
      'Most candidates pick a hybrid by accident. ' +
      'They inflate revenues at three percent per year, leave costs in real terms, and then discount everything at a nominal weighted average cost of capital. ' +
      'The examiner reports flag this every sitting. ' +
      'Fix it in working one. ' +
      'Write a single sentence. ' +
      'Quote, all cash flows are stated in nominal terms and discounted at a nominal weighted average cost of capital, end quote. ' +
      'Then never deviate. ' +
      'That sentence is one professional skills mark and it locks in the entire NPV.',
    ties: ['npv'],
  },
  {
    id: 'apv-tax-shield',
    category: 'technique',
    title: 'Why discount the tax shield at Kd not WACC',
    hookLine: 'The double-counting trap in APV.',
    body:
      'The weighted average cost of capital already contains the term debt cost multiplied by one minus tax. ' +
      'That multiplication is the tax shield, baked in. ' +
      'If you then take the same tax shield in your APV calculation and discount it again at the weighted average cost of capital, you have priced the benefit twice. ' +
      'The fix is to discount the tax shield at the cost of debt, because the shield arises from the debt cash flows and shares their risk profile. ' +
      'Some markers accept the risk free rate when the firm is highly creditworthy and certain to use the shield. ' +
      'Either way, state the assumption explicitly in working two. ' +
      'For example, write, the tax shield is discounted at the pre tax cost of debt of six percent, reflecting the risk of the underlying interest cash flows. ' +
      'That sentence is one mark on its own.',
    ties: ['apv'],
  },
  {
    id: 'esg-pattern',
    category: 'examiner',
    title: 'The three sentence ESG pattern',
    hookLine: 'How to bank ESG marks without writing an essay.',
    body:
      'Since September twenty twenty five, every Section A question has allocated marks for environmental, social, and governance considerations. ' +
      'The examiner has been ruthless. ' +
      'Generic textbook prose earns zero. ' +
      'Application to the scenario earns the marks. ' +
      'The pattern is three sentences. ' +
      'Sentence one identifies a specific issue from the scenario. ' +
      'For example, the new factory generates twelve thousand tonnes of carbon emissions per year. ' +
      'Sentence two recommends a costed action. ' +
      'For example, install scrubbers at eight million pounds of capital expenditure plus half a million per year of running cost. ' +
      'Sentence three quantifies the outcome. ' +
      'For example, this reduces project net present value by one point two million but secures planning permission and avoids an estimated eighteen month protest delay to first revenue. ' +
      'Three sentences, three marks. ' +
      'Memorise that rhythm and you will never miss the marks again.',
    ties: ['behav'],
  },
  {
    id: 'professional-skills',
    category: 'examiner',
    title: 'The twenty marks everyone leaves on the table',
    hookLine: 'How to actually capture professional skills marks.',
    body:
      'Professional skills marks are worth twenty out of one hundred in every AFM exam. ' +
      'They are not a separate question. ' +
      'They are awarded for behaviours embedded throughout your answer. ' +
      'Four categories. ' +
      'Communication: lead with the recommendation, use clear headings, write in the tone the audience expects. ' +
      'Analysis and evaluation: turn each number into insight, interpret sensitivities, surface assumptions. ' +
      'Scepticism: challenge an assumption in the scenario at least once per question. ' +
      'Commercial acumen: link the financial decision to wider strategy, stakeholders, and reputation. ' +
      'A simple trick. ' +
      'At the end of every long answer, write four short bullets, one per skill, tied to the case. ' +
      'Four bullets in three minutes can earn four marks. ' +
      'Some tutors call this the deliberate skill trick and it is the highest yield habit in AFM revision.',
    ties: ['adviser'],
  },
  {
    id: 'just-keep-swimming',
    category: 'mindset',
    title: 'Just keep swimming',
    hookLine: 'The rule for stuck calculations.',
    body:
      'A phrase repeated in every AFM resit course worth its salt. ' +
      'Just keep swimming. ' +
      'It comes from the moment in the exam where a calculation breaks. ' +
      'You hit a wall on the working capital figure, the discount factor will not balance, the spreadsheet returns an error. ' +
      'The instinct is to freeze, to start over, to lose ten minutes. ' +
      'The right answer is to move on. ' +
      'Use a sensible placeholder, label it with own figure, and continue. ' +
      'The own figure rule means that if your subsequent steps are correct given a wrong starting number, you still earn the marks for those steps. ' +
      'Examiners reward the structure and the technique even when the arithmetic slips. ' +
      'So when you are stuck, take a breath, write own figure carried forward, and keep swimming. ' +
      'You bank far more marks than the candidate who restarts in panic.',
    ties: ['adviser'],
  },
  {
    id: 'time-discipline',
    category: 'mindset',
    title: 'One point eight minutes per mark',
    hookLine: 'The single most important number in AFM.',
    body:
      'The exam is one hundred marks in three hours and fifteen minutes, including reading. ' +
      'That gives you one point nine five minutes per mark in raw arithmetic. ' +
      'Coaches round it to one point eight to leave a safety buffer. ' +
      'A twenty five mark question is forty five minutes of work. ' +
      'A fifty mark Section A is ninety minutes. ' +
      'When the budget is up, you stop. ' +
      'Even mid sentence. ' +
      'Marks are capped per question, so a perfect Section A that overruns by twenty minutes costs you twenty minutes of marks elsewhere that you cannot recover. ' +
      'Set a timer. ' +
      'When it warns at seventy five percent, plan your wrap up. ' +
      'When it warns at ninety percent, write the recommendation and the professional skills bullets, then move on. ' +
      'Discipline beats brilliance in this exam.',
    ties: ['adviser'],
  },
  {
    id: 'collar-walkthrough',
    category: 'technique',
    title: 'Anatomy of a collar',
    hookLine: 'The hedge that costs nothing and confuses everyone.',
    body:
      'A collar is two options stitched together. ' +
      'You buy a put option to protect against the rate moving against you. ' +
      'You sell a call option to fund the put premium. ' +
      'The net premium can be close to zero or even slightly positive. ' +
      'In return, you give up upside above the call strike. ' +
      'The four step routine. ' +
      'Step one, identify which option you buy and which you sell, based on whether you are a borrower or a depositor. ' +
      'Step two, compute the net premium by subtracting received from paid. ' +
      'Step three, compute the outcome at three rate scenarios. A low rate where the call is exercised against you, a middle rate inside the collar where neither option triggers, and a high rate where you exercise your put. ' +
      'Step four, state the effective cash outcome in each case. ' +
      'Examiner reports specifically flagged that very few candidates completed this in the September twenty twenty four paper. ' +
      'Drill it three times before exam day.',
    ties: ['ir'],
  },
  {
    id: 'fcff-vs-fcfe',
    category: 'technique',
    title: 'F goes with W, E goes with E',
    hookLine: 'A two letter mnemonic for valuation.',
    body:
      'A perennial trap. ' +
      'Free cash flow to the firm is discounted at the weighted average cost of capital, because it belongs to the whole firm, both debt and equity. ' +
      'Free cash flow to equity is discounted at the cost of equity, because it belongs to equity holders only. ' +
      'F goes with W, E goes with E. ' +
      'Two letters. ' +
      'After discounting free cash flow to the firm, you have enterprise value, not equity value. ' +
      'You must subtract debt and add excess cash to bridge to equity value. ' +
      'The examiner has flagged this in three consecutive sittings. ' +
      'Always end your valuation with one bridging sentence. ' +
      'Quote, enterprise value of X, less debt of Y, equals equity value of Z, end quote. ' +
      'That sentence alone earns the structural mark even when arithmetic is off.',
    ties: ['val'],
  },
  {
    id: 'memory-palace',
    category: 'memory',
    title: 'Build a memory palace tonight',
    hookLine: 'Anchor every formula to a room in your home.',
    body:
      'The method of loci goes back two thousand years to ancient Greek orators. ' +
      'They memorised long speeches by anchoring each section to a location in a familiar building, then mentally walking the route during delivery. ' +
      'For AFM, the front door is your weighted average cost of capital. ' +
      'The hallway is the capital asset pricing model. ' +
      'The kitchen is your net present value proforma, with rows for each cash flow line. ' +
      'The lounge is adjusted present value, with the four bricks of base case, tax shield, financing perks, and issue costs stacked on the coffee table. ' +
      'The stairs are the Modigliani Miller ungear and regear ladder, climbing up to project gearing and back down. ' +
      'The bedroom is Black Scholes. ' +
      'On exam morning, walk the route mentally before you sit down. ' +
      'You will retrieve every formula in less than thirty seconds.',
    ties: [],
  },
  {
    id: 'spaced-repetition',
    category: 'memory',
    title: 'Why re-reading does not work',
    hookLine: 'Active recall beats highlighting every time.',
    body:
      'Cognitive science has been clear for fifty years. ' +
      'Re-reading is the most popular study technique and one of the worst performing. ' +
      'It feels productive because the material seems familiar. ' +
      'Familiarity is not the same as memory. ' +
      'The brain only encodes deeply when it has to retrieve. ' +
      'So close the textbook, put the formula away, and write it from memory. ' +
      'Check what you got wrong. ' +
      'Repeat the next day. ' +
      'Then three days later. ' +
      'Then a week. ' +
      'Then two weeks. ' +
      'This is the Leitner spaced repetition schedule, and the cards page in this app drives it for you. ' +
      'Five minutes of active recall is worth thirty minutes of passive review. ' +
      'Your future exam morning self will thank you.',
    ties: [],
  },
  {
    id: 'weatherspoon-acquisition',
    category: 'real-world',
    title: 'When a low PE buyer overpays',
    hookLine: 'A bootstrap that fooled the market for two quarters.',
    body:
      'Picture a quoted firm trading at a price to earnings multiple of twenty. ' +
      'It announces an all share acquisition of a smaller business trading at a multiple of ten. ' +
      'Mechanically, post deal earnings per share rise. ' +
      'The combined company now produces more earnings per share than the buyer alone, simply because fewer new shares were issued for each pound of acquired earnings. ' +
      'No real synergies have been created. ' +
      'No cash flows have changed. ' +
      'This is bootstrapping, also called the price earnings chain letter. ' +
      'For a quarter or two, the share price often rises because analysts focus on earnings per share. ' +
      'Then reality returns. ' +
      'Whenever you see a share for share deal where the acquirer trades at a higher multiple than the target, flag bootstrapping in your answer. ' +
      'It is one mark of scepticism that almost nobody else writes.',
    ties: ['mna'],
  },
  {
    id: 'islamic-finance',
    category: 'real-world',
    title: 'Why sukuk are not bonds',
    hookLine: 'Asset backed finance under Sharia law.',
    body:
      'Sharia law forbids three things in finance. ' +
      'Riba, which is interest. ' +
      'Gharar, which is excessive uncertainty. ' +
      'Maysir, which is gambling. ' +
      'A conventional bond pays a fixed coupon. ' +
      'That coupon is interest, which is riba, which is forbidden. ' +
      'Sukuk solve the problem by being asset backed. ' +
      'The sukuk holders collectively own a real asset. ' +
      'Real estate, equipment, infrastructure. ' +
      'The asset generates rental or operating income. ' +
      'That income is distributed to sukuk holders as a share of the asset performance. ' +
      'In default, sukuk holders have recourse to the asset, not just the issuer balance sheet. ' +
      'This is conceptually closer to a securitisation than a bond. ' +
      'Sukuk issuance has grown to record levels in the past three years, especially from sovereign issuers. ' +
      'The exam wants you to map sukuk to its conventional equivalent and explain which assumption breaks for each.',
    ties: ['islam'],
  },
  {
    id: 'var-limitations',
    category: 'technique',
    title: 'What VaR will not tell you',
    hookLine: 'The five limitations to memorise.',
    body:
      'Value at Risk is the loss threshold you would not expect to exceed at a given confidence level. ' +
      'For example, a one day ninety nine percent VaR of one million pounds means you would expect, on average, to lose more than one million on one day in a hundred. ' +
      'It is a useful number, but it has five limitations the examiner expects you to mention. ' +
      'One. It assumes returns are normally distributed. Real returns have fat tails. ' +
      'Two. It is silent about the magnitude of loss beyond the threshold. Expected shortfall fixes that. ' +
      'Three. It is sensitive to the historical window chosen. Two hundred and fifty days versus one thousand days gives different numbers. ' +
      'Four. It is procyclical. Low volatility periods understate the true risk. ' +
      'Five. It assumes positions can be liquidated at observed prices, which fails in stressed markets. ' +
      'In any discussion mark answer, name two of these limitations to bank the marks.',
    ties: ['risk'],
  },
  {
    id: 'm-and-a-3-column',
    category: 'technique',
    title: 'The three column M and A table',
    hookLine: 'How to value an acquisition target.',
    body:
      'For any merger or acquisition scenario, build a three column table. ' +
      'Column one. Stand alone target value, computed by discounted cash flow at the target weighted average cost of capital. ' +
      'This is the floor. ' +
      'Column two. With synergy. Stand alone value plus the present value of expected synergies, discounted at the combined entity weighted average cost of capital. ' +
      'Column three. Maximum bid. The stand alone value plus the acquirer share of the synergies. ' +
      'The acquirer share is typically half, but depends on negotiating power. ' +
      'Bidding above the maximum bid destroys acquirer wealth. ' +
      'Always tag each synergy as either a one off or a recurring annuity, before you discount it. ' +
      'And always quote the actual offer price from the scenario when computing gain to target. ' +
      'The September twenty twenty five examiner report flagged candidates who used an analyst valuation instead of the offer price.',
    ties: ['mna'],
  },
  {
    id: 'sceptic-sentence',
    category: 'mindset',
    title: 'The single sceptic sentence',
    hookLine: 'How to unlock a Professional Skills mark in twenty seconds.',
    body:
      'Scepticism is one of the four professional skills the AFM examiner rewards. ' +
      'The examiner reports keep flagging that the majority of candidates do not demonstrate it. ' +
      'The fix is mechanical. ' +
      'Write one sentence per Section A challenging an assumption from the scenario. ' +
      'For example. The consultants twenty five percent revenue growth assumption appears optimistic given industry data showing single digit growth, and we recommend stress testing the model at ten percent. ' +
      'That sentence does three things. ' +
      'It identifies the assumption. It explains why it is questionable. It proposes a corrective action. ' +
      'One sentence. One mark. ' +
      'Add a similar sentence to every long answer and you will pick up two to four extra marks per paper, often the difference between a fail and a pass.',
    ties: ['adviser'],
  },
  {
    id: 'fx-bid-offer',
    category: 'technique',
    title: 'The bid offer rule for forwards',
    hookLine: 'Why banks always quote the rate that costs you more.',
    body:
      'Forward exchange rates are quoted as a bid and an offer. ' +
      'The bid is the rate at which the bank will buy the foreign currency from you. ' +
      'The offer is the rate at which the bank will sell the foreign currency to you. ' +
      'The offer is always higher. ' +
      'The bank takes the spread. ' +
      'When you have a foreign currency payable, you need to buy foreign currency from the bank, so you use the offer. ' +
      'When you have a foreign currency receivable, you sell foreign currency to the bank, so you use the bid. ' +
      'A simple way to remember. ' +
      'The bank always wins on the spread. ' +
      'You always get the worse side. ' +
      'Walk through the bank perspective on every forward calculation and you will never pick the wrong side again.',
    ties: ['fx'],
  },
  {
    id: 'real-world-elon-twitter',
    category: 'real-world',
    title: 'A textbook overpayment',
    hookLine: 'When the maximum bid was set by emotion.',
    body:
      'Real world example of every M and A bias the AFM exam tests. ' +
      'A high profile twenty twenty two acquisition of a social media company at forty four billion dollars. ' +
      'The acquirer subsequently wrote down the value by more than half within a year. ' +
      'Walk through the bias checklist. ' +
      'Hubris, in the form of the acquirers public confidence in their ability to extract synergies. ' +
      'Anchoring, on a price floated publicly during early negotiations. ' +
      'Entrapment, after legal commitments made walking away expensive. ' +
      'Herd behaviour, with multiple advisers and investors validating the deal. ' +
      'Information asymmetry, with the target board having better data than the bidder. ' +
      'Almost every bias the AFM syllabus names appeared in one transaction. ' +
      'Scenarios in your exam will rarely be this extreme, but the same biases recur. ' +
      'Name them, explain them, apply them.',
    ties: ['mna', 'behav'],
  },
];

export function pickRandomSpotlight(excludeIds: string[] = []): Spotlight {
  const pool = SPOTLIGHTS.filter((s) => !excludeIds.includes(s.id));
  if (pool.length === 0) return SPOTLIGHTS[Math.floor(Math.random() * SPOTLIGHTS.length)];
  return pool[Math.floor(Math.random() * pool.length)];
}

export const SPOTLIGHT_CATEGORY_LABELS: Record<Spotlight['category'], { label: string; icon: string; color: string }> = {
  history: { label: 'History', icon: 'fa-landmark', color: '#a78bfa' },
  technique: { label: 'Technique', icon: 'fa-bullseye', color: '#00a347' },
  examiner: { label: 'Examiner', icon: 'fa-file-signature', color: '#0ea5e9' },
  mindset: { label: 'Mindset', icon: 'fa-brain', color: '#f59e0b' },
  'real-world': { label: 'Real world', icon: 'fa-globe', color: '#dc2626' },
  memory: { label: 'Memory', icon: 'fa-bolt', color: '#ec4899' },
};

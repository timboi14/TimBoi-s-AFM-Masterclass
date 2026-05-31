import { motion } from 'framer-motion';
import { Card, Pill, SectionTitle, fadeUp, stagger } from '@/components/primitives';

/**
 * "Champions League" page. Every AFM concept explained like the reader is 13.
 * Plain English first, jargon second, football analogy third.
 * No formulas, no exam-speak. Sister page to Topics, not a replacement.
 * Style rule: no em dashes anywhere. Use commas, periods, parentheses, or hyphens.
 */

interface Concept {
  jargon: string;
  plain: string;
  analogy: string;
  why: string;
}

interface Match {
  group: 'A' | 'B' | 'C' | 'D/E';
  badge: string;
  fixture: string;
  bigIdea: string;
  concepts: Concept[];
}

const MATCHES: Match[] = [
  {
    group: 'A',
    badge: '🎩',
    fixture: 'Senior Financial Adviser & Governance',
    bigIdea:
      "Who's in charge of the money, and how do we stop them doing stupid (or dodgy) things with it?",
    concepts: [
      {
        jargon: 'Agency problem',
        plain:
          "The owners (shareholders) hire managers to run the company. But managers might do what's good for THEM instead of what's good for the owners. They pay themselves bonuses, build empires, take silly risks.",
        analogy:
          "Imagine you let your big cousin look after your Xbox while you're on holiday. They might rack up subscription charges to your account because it's not their bill.",
        why: 'Most exam questions have this hiding in them, a CEO doing something self-serving.',
      },
      {
        jargon: 'Corporate governance',
        plain:
          "The rules and committees that keep managers honest. Independent directors on the board, audit committees, remuneration committees that decide pay.",
        analogy:
          "Like having a ref, a VAR check, AND match officials in the tunnel. More eyes means less cheating.",
        why: "If a question says 'the chairman is also the CEO', that's a red flag the examiner wants you to spot.",
      },
      {
        jargon: 'Stakeholders',
        plain:
          "Anyone who cares about what the company does, not just shareholders. Workers, customers, suppliers, the local town, the planet.",
        analogy:
          "Spurs aren't just owned by ENIC. Fans, players, the council, ticket-holders, North London neighbours all have a stake in how the club behaves.",
        why: "ESG marks are everywhere now. Every question wants you to mention stakeholders beyond shareholders.",
      },
      {
        jargon: 'ESG (Environmental, Social, Governance)',
        plain:
          "Three boxes a company is expected to tick. Don't wreck the planet, treat people decently, run the business cleanly.",
        analogy:
          "FFP (Financial Fair Play) for the real world. Break the rules, get punished by markets and regulators.",
        why: "Easy marks. Bolt 2-3 ESG bullets onto any answer about a big decision.",
      },
    ],
  },
  {
    group: 'A',
    badge: '🧠',
    fixture: 'Behavioural Finance & M&A Biases',
    bigIdea:
      "People (including CEOs) are not rational robots. They make predictable mistakes, and the exam loves making you spot them.",
    concepts: [
      {
        jargon: 'Hubris',
        plain:
          "Over-confidence. The CEO thinks they're a genius, so they overpay for a takeover, convinced they can 'fix' the target.",
        analogy:
          "A manager paying £100m for a striker because 'I can get more out of him than anyone else could'. Then he scores 3 in a season.",
        why: "Spot it. A CEO who's done deals before, with media praise, bidding aggressively. Write 'hubris' in your answer.",
      },
      {
        jargon: 'Confirmation bias',
        plain:
          "You only notice information that agrees with what you already believe. Anything that disagrees, you ignore.",
        analogy:
          "You think your team is going to win, so you only remember the chances they created and forget the ones they conceded.",
        why: "Almost every M&A board has it. They've decided to buy, then look for reasons to justify.",
      },
      {
        jargon: 'Herding',
        plain:
          "Following what everyone else is doing, even when it's daft, because being wrong with the crowd feels safer than being wrong alone.",
        analogy:
          "Every club starts signing 'inverted full-backs' because Pep did it. Half of them shouldn't have.",
        why: "Common in industry-wide takeover sprees and tech bubbles.",
      },
      {
        jargon: 'Anchoring',
        plain:
          "Getting fixated on the first number you saw. If the target's share price was £10 last year, you think £10 is 'fair' even when it shouldn't be.",
        analogy:
          "Refusing to pay £80 for a video game because you remember it was £40 on launch, even though it's now collectible.",
        why: "Watch for 'previous offer was £X' clues. That's the anchor in play.",
      },
    ],
  },
  {
    group: 'B',
    badge: '💸',
    fixture: 'Cost of Capital (WACC, CAPM, M&M2)',
    bigIdea:
      "What's the minimum return a project must make to be worth doing? It depends on how risky it is and how the company is funded.",
    concepts: [
      {
        jargon: 'Cost of capital',
        plain:
          "The 'rent' the company pays for the money it uses. Interest to lenders, returns to shareholders. To be worth it, projects must earn more than this rent.",
        analogy:
          "If you borrow your mate's lawnmower at £5/hour to mow lawns, you better charge customers more than £5/hour or you're losing money.",
        why: 'Every NPV calculation needs a discount rate, and the discount rate is the cost of capital.',
      },
      {
        jargon: 'WACC (Weighted Average Cost of Capital)',
        plain:
          "A company has two main money sources. Equity (shareholders) and debt (lenders). WACC is the average cost of both, weighted by how much of each they use.",
        analogy:
          "Spurs paying part of the wage bill from ticket sales (expensive shareholder money) and part from a bank loan (cheaper debt). WACC blends the two.",
        why: 'Default discount rate for projects with the SAME risk as the company.',
      },
      {
        jargon: 'CAPM (Capital Asset Pricing Model)',
        plain:
          "A formula to estimate what return shareholders demand, based on how wobbly (risky) the company's shares are compared to the market.",
        analogy:
          "Punters demand bigger odds on a Championship team beating a Prem team than on Man City beating Luton. CAPM is the bookie's odds for stocks.",
        why: 'You will use CAPM to find cost of equity in almost every paper.',
      },
      {
        jargon: 'Beta',
        plain:
          "A number that measures how wobbly a share is vs the market. Beta of 1 means it moves with the market. Beta of 2 means it swings twice as hard.",
        analogy:
          "Beta is 'how loud does this player react when there's any drama'. 1 is average. 2 is double the chaos.",
        why: "Asset beta vs equity beta is the classic exam trick. You have to 'ungear' and 're-gear' it.",
      },
      {
        jargon: 'Modigliani & Miller Prop 2 (M&M2)',
        plain:
          "If a company borrows more debt, equity becomes riskier (more leverage means more wobble), so shareholders demand a higher return.",
        analogy:
          "If your team plays an extreme high line, attackers can score easier (more risk on defenders) so defenders demand more pay. Or you sell them.",
        why: 'Used to re-gear betas when the company changes its mix of debt and equity.',
      },
    ],
  },
  {
    group: 'B',
    badge: '📈',
    fixture: 'NPV. Inflation, Tax & Project Cash Flow',
    bigIdea:
      "A pound today is worth more than a pound next year. NPV adds up all the money a project will make over its life, adjusts it for time, and asks. Is this worth doing?",
    concepts: [
      {
        jargon: 'Net Present Value (NPV)',
        plain:
          "Add up all the project's future cash flows, but discount each one because money in the future is worth less than money today. Positive NPV means do it. Negative means bin it.",
        analogy:
          "Would you swap £100 today for £100 in 10 years? No. You'd want way more in 10 years. Same logic.",
        why: 'The core tool of AFM. Half the exam runs on this.',
      },
      {
        jargon: 'Time value of money',
        plain:
          "Money now is better than money later, because you could invest it, OR inflation will eat it.",
        analogy:
          "Getting your pocket money on Monday vs Sunday. Monday lets you spend it all week.",
        why: 'The reason we discount at all.',
      },
      {
        jargon: 'Nominal vs real cash flows',
        plain:
          "Nominal includes inflation. Real strips inflation out. You MUST match nominal cash flows with a nominal discount rate, and real with real. Don't mix.",
        analogy:
          "Like comparing two strikers' goal records but one's from the 1980s. You have to adjust for the era or it's nonsense.",
        why: "Examiner's favourite trap. Mix them up and the whole answer is wrong.",
      },
      {
        jargon: 'Tax shield',
        plain:
          "Interest on debt is tax-deductible. The government effectively pays part of your borrowing cost. So debt is cheaper than it looks.",
        analogy:
          "If you spend £100 on a gym membership for work and your boss reimburses £25, your real cost is £75.",
        why: 'Why companies use debt at all, and why APV exists.',
      },
      {
        jargon: 'Working capital',
        plain:
          "The day-to-day cash a business needs to keep running. Stock on shelves, money owed by customers. Growing the business usually means tying up MORE cash here.",
        analogy:
          "A bigger squad needs more kits, balls, and physio gel in stock. That money is locked up.",
        why: 'Forgetting working capital costs you marks every time.',
      },
    ],
  },
  {
    group: 'B',
    badge: '🎲',
    fixture: 'Risk Analysis (VaR, Monte Carlo, MIRR)',
    bigIdea:
      "Cash flows aren't certain. They're guesses. Risk analysis tells you HOW WRONG those guesses might be, and what happens in bad cases.",
    concepts: [
      {
        jargon: 'Value at Risk (VaR)',
        plain:
          "The most money you could lose on a normal bad day. e.g. '95% VaR of £2m over 1 day' means 'on the worst 1 in 20 days, we lose at least £2m'.",
        analogy:
          "'My team usually concedes 0-1 goals. But once every 20 games we ship 4+.' VaR is that 'once every 20 games' number.",
        why: '★-starred topic. Banks live by VaR. Learn the z-scores (1.645 for 95%, 2.33 for 99%).',
      },
      {
        jargon: 'Monte Carlo simulation',
        plain:
          "Run a project's cash flows 10,000 times with random variations in the inputs (sales, costs, FX). Get a whole bell-curve of possible NPVs, not just one guess.",
        analogy:
          "Sim a Champions League draw 10,000 times to see how often Spurs get an easy group. Same idea. Many random runs, count outcomes.",
        why: 'Verbal questions only. Usually about WHY it beats single-point NPV.',
      },
      {
        jargon: 'MIRR (Modified IRR)',
        plain:
          "Like IRR but more honest. Regular IRR assumes you can reinvest cash at the IRR itself, which is fantasy. MIRR uses a realistic reinvestment rate.",
        analogy:
          "IRR is like saying 'every player on the squad performs at our best player's level'. MIRR uses an actual squad average.",
        why: 'Quick calc question. Know the formula.',
      },
      {
        jargon: 'Sensitivity analysis',
        plain:
          "Change one input at a time and see how much the NPV moves. The variable that swings NPV the most is the one to worry about.",
        analogy:
          "If your team's results swing massively when one striker is out vs in, that striker is your sensitivity.",
        why: 'Always a follow-up to NPV. Quick marks.',
      },
    ],
  },
  {
    group: 'B',
    badge: '🏗️',
    fixture: 'APV (Adjusted Present Value)',
    bigIdea:
      "Sometimes a project has weird financing (cheap government loans, subsidies). WACC can't cope. APV values the project AS IF all-equity, then adds the financing perks separately.",
    concepts: [
      {
        jargon: 'Adjusted Present Value (APV)',
        plain:
          "Step 1: value the project assuming no debt. Step 2: add the value of any tax shield from debt. Step 3: add subsidies, minus issue costs. Total equals APV.",
        analogy:
          "Buying a phone. List price first, THEN add the trade-in discount, THEN subtract a delivery fee. Each bit valued separately.",
        why: 'Use APV instead of NPV when financing is unusual. Subsidised loans, changing capital structure.',
      },
      {
        jargon: 'Ungeared cost of equity',
        plain:
          "What shareholders would demand if the company had ZERO debt. Less risky than today, so the rate is lower.",
        analogy:
          "A defender's wages if the team played a back five with two holding mids. Less workload, less pay.",
        why: 'Step 1 of APV. Ungear the beta, plug into CAPM.',
      },
      {
        jargon: 'Tax shield value',
        plain:
          "The PV of all the tax saved because you can deduct interest. Discount the annual tax saving by the cost of debt.",
        analogy:
          "Adding up all future cashback you get from a credit card and bringing it to today's money.",
        why: 'Step 2 of APV. Always include it, often forgotten.',
      },
    ],
  },
  {
    group: 'B',
    badge: '🎰',
    fixture: 'Real Options (Delay, Expand, Abandon)',
    bigIdea:
      "Most projects have hidden flexibility. You can WAIT, GROW, or QUIT. That flexibility has value, and standard NPV ignores it.",
    concepts: [
      {
        jargon: 'Option to delay',
        plain:
          "You don't have to do the project now. Waiting might give better info, and waiting itself has value.",
        analogy:
          "Not buying FIFA on release day because the price drops in 3 months and you can read reviews. Waiting equals valuable.",
        why: 'Common in oil, pharma, R&D scenarios.',
      },
      {
        jargon: 'Option to expand',
        plain:
          "A small project might unlock a bigger one later if it works. The chance to expand has value even if the small project alone has a near-zero NPV.",
        analogy:
          "Signing a cheap young striker who might become world-class. Worth more than just his current value.",
        why: "If the question says 'phase 2' or 'follow-on opportunity', think real option.",
      },
      {
        jargon: 'Option to abandon',
        plain:
          "You can shut a loss-making project down and sell off the kit. That escape hatch is worth something today.",
        analogy:
          "Renting a car with a 'return any time' clause vs buying it outright. The clause equals abandon option.",
        why: 'Common in long-term capital projects.',
      },
      {
        jargon: 'Black-Scholes for real options',
        plain:
          "A formula originally for share options, repurposed to value real-world flexibility. Five inputs. Asset value, exercise cost, time, volatility, risk-free rate.",
        analogy:
          "Same recipe used to bake two different cakes. The recipe works because flexibility has the same maths underneath.",
        why: 'Memorise the 5 inputs and what each represents in the real-world story.',
      },
    ],
  },
  {
    group: 'B',
    badge: '🏷️',
    fixture: 'Business Valuation (DCF, FCF, Multiples)',
    bigIdea:
      "How much is a company actually worth? Three big methods, and you usually quote a RANGE, not a single number.",
    concepts: [
      {
        jargon: 'DCF (Discounted Cash Flow)',
        plain:
          "Forecast every future cash flow the company will produce, discount them all back to today, add them up. That's the value.",
        analogy:
          "Working out what a season-ticket is worth by adding up all the future games it'll get you in, but counting next year's match less than this year's.",
        why: 'Theoretical gold standard. Used in almost every valuation answer.',
      },
      {
        jargon: 'Free Cash Flow (FCF)',
        plain:
          "The cash the business has left after paying for its operations and investments. The bit available to investors.",
        analogy:
          "Your salary, minus rent, food, and gym fees. The leftover is what you can actually save or spend on yourself.",
        why: "FCF to Firm vs FCF to Equity. Know the difference. It changes the discount rate you use.",
      },
      {
        jargon: 'Terminal value',
        plain:
          "Most of a DCF's answer comes from a guess about what the business is worth FOREVER after the forecast ends. Usually 60-80% of the answer.",
        analogy:
          "Imagine valuing a star player only by what happens in the next 3 games, ignoring his entire career after. Terminal value fixes that.",
        why: 'Always test sensitivity to the growth rate (g). Tiny changes move the answer hugely.',
      },
      {
        jargon: 'Multiples (P/E, EV/EBITDA)',
        plain:
          "Quick valuation. 'Similar companies trade at 10x profits. Yours makes £5m profit. Therefore worth ~£50m'. Easy and rough.",
        analogy:
          "'Similar players go for £40m. He's similar. So he's worth ~£40m'. Comparable-sales pricing.",
        why: 'Always include as a sense-check on your DCF, never as the sole answer.',
      },
      {
        jargon: 'Synergies',
        plain:
          "If you bolt two companies together, sometimes 2 plus 2 equals 5. Shared costs go down. Revenue might grow. The extra value equals synergies.",
        analogy:
          "Two flatmates sharing a Netflix sub instead of paying for one each. Same enjoyment, half the cost.",
        why: 'Always stress-test synergies. Most M&A deals overestimate them.',
      },
    ],
  },
  {
    group: 'B',
    badge: '🕌',
    fixture: 'Islamic Finance & Ethical Funding',
    bigIdea:
      "Islamic finance bans interest (riba). Instead of lending money, you share in profits, lease assets, or co-own them. Same outcome, different structure.",
    concepts: [
      {
        jargon: 'Sukuk',
        plain:
          "An Islamic 'bond'. Instead of paying interest, the investor gets a share of the income from a real asset, like rent on a building.",
        analogy:
          "Buying a brick of a hotel and getting a slice of the room-bookings revenue, instead of just lending cash for interest.",
        why: 'Most common term to know. Always mentions an underlying asset.',
      },
      {
        jargon: 'Murabaha',
        plain:
          "The bank buys an item you want, then sells it to you at a marked-up price you pay over time. The mark-up is the profit. Technically not interest.",
        analogy:
          "Your mate buys the new PS5 for £500, then sells it to you for £600 paid in £50 monthly instalments. He earned £100. But it's profit on a sale, not loan interest.",
        why: 'Used for short-term trade finance.',
      },
      {
        jargon: 'Mudaraba',
        plain:
          "Profit-sharing partnership. One side puts in the money, the other puts in the work. Profits split by ratio. Losses fall on the money-provider.",
        analogy:
          "Your nan funds your lemonade stand. You run it. You split the profit 60/40. If it tanks, she loses the cash, not you.",
        why: 'Comes up in venture / project finance questions.',
      },
      {
        jargon: 'Ijara',
        plain:
          "Islamic leasing. The bank owns the asset, you pay rent to use it. At the end, you might buy it.",
        analogy:
          "Renting a car with the option to buy it at the end of the lease.",
        why: 'Equivalent to Western finance lease. Make the comparison.',
      },
    ],
  },
  {
    group: 'C',
    badge: '🤝',
    fixture: 'M&A, Reorganisation, Buybacks',
    bigIdea:
      "Companies grow by buying other companies, sometimes restructure to survive, and return spare cash by buying back their own shares.",
    concepts: [
      {
        jargon: 'Synergy (M&A)',
        plain:
          "The reason two firms are 'worth more together than apart'. Could be cost savings (one HQ not two) or revenue boosts (cross-selling).",
        analogy:
          "Spurs plus Arsenal training-ground (hypothetically). One set of staff, double the players using it. Fewer costs, same output.",
        why: 'You must quantify synergies separately from the standalone valuation.',
      },
      {
        jargon: 'Bootstrap effect (EPS games)',
        plain:
          "If a high-P/E company buys a low-P/E one with shares, the combined EPS goes UP without any real value being created. Just a maths trick.",
        analogy:
          "Mixing a strong squash with a weak one and saying the new drink is 'stronger than the weak one'. True, but meaningless.",
        why: 'Examiner LOVES this trap. Spot it and call it out.',
      },
      {
        jargon: 'Methods of payment (cash vs shares)',
        plain:
          "You can pay for an acquisition with cash, your own shares, or a mix. Each has different effects on control, risk, and tax.",
        analogy:
          "Paying for FIFA Ultimate Team packs with V-bucks vs real money. Different sources, different consequences.",
        why: 'Always discuss BOTH bidder and target perspectives in your answer.',
      },
      {
        jargon: 'Share buyback',
        plain:
          "Company uses spare cash to buy its OWN shares from the market. Fewer shares means each remaining share owns a bigger slice.",
        analogy:
          "Cutting a pizza into 6 slices instead of 8. Each slice is bigger, but the pizza is the same.",
        why: 'Often an alternative to paying a dividend. Compare both in your answer.',
      },
      {
        jargon: 'Reorganisation / restructuring',
        plain:
          "When a company is struggling, it might sell off divisions, write down debts, or split into pieces (demerger) to fix itself.",
        analogy:
          "A struggling club selling its best players to balance the books and rebuild around youth.",
        why: 'Common when the scenario has a loss-making division or a distressed company.',
      },
    ],
  },
  {
    group: 'D/E',
    badge: '🌍',
    fixture: 'FX Risk Hedging (MMH, Forwards, Futures, Options)',
    bigIdea:
      "If your company gets paid in dollars but pays bills in pounds, exchange-rate moves can wreck your profits. Hedging locks in a rate now.",
    concepts: [
      {
        jargon: 'FX exposure',
        plain:
          "You're exposed if a swing in exchange rates makes you better or worse off. Three types. Transaction (a specific payment), translation (accounts), economic (long-term competitiveness).",
        analogy:
          "If you're going to Disneyland Paris next summer, you're exposed to GBP/EUR moves on your spending money.",
        why: 'Always identify the type and direction first.',
      },
      {
        jargon: 'Forward contract',
        plain:
          "A private deal with a bank to swap currencies at a fixed rate on a future date. Locked in. No flexibility.",
        analogy:
          "Pre-booking euros at today's rate for your trip in 6 months. Whatever happens to the rate, you've fixed yours.",
        why: 'Default hedge. Compare against in every FX question.',
      },
      {
        jargon: 'Money Market Hedge (MMH)',
        plain:
          "Borrow now in one currency, swap to the other immediately, deposit until needed. The two interest rates lock in your effective rate.",
        analogy:
          "Pre-buying euros NOW (taking out a small loan for it), parking them in a French savings account until your trip.",
        why: 'You will be asked to calculate this. Drill the 4-step process.',
      },
      {
        jargon: 'Currency futures',
        plain:
          "Like forwards but standardised and traded on an exchange. Daily margin calls and basis risk (futures price does not exactly equal spot).",
        analogy:
          "Forwards are bespoke (tailor-made shirt). Futures are off-the-rack at JD Sports. Fits 'close enough'.",
        why: 'Calculation. Contracts to buy/sell, ticks, gain/loss. Practise these.',
      },
      {
        jargon: 'Currency options',
        plain:
          "The RIGHT but not the OBLIGATION to swap at a set rate. Costs a premium upfront. If rates move your way, you don't use it.",
        analogy:
          "Buying travel insurance. You pay a fee, hope to never claim, but glad you have it if things go wrong.",
        why: 'Compare. Option preserves upside, others lock you in. Trade-off equals premium cost.',
      },
    ],
  },
  {
    group: 'D/E',
    badge: '📊',
    fixture: 'Interest Rate Hedging (FRA, Swap, Futures, Options, Greeks)',
    bigIdea:
      "If a company borrows money on a floating rate, a sudden rise in interest rates could bankrupt it. Hedges lock or cap the rate.",
    concepts: [
      {
        jargon: 'FRA (Forward Rate Agreement)',
        plain:
          "A private agreement to fix an interest rate today for a future period. If actual rate is higher, you get the difference. If lower, you pay it.",
        analogy:
          "Locking your phone plan at £20/month NOW for next year, even if everyone else's bill goes up to £25.",
        why: 'Bread-and-butter calculation. Know the settlement formula.',
      },
      {
        jargon: 'Interest rate swap',
        plain:
          "Swap your floating-rate loan for someone else's fixed-rate loan. You don't actually exchange the loans, you just exchange the interest payments.",
        analogy:
          "You and a mate swap your daily packed lunch for a school dinner ticket. The food is what gets traded, not the lunchbox itself.",
        why: 'Examiner often tests the gain calc. Find the joint saving, then split it.',
      },
      {
        jargon: 'Interest rate futures',
        plain:
          "Standardised exchange-traded contracts. Their price moves inversely to interest rates. You sell futures to hedge against rising rates.",
        analogy:
          "If rising rates are 'rain', selling futures is the umbrella. You profit if it rains.",
        why: 'Calc. Number of contracts, ticks, hedge result.',
      },
      {
        jargon: 'Interest rate options (caps, floors, collars)',
        plain:
          "Pay a premium for a CAP on how high your rate can go. Combine with selling a FLOOR (giving up some upside) to make it cheap, equals collar.",
        analogy:
          "A cap is paying for guaranteed first-class WiFi up to a max speed. A collar is the same but you also agree to a minimum.",
        why: 'Pick instrument based on cost tolerance and direction certainty.',
      },
      {
        jargon: 'The Greeks (delta, gamma, vega, theta, rho)',
        plain:
          "Each Greek measures how an option's price reacts to one variable. Delta equals sensitivity to price. Vega equals sensitivity to volatility. Theta equals time decay. Rho equals interest rate. Gamma equals how fast delta itself changes.",
        analogy:
          "Imagine a striker's form. Delta equals goals per game. Theta equals how form decays with age. Vega equals how form reacts to chaos in the team. Each Greek is one dial.",
        why: "You don't need formulas. Examiner asks 'what would happen to the option if X moves'. Know directions.",
      },
    ],
  },
];

const GROUP_TONE: Record<string, string> = {
  'A': 'from-primary/[0.08] via-white to-accent/[0.10]',
  'B': 'from-accent/[0.10] via-white to-primary/[0.08]',
  'C': 'from-primary/[0.12] via-white to-accent/[0.06]',
  'D/E': 'from-accent/[0.06] via-white to-primary/[0.10]',
};

export function ChampionsLeaguePage() {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Hero */}
      <motion.section
        variants={fadeUp}
        className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-soft"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.10] via-white to-accent/[0.10]" />
        <div className="aurora w-72 h-72 -top-12 -right-12" style={{ background: 'radial-gradient(circle, rgba(245,184,0,0.45), transparent 70%)' }} />
        <div className="relative p-6 md:p-10">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="chip text-primary">
              <i className="fa-solid fa-trophy" /> Champions League
            </span>
            <Pill variant="accent">Plain English</Pill>
            <Pill>Explain it like I'm 13</Pill>
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase text-ink leading-[0.95]">
            Every AFM idea,<br />
            <span className="text-gradient">in normal-person words.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-ink/80 leading-relaxed">
            No formulas. No exam-speak. Just plain English with football and everyday analogies,
            so the jargon stops feeling scary. Once you GET each idea here, the rest of the site
            will click ten times faster.
          </p>
          <p className="mt-3 max-w-2xl text-[13px] text-muted">
            Think of this as the Champions League group stage. Meet every team (concept) once,
            casually. The real matches (drills, mocks, past papers) are over on the Training pages.
          </p>
        </div>
      </motion.section>

      {/* How to use */}
      <SectionTitle icon="fa-solid fa-compass">How to read this page</SectionTitle>
      <motion.div variants={stagger} className="grid sm:grid-cols-3 gap-3">
        <motion.div variants={fadeUp}>
          <Card className="!p-4 h-full">
            <div className="font-display text-lg uppercase tracking-wide text-primary">1. Jargon</div>
            <p className="mt-1.5 text-[13px] text-ink leading-relaxed">
              The technical name examiners use. Don't panic, it always has a plain meaning underneath.
            </p>
          </Card>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Card className="!p-4 h-full">
            <div className="font-display text-lg uppercase tracking-wide text-primary">2. Plain English</div>
            <p className="mt-1.5 text-[13px] text-ink leading-relaxed">
              What it actually means, in normal words. If you can explain it back to a 13-year-old, you've got it.
            </p>
          </Card>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Card className="!p-4 h-full">
            <div className="font-display text-lg uppercase tracking-wide text-primary">3. Football / life analogy</div>
            <p className="mt-1.5 text-[13px] text-ink leading-relaxed">
              A picture in your head. This is what survives exam-day stress when the formula doesn't.
            </p>
          </Card>
        </motion.div>
      </motion.div>

      {/* The 12 matches */}
      {MATCHES.map((m, i) => (
        <section key={m.fixture}>
          <SectionTitle
            icon="fa-solid fa-futbol"
            badge={<Pill variant={m.group === 'B' ? 'accent' : 'primary'}>Group {m.group}</Pill>}
            rightSlot={<>Match {i + 1} of 12</>}
          >
            <span className="mr-2">{m.badge}</span>
            {m.fixture}
          </SectionTitle>

          <motion.div
            variants={fadeUp}
            className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${GROUP_TONE[m.group]} p-5 mb-4`}
          >
            <div className="text-[11px] uppercase tracking-wider text-muted font-bold mb-1">
              The big idea
            </div>
            <p className="text-[15px] text-ink leading-relaxed">{m.bigIdea}</p>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {m.concepts.map((c) => (
              <motion.div key={c.jargon} variants={fadeUp}>
                <Card className="!p-5 h-full">
                  <div className="flex items-start gap-2 flex-wrap">
                    <div className="font-display text-xl uppercase tracking-wide text-primary leading-tight">
                      {c.jargon}
                    </div>
                  </div>
                  <div className="mt-3 space-y-3">
                    <div>
                      <div className="text-[10.5px] uppercase tracking-wider text-muted font-bold mb-1">
                        Plain English
                      </div>
                      <p className="text-[13.5px] text-ink leading-relaxed">{c.plain}</p>
                    </div>
                    <div className="rounded-lg bg-accent/[0.10] border border-accent/40 px-3 py-2">
                      <div className="text-[10.5px] uppercase tracking-wider text-ink/70 font-bold mb-1">
                        <i className="fa-solid fa-futbol mr-1" /> Analogy
                      </div>
                      <p className="text-[13px] text-ink leading-relaxed italic">{c.analogy}</p>
                    </div>
                    <div>
                      <div className="text-[10.5px] uppercase tracking-wider text-muted font-bold mb-1">
                        Why it matters in the exam
                      </div>
                      <p className="text-[12.5px] text-ink/80 leading-relaxed">{c.why}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>
      ))}

      {/* Closing */}
      <motion.section variants={fadeUp} className="mt-12 rounded-2xl border-2 border-dashed border-accent/60 bg-accent/[0.08] p-6 text-center">
        <div className="font-display text-2xl uppercase tracking-wider text-ink">
          That's the group stage done.
        </div>
        <p className="mt-3 text-[14px] text-ink/80 max-w-2xl mx-auto leading-relaxed">
          You've now met all 12 concepts in plain English. The Topics pages drill the maths,
          the Past Papers pages show how examiners actually phrase it, and the Mock pages
          stress-test you under time pressure. Knock out should feel a lot less scary now.
        </p>
        <p className="mt-4 font-display text-primary tracking-widest text-base">
          PLAIN ENGLISH FIRST. FORMULAS SECOND. EXAM TECHNIQUE THIRD.
        </p>
      </motion.section>
    </motion.div>
  );
}

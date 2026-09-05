# AFM method sheets

Teaching reference, not an official ACCA formula sheet or mark scheme. Define units and follow each question’s conventions. Attempt from memory before using these sheets.

## 1. Investment appraisal

**Timeline:** t0 investment and working capital; nominal operating cash flows; tax at its actual payment date; disposal and working-capital recovery; delayed tax if applicable. Incremental cash flows exclude sunk costs. Add back accounting depreciation when starting with profit. Tax allowances create tax effects, not operating cash expenses.

**Working capital:** cash movement = old required balance − new required balance. Recover only the remaining recoverable balance at the end. Do not add every prior investment again.

**International:** local nominal flows, local tax/loss rules, remittance limits, FX translation, incremental parent contribution and incremental home tax. Avoid double counting transfer payments. For foreign currency per home unit: S(t) = S(0)[(1+i_foreign)/(1+i_home)]^t. Home currency = foreign currency / S(t).

**Decision paragraph:** NPV [amount and currency], hence [accept/reject on stated financial grounds], subject to [case-specific assumption and its effect]. Add non-financial issues where requested.

Practice: SP-Q2, SD23-Q1, SD25-Q1, MS26-Q1.

## 2. Beta, WACC and APV

With debt beta zero: βa = βe E/[E+D(1−T)]. Regear βe = βa[E+D(1−T)]/E. With non-zero debt beta, include its weighted contribution. CAPM: ke = rf + βe × equity risk premium. Ungeared return uses βa. WACC = ke E/(E+D) + kd(after tax) D/(E+D). Market values and matching risk matter.

APV = base NPV at ungeared return + PV financing benefits − financing costs. Schedule interest shields on outstanding debt and recognise tax lags. State the rate used for shields/subsidies and why it fits the risk. Do not tax-adjust a subsidy and add tax benefits in a way that counts the same saving twice.

Gross funding = required net funding/(1−fee rate) only if fees must come from gross proceeds. Robson pays fees from reserves. Helios finances fees as part of gross proceeds. Read the distinction.

Practice: SP-Q1, P2-Q2, MS26-Q1, MJ26-Q2.

## 3. Real options

Expansion/delay: generally a call. Abandonment for a guaranteed sale value: generally a put. Map the specific managerial choice before calculation.

Pa = present value of relevant underlying operating cash flows; Pe = exercise cash amount; t = years to choice; r = risk-free model rate; σ = annual volatility. A future project NPV is not Pa. In Jigu, Year-4 operating value = 10+60 = $70m, so Pa today = 70/1.11⁴ = $46.111m.

For a non-dividend-paying underlying: C = Pa N(d1) − Pe exp(−rt) N(d2); d1 = [ln(Pa/Pe)+(r+σ²/2)t]/(σ√t); d2=d1−σ√t. P = C−Pa+Pe exp(−rt). Use the exam’s provided BSOP tool when applicable and ensure inputs match the required option. Do not add the base value and a full option value for the same flexible opportunity twice.

Practice: P1-Q1, S22-Q1, MJ24-Q2, D22-Q3.

## 4. Valuation and acquisition offers

FCFF = EBIT(1−T)+depreciation−capex−increase in working capital. Discount at WACC, then bridge enterprise value to equity. FCFE = profit after tax+depreciation−capex−increase in working capital+net borrowing. Discount at ke; this already values equity.

Terminal value at year n = CF(n+1)/(k−g). Discount that terminal value to today. Growth must be sustainable and k>g. Dividend value = next dividend/(ke−g) for the constant-growth model. P/E uses a comparable post-tax earnings basis.

Combined value − acquirer standalone − target standalone = value created. Cash offer: acquirer remaining wealth = combined equity − cash consideration, subject to the stated financing assumptions. Share offer: add new shares to the denominator and value each group’s resulting holding. Seller gain = consideration/old target value −1. Acquirer gain uses the acquirer’s old wealth as denominator. Share of synergy is a different ratio.

Practice: MJ24-Q3, MJ25-Q1, SD25-Q2, MS26-Q2, MJ26-Q3.

## 5. FX hedges

Write payment/receipt, currency, date and adverse movement. Bank spread: ask what the bank buys or sells. Check units algebraically. Do not choose multiply/divide by habit.

Futures: contract currency, buy/sell direction, maturity, contracts, closing price or unexpired basis, gain/loss, residual cover, final home-currency result. If basis is defined as spot minus futures, maintain that sign convention throughout. Follow stated rounding. A contract-count denominator may use the relevant futures or effective hedge rate according to the question’s convention.

Options: choose the call/put on the contract currency, compare exercise versus lapse, add premium in the comparison currency and hedge any residual as instructed. The premium is paid even if the option lapses. Forwards match a specific amount/date but create counterparty exposure. Futures require liquidity for margin. Initial margin is refundable collateral, with opportunity/financing costs.

Money-market hedge: for a foreign receipt, borrow the discounted foreign amount now, convert now and invest home currency. For a foreign payment, invest the discounted foreign amount now, funded in home currency. Use borrowing and deposit rates appropriately.

Practice: SP-Q3, MJ24-Q1, SD25-Q3, MJ26-Q1, MS26-Q3.

## 6. Interest-rate futures, options, collars and swaps

Price = 100 − annual interest rate in percent. Borrower fears a rise: sell futures/buy puts. Depositor fears a fall: buy futures/buy calls. Contracts = exposure/contract principal × exposure months/contract months, with required rounding.

Futures payoff = price movement expressed as a rate × contract principal × contract interest period × number. Alternatively use ticks × tick value × contracts. Include cash interest, payoff and premium. Annual effective rate = net interest / (principal × exposure fraction of year).

Borrower collar usually buys a put and sells a call on interest-rate futures; depositor collar usually buys a call and sells a put. Include both legs and net premium. Test both rate scenarios. Swaps: calculate the comparative borrowing advantage, subtract all intermediary fees, allocate savings, and reconcile borrowing plus swap cash flows.

Practice: P1-Q3, SD23-Q3, SD24-Q1, MJ25-Q2, MD25-Q2, MS26-Q3.

## 7. Treasury, performance and judgement

Netting: convert to one currency, total receipts/payments, calculate company net positions, verify sum zero and prepare permitted settlement flows. Netting reduces transactions, not every residual risk. Central treasury can pool liquidity and expertise but must manage local knowledge, legal restrictions and accountability.

Ratios: operating margin = EBIT/revenue; ROCE = EBIT/capital employed (state definition); interest cover = EBIT/finance costs; gearing = debt/(debt+equity) or debt/equity (label it); dividend cover = earnings/dividends; dividend yield = dividend per share/price; P/E = price/EPS. Explain trend, scenario cause, consequence and missing evidence. Cash-based dividend capacity differs from profit or NPV.

Professional response: case fact, financial effect, tested assumption, answer to the requirement. Ethical action should address the affected stakeholder and the practical constraint. Avoid generic lists. Competition/regulation answers must follow the question’s setting rather than assumed current law.

Practice: SD23-Q2, MJ25-Q3, MJ26-Q1–2, P1-Q1–2.

## 8. Risk diagnostics

Approximate normal VaR = z × σ. Under independent equally variable periods, σ_total = σ_annual √n. VaR is a confidence threshold, not a worst-case loss. Discounted NPV risk requires consistent timing and covariance treatment.

Sensitivity to a proportional cash-flow change: solve the change that reduces NPV to zero. If post-tax operating flows scale proportionately with no other tax/timing effects, sensitivity fraction = NPV / PV of those affected flows. For rate sensitivity, find the discount rate where NPV=0 and compare with the base rate. Negative NPV requires improvement rather than tolerable deterioration.

Practice: MS26-Q1. Always state the cash-flow, normality and independence assumptions.

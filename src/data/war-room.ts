export interface CommonLoser {
  topic: string;
  loss: string;
  fix: string;
}

export const COMMON_LOSERS: CommonLoser[] = [
  { topic: 'NPV', loss: 'Mixing real cash flows with a nominal discount rate (Fisher trap)', fix: 'State whether you are working in real or nominal terms in W1. Stay consistent.' },
  { topic: 'NPV', loss: 'Treating tax-allowable depreciation as a cash outflow', fix: 'Depreciation is not cash. The tax SAVING on it (Dep × T) is the cash flow.' },
  { topic: 'WACC', loss: 'Using book values not market values for E and D weights', fix: 'Always market values unless told otherwise. Quote the source.' },
  { topic: 'APV', loss: 'Discounting the tax shield at WACC', fix: 'WACC already embeds the tax shield. Discount it at Kd or Rf to avoid double-counting.' },
  { topic: 'BSOP', loss: 'Flipping Pa and Pe (asset price vs exercise price)', fix: 'Pa = what you GET on exercise. Pe = what you PAY on exercise. Write them down before any sums.' },
  { topic: 'BSOP', loss: 'Using simple discounting on Pe instead of e^(-rt)', fix: 'Black-Scholes uses CONTINUOUS discounting. Always EXP(-rt).' },
  { topic: 'M&A', loss: 'Bidding above the maximum bid price', fix: 'Max bid = stand-alone target value + acquirer share of synergy. Above this destroys acquirer wealth.' },
  { topic: 'FX hedge', loss: 'Wrong side of bid/ask on the forward', fix: 'BUY foreign at bank OFFER (the higher rate). SELL foreign at bank BID. Walk through bank perspective.' },
  { topic: 'FX hedge', loss: 'Forgetting to future-value the option premium', fix: 'Premium is paid TODAY. Compare on the same date by future-valuing to the cash flow date.' },
  { topic: 'IR hedge', loss: 'Confusing borrower vs depositor side of an FRA', fix: 'BORROWERS BUY FRAs (fearing rate rises). DEPOSITORS SELL FRAs (fearing rate falls).' },
  { topic: 'VaR', loss: 'Quoting two-tailed z values for a one-tailed VaR', fix: 'One-tail at 99% = 2.326. Two-tail 99% = 2.576. AFM normally one-tailed.' },
  { topic: 'ESG', loss: 'Generic ESG prose with no scenario figure', fix: 'Always Issue → Action → Outcome with a £ figure or stakeholder name from the case.' },
  { topic: 'Real options', loss: 'Quoting volatility from the WRONG underlying', fix: 'Volatility = sigma of the project asset value, not the share price.' },
  { topic: 'Section A', loss: 'Burying the recommendation in paragraph 4', fix: 'Lead with your recommendation in sentence one. The marker is busy.' },
];

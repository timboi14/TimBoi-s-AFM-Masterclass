import { useCBE } from './cbe-context';
import { CalculatorPopup } from './CalculatorPopup';
import { ScratchPadPopup } from './ScratchPadPopup';
import { SymbolPopup } from './SymbolPopup';
import { Navigator } from './Navigator';

/** Renders whichever CBE floating tools are currently open. */
export function CBEPopups() {
  const { isOpen } = useCBE();
  return (
    <>
      {isOpen('calculator') && <CalculatorPopup />}
      {isOpen('scratchpad') && <ScratchPadPopup />}
      {isOpen('symbol') && <SymbolPopup />}
      {isOpen('navigator') && <Navigator />}
    </>
  );
}

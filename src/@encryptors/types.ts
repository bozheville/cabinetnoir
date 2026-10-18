import { PaneProps } from "evergreen-ui";

interface OnProcessingEndProps {
  output: string;
}
export interface CrypterProps extends PaneProps {
  input: string;
  onProcessingEnd: (props: OnProcessingEndProps) => void;
  isDecryptMode: boolean;
  // Panes that edit the input themselves (pigpen's glyph keyboard)
  // receive the setter; optional, everyone else ignores it.
  onInputChange?: (value: string) => void;
  // Panes with selectable key variants (pigpen) report the choice
  // upward so the output side renders for the right variant.
  onVariantChange?: (variant: string) => void;
}

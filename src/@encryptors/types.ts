import React from 'react';

interface OnProcessingEndProps {
  output: string;
}

// The pane root is a plain div: it only ever carried arbitrary div
// attributes, which HTMLAttributes covers.
export interface CrypterProps extends React.HTMLAttributes<HTMLDivElement> {
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

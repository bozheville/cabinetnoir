import { PaneProps } from "evergreen-ui";

interface OnProcessingEndProps {
  output: string;
}
export interface CrypterProps extends PaneProps {
  input: string;
  onProcessingEnd: (props: OnProcessingEndProps) => void;
  isDecryptMode: boolean;
}

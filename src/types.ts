export interface Servico {
  SERVIÇOS: string;
  "FABRICAÇÃO (RESPONSÁVEL)": string;
  "STATUS FABRICAÇÃO": string;
  "PINTURA ": string;
  "STATUS PINTURA": string;
  "MÁQUINA ": string;
  "STATUS MÁQUINA ": string;
  "INSTALADOR ": string;
  "STATUS INSTALAÇÃO": string;
  OBSERVAÇÕES: string;
  "DATA INSTALAÇÃO"?: string; // Keeping it optional just in case
}

export type StatusColor = "red" | "yellow" | "green" | "gray";

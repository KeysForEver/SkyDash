export interface Servico {
  SERVIÇOS: string;
  "FABRICAÇÃO (RESPONSÁVEL)": string;
  "STATUS FABRICAÇÃO": string;
  PINTURA: string;
  "STATUS PINTURA": string;
  MÁQUINA: string;
  "STATUS MÁQUINA": string;
  INSTALADOR: string;
  "STATUS INSTALAÇÃO": string;
  OBSERVAÇÕES: string;
  "DATA INSTALAÇÃO"?: string;
  DATA?: string;
  "DATA INICIAL"?: any;
  "DATA FINAL"?: any;
}

export type StatusColor = "red" | "yellow" | "green" | "gray";

import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

const { utils, writeFile } = (XLSX as any).default || XLSX;

const searchDir = path.join(process.cwd(), "public");
if (!fs.existsSync(searchDir)) {
  fs.mkdirSync(searchDir, { recursive: true });
}

const outputPath = path.join(searchDir, "Serviços.xlsx");

const wb = utils.book_new();

// Sheet 1: "!" containing Status and Color configurations
const statusData = [
  ["STATUS", "COR"],
  ["CONCLUÍDO", "#34A853"],
  ["CONCLUÍDO C/ RESSALVAS", "#4285F4"],
  ["PENDENTE", "#FBBC04"],
  ["ATRASADO", "#EA4335"],
];
const wsStatus = utils.aoa_to_sheet(statusData);
utils.book_append_sheet(wb, wsStatus, "!");

// Sheet 2: "Planilha1" containing the service details
const servicesData = [
  ["DATA INICIAL", "DATA FINAL", "SERVIÇOS", "FABRICAÇÃO (RESPONSÁVEL)", "STATUS FABRICAÇÃO", "PINTURA", "STATUS PINTURA", "MÁQUINA", "STATUS MÁQUINA", "INSTALADOR", "STATUS INSTALAÇÃO", "OBSERVAÇÕES"],
  ["22/06/2026", "25/06/2026", "CARRINHOS ALVARO", "ROBSON/DIEGO", "CONCLUÍDO", "ELETROSTÁTICA/ CARLOS", "CONCLUÍDO", "ROUTER", "CONCLUÍDO", "DIEGO", "CONCLUÍDO", "FALTA CLIENTE BUSCAR"],
  ["26/06/2026", "26/06/2026", "SINDI", "ROBSON/ZAIDAN", "CONCLUÍDO", "NÃO TEM PINTURA", "", "ROUTER", "", "RONALDO/PEDRO", "CONCLUÍDO", "CLIENTE NAO QUIS INSTALAR A DA CAIXA DAGUA"],
  ["25/06/2026", "29/06/2026", "CONFIS LOGO LUMINARIA", "ROBSON/ELDER", "CONCLUÍDO", "DAVIDSON/ AUTOMOTIVA", "CONCLUÍDO", "ROUTER/LASER", "CONCLUÍDO", "PENDENTE", "PENDENTE", "FALTA INSTALAÇÃO"],
  ["28/06/2026", "28/06/2026", "FELICIO ROCHO PARTE 1", "DIEGO/FERNANDO", "CONCLUÍDO", "DAVIDSON/ AUTOMOTIVA", "CONCLUÍDO", "ROUTER/LASER", "CONCLUÍDO", "RONALDO/PEDRO", "CONCLUÍDO", "FALTA FAZR LIGAÇÃO ELETRICA AGUARDANDO CLIENTE COM PONTO DE ENERGIA"],
  ["29/06/2026", "02/07/2026", "AMORA BETIM", "ROBSON/ELDER", "CONCLUÍDO", "ELETROSTÁTICA/ CARLOS", "CONCLUÍDO", "ROUTER/LASER", "CONCLUÍDO", "BARBA", "CONCLUÍDO", ""],
];
const wsServices = utils.aoa_to_sheet(servicesData);
utils.book_append_sheet(wb, wsServices, "Planilha1");

writeFile(wb, outputPath);
console.log("Created file at:", outputPath);

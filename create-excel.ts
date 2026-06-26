import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

const { utils, writeFile } = (XLSX as any).default || XLSX;

const searchDir = path.join(process.cwd(), "public");
if (!fs.existsSync(searchDir)) {
  fs.mkdirSync(searchDir, { recursive: true });
}

const defaultPath = path.join(searchDir, "SERVIÇOS 22.xlsx");
const alternatePath = path.join(searchDir, "Serviços.xlsx");
const simplePath1 = path.join(searchDir, "servicos.xlsx");
const simplePath2 = path.join(searchDir, "servicos_22.xlsx");

const wb = utils.book_new();
const data = [
  ["DATA INICIAL", "DATA FINAL", "SERVIÇOS", "FABRICAÇÃO (RESPONSÁVEL)", "STATUS FABRICAÇÃO", "PINTURA", "STATUS PINTURA", "MÁQUINA", "STATUS MÁQUINA", "INSTALADOR", "STATUS INSTALAÇÃO", "OBSERVAÇÕES"],
  ["22/06/2026", "25/06/2026", "CARRINHOS ALVARO", "ROBSON/DIEGO", "CONCLUÍDO", "ELETROSTÁTICA/ CARLOS", "CONCLUÍDO", "ROUTER", "CONCLUÍDO", "DIEGO", "CONCLUÍDO", "FALTA CLIENTE BUSCAR"],
  ["26/06/2026", "26/06/2026", "SINDI", "ROBSON/ZAIDAN", "CONCLUÍDO", "NÃO TEM PINTURA", "", "ROUTER", "", "RONALDO/PEDRO", "CONCLUÍDO", "CLIENTE NAO QUIS INSTALAR A DA CAIXA DAGUA"],
  ["25/06/2026", "29/06/2026", "CONFIS LOGO LUMINARIA", "ROBSON/ELDER", "CONCLUÍDO", "DAVIDSON/ AUTOMOTIVA", "CONCLUÍDO", "ROUTER/LASER", "CONCLUÍDO", "PENDENTE", "PENDENTE", "FALTA INSTALAÇÃO"],
  ["28/06/2026", "28/06/2026", "FELICIO ROCHO PARTE 1", "DIEGO/FERNANDO", "CONCLUÍDO", "DAVIDSON/ AUTOMOTIVA", "CONCLUÍDO", "ROUTER/LASER", "CONCLUÍDO", "RONALDO/PEDRO", "CONCLUÍDO", "FALTA FAZR LIGAÇÃO ELETRICA AGUARDANDO CLIENTE COM PONTO DE ENERGIA"],
  ["29/06/2026", "02/07/2026", "AMORA BETIM", "ROBSON/ELDER", "CONCLUÍDO", "ELETROSTÁTICA/ CARLOS", "CONCLUÍDO", "ROUTER/LASER", "CONCLUÍDO", "BARBA", "CONCLUÍDO", ""],
];
const ws = utils.aoa_to_sheet(data);
utils.book_append_sheet(wb, ws, "Serviços");
writeFile(wb, defaultPath);
writeFile(wb, alternatePath);
writeFile(wb, simplePath1);
writeFile(wb, simplePath2);
console.log("Created files at:", [defaultPath, alternatePath, simplePath1, simplePath2].join(", "));

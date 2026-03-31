import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

const { utils, writeFile } = (XLSX as any).default || XLSX;

const searchDir = path.join(process.cwd(), "public");
if (!fs.existsSync(searchDir)) {
  fs.mkdirSync(searchDir, { recursive: true });
}

const defaultPath = path.join(searchDir, "SERVIÇOS 22.xlsx");
const wb = utils.book_new();
const data = [
  ["DATA", "SERVIÇOS", "FABRICAÇÃO (RESPONSÁVEL)", "STATUS FABRICAÇÃO", "PINTURA", "STATUS PINTURA", "MÁQUINA", "STATUS MÁQUINA", "INSTALADOR", "STATUS INSTALAÇÃO", "OBSERVAÇÕES"],
  ["01/03/2026", "CARRINHOS ALVARO", "ROBSON/DIEGO", "CONCLUÍDO", "ELETROSTÁTICA/ CARLOS", "CONCLUÍDO", "ROUTER", "CONCLUÍDO", "DIEGO", "CONCLUÍDO", "FALTA CLIENTE BUSCAR"],
  ["02/03/2026", "SINDI", "ROBSON/ZAIDAN", "CONCLUÍDO", "NÃO TEM PINTURA", "", "ROUTER", "", "RONALDO/PEDRO", "CONCLUÍDO", "CLIENTE NAO QUIS INSTALAR A DA CAIXA DAGUA"],
  ["03/03/2026", "CONFIS LOGO LUMINARIA", "ROBSON/ELDER", "CONCLUÍDO", "DAVIDSON/ AUTOMOTIVA", "CONCLUÍDO", "ROUTER/LASER", "CONCLUÍDO", "PENDENTE", "PENDENTE", "FALTA INSTALAÇÃO"],
  ["04/03/2026", "FELICIO ROCHO PARTE 1", "DIEGO/FERNANDO", "CONCLUÍDO", "DAVIDSON/ AUTOMOTIVA", "CONCLUÍDO", "ROUTER/LASER", "CONCLUÍDO", "RONALDO/PEDRO", "CONCLUÍDO", "FALTA FAZR LIGAÇÃO ELETRICA AGUARDANDO CLIENTE COM PONTO DE ENERGIA"],
  ["05/03/2026", "AMORA BETIM", "ROBSON/ELDER", "CONCLUÍDO", "ELETROSTÁTICA/ CARLOS", "CONCLUÍDO", "ROUTER/LASER", "CONCLUÍDO", "BARBA", "CONCLUÍDO", ""],
];
const ws = utils.aoa_to_sheet(data);
utils.book_append_sheet(wb, ws, "Serviços");
writeFile(wb, defaultPath);
console.log("Created file at", defaultPath);

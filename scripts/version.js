#!/usr/bin/env node
/**
 * Script de versionado automático para AdminLove
 * Uso: node scripts/version.js [major|minor|patch]
 */

import fs from 'fs';
import path from 'path';

const packageJsonPath = path.resolve(process.cwd(), 'package.json');
const VERSION_FILE_PATH = path.resolve(process.cwd(), 'src', 'version.ts');

// Leer argumentos
const tipo = process.argv[2] || 'patch';

// Leer package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const versionActual = packageJson.version;

// Parsear versión actual
const [major, minor, patch] = versionActual.split('.').map(Number);

// Incrementar versión
let nuevaVersion;
switch (tipo) {
  case 'major':
    nuevaVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    nuevaVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
  default:
    nuevaVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

// Actualizar package.json
packageJson.version = nuevaVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

// Crear archivo de versión para la app
const versionTs = `// Auto-generado por scripts/version.js
// NO EDITAR MANUALMENTE
export const VERSION = '${nuevaVersion}';
export const APP_NAME = '${packageJson.name || 'AdminLove'}';
export const BUILD_DATE = '${new Date().toISOString()}';
`;

fs.writeFileSync(VERSION_FILE_PATH, versionTs);

console.log(`✅ Versión actualizada: ${versionActual} → ${nuevaVersion}`);
console.log(`📦 Archivo creado: ${VERSION_FILE_PATH}`);

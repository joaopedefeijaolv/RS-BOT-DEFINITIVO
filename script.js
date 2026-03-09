/**
 * HSBR Bot - Real Soccer X5
 * Auto-verificação de dependências
 */

// ─── AUTO-VERIFICAÇÃO DE DEPENDÊNCIAS ────────────────────────────────────────
(function checkDependencies() {
  const { execSync } = require("child_process");
  const fs = require("fs");
  const path = require("path");

  // Verifica haxball.js
  try {
    require.resolve("haxball.js");
    console.log("[INIT] ✅ haxball.js encontrado.");
  } catch (e) {
    console.warn("[INIT] ⚠️  haxball.js não encontrado. Instalando...");
    try {
      execSync("npm install haxball.js", { stdio: "inherit" });
      console.log("[INIT] ✅ haxball.js instalado com sucesso!");
    } catch (err) {
      console.error("[INIT] ❌ Falha ao instalar haxball.js:", err.message);
      console.error("[INIT]    Execute manualmente: npm install haxball.js");
      process.exit(1);
    }
  }

  // Verifica headless.js (opcional — usado como alternativa)
  const headlessPath = path.join(__dirname, "headless.js");
  if (!fs.existsSync(headlessPath)) {
    console.warn("[INIT] ℹ️  headless.js não encontrado na pasta. Usando haxball.js padrão.");
  } else {
    console.log("[INIT] ✅ headless.js encontrado.");
  }
})();
// ─────────────────────────────────────────────────────────────────────────────

const haxballJSImport = require("haxball.js");
const HBInitFn = haxballJSImport.default || haxballJSImport;

HBInitFn().then((HBInit) => {

  // ── Real Soccer Variables ──────────────────────────────────────────────────
  var fieldWidth;
  var fieldHeight;
  var fieldWidthLimit;
  var fieldHeightLimit;
  var throwTimeOut       = 600;   // 10 segundos (em game ticks)
  var gkTimeOut          = 600;   // 10 segundos
  var ckTimeOut          = 400;   // ~6 segundos
  var throwinDistance    = 270;
  var mapBGColor         = "86A578";
  var superAdminCode     = "assa";
  var allowPublicAdmin   = false;
  var powerShotMode      = true;
  var becacePowerShotInvMass  = 2.2;
  var defaultPowerShotInvMass = 2.0;

  // #region KITS
  var sistemaKitsAtivo = false;

  const kits = {
    red: {
      name: "red",
      home: { contrast: "ESCURO", angle: 60, textColor: 0xFFFFFF, colors: [0xFF1F17, 0xFF1F17, 0xFF1F17] },
      away: { contrast: "CLARO",  angle: 60, textColor: 0xFF1F17, colors: [0xFFFFFF, 0xFFFFFF, 0xFFFFFF] }
    },
    blue: {
      name: "blue",
      home: { contrast: "ESCURO", angle: 60, textColor: 0xFFFFFF, colors: [0x387AFF, 0x387AFF, 0x387AFF] },
      away: { contrast: "CLARO",  angle: 60, textColor: 0x387AFF, colors: [0xFFFFFF, 0xFFFFFF, 0xFFFFFF] }
    },
    lanus: {
      name: "Lanús",
      home: { contrast: "ESCURO", angle: 60, textColor: 0xFFFFFF, colors: [0x750133, 0x66012D, 0x590127] },
      away: { contrast: "CLARO",  angle: 90, textColor: 0x66012D, colors: [0xFFFFFF, 0xFFFFFF, 0x4A4A4A] }
    },
    u_de_chile: {
      name: "Universidad de Chile",
      home: { contrast: "CLARO",  angle: 60, textColor: 0xC4C2BB, colors: [0x112A66, 0x0D204D, 0x09193D] },
      away: { contrast: "ESCURO", angle: 60, textColor: 0xD6001D, colors: [0xFFFFFF, 0xE3EDFF, 0xFFFFFF] }
    },
    ind_del_valle: {
      name: "Independiente del Valle",
      home: { contrast: "CLARO",  angle: 0, textColor: 0xDEDEDE, colors: [0x000000, 0x163666, 0x000000] },
      away: { contrast: "ESCURO", angle: 0, textColor: 0x222222, colors: [0xC74EC3, 0xD453CF, 0xDE57D8] }
    },
    fluminense: {
      name: "Fluminense",
      home:  { contrast: "CLARO",  angle: 0, textColor: 0xDBDBDB, colors: [0x174221, 0x540319, 0x174221] },
      away:  { contrast: "ESCURO", angle: 0, textColor: 0x6E0110, colors: [0xFFFFFF, 0xF2F2F2] },
      third: { contrast: "ESCURO", angle: 0, textColor: 0xCF0AFC, colors: [0x023019] }
    },
    atletico_mg: {
      name: "Atlético Mineiro",
      home:  { contrast: "CLARO",  angle: 0,  textColor: 0xEBBD61, colors: [0x222222, 0xFFFFFF, 0x222222] },
      away:  { contrast: "ESCURO", angle: 90, textColor: 0x303030, colors: [0xB0B0B0, 0xFFFFFF, 0xFFFFFF] },
      third: { contrast: "CLARO",  angle: 60, textColor: 0xDEB271, colors: [0x000000, 0x080808, 0x141414] }
    },
    godoy_cruz: {
      name: "Godoy Cruz",
      home: { contrast: "CLARO",  angle: 0,  textColor: 0xFFFFFF, colors: [0x1A3387, 0xD9D9D9, 0x1A3387] },
      away: { contrast: "ESCURO", angle: 60, textColor: 0x1A3387, colors: [0xFFFFFF, 0xF2F2F2, 0xEBEBEB] }
    },
    america_de_cali: {
      name: "América de Cali",
      home: { contrast: "ESCURO", angle: 0, textColor: 0xCC281D, colors: [0xFFFFFF] },
      away: { contrast: "CLARO",  angle: 0, textColor: 0xFFFFFF, colors: [0xCC281D] }
    },
    independiente: {
      name: "Independiente",
      home: { contrast: "CLARO",  angle: 0,  textColor: 0xFFFFFF, colors: [0xB51F19, 0x8A1813] },
      away: { contrast: "ESCURO", angle: 50, textColor: 0xB51F19, colors: [0x222222, 0x111111, 0x000000] }
    },
    alianza_lima: {
      name: "Alianza Lima",
      home: { contrast: "CLARO",  angle: 0, textColor: 0xFFCC80, colors: [0xF0F0F0, 0x112C63, 0xF0F0F0] },
      away: { contrast: "ESCURO", angle: 0, textColor: 0x372A75, colors: [0xFFCC80] }
    },
    universidad_catolica: {
      name: "Universidad Católica",
      home: { contrast: "ESCURO", angle: 90, textColor: 0x063666, colors: [0xFFFFFF, 0x2487C9, 0xFFFFFF] },
      away: { contrast: "CLARO",  angle: 0,  textColor: 0xFFFFFF, colors: [0x004182, 0x00294D, 0x004182] }
    },
    bolivar: {
      name: "Bolívar",
      home: { contrast: "CLARO",  angle: 60, textColor: 0xE3E3E3, colors: [0xAAD0E3, 0x9FC2D4, 0x93B4C4] },
      away: { contrast: "ESCURO", angle: 60, textColor: 0xFFFFFF, colors: [0x381D15, 0x2E1811, 0x29150F] }
    },
    central_cordoba: {
      name: "Central Córdoba",
      home: { contrast: "CLARO",  angle: 0,  textColor: 0xDED4C5, colors: [0xFFFFFF, 0x000000, 0xFFFFFF] },
      away: { contrast: "ESCURO", angle: 90, textColor: 0x380505, colors: [0x690E11, 0x7D1616] }
    },
    huracan: {
      name: "Huracán",
      home:  { contrast: "CLARO",  angle: 90, textColor: 0xFFFFFF, colors: [0xAB0C0C] },
      away:  { contrast: "ESCURO", angle: 90, textColor: 0xAB0C0C, colors: [0xFFFFFF] },
      third: { contrast: "CLARO",  angle: 90, textColor: 0xF2F2F2, colors: [0x222222] }
    },
    once_caldas: {
      name: "Once Caldas",
      home:  { contrast: "CLARO",  angle: 70, textColor: 0xA60D0D, colors: [0xD5F0CE, 0xFFFFFF, 0xFFFFFF] },
      away:  { contrast: "ESCURO", angle: 0,  textColor: 0xE8E8E8, colors: [0x0B194A, 0x122977, 0x122977] },
      third: { contrast: "CLARO",  angle: 0,  textColor: 0xF2F2F2, colors: [0x111111, 0x222222, 0x111111] }
    },
    cienciano: {
      name: "Cienciano",
      home: { contrast: "CLARO",  angle: 0, textColor: 0xFFFFFF, colors: [0xB81616, 0xA61717, 0x8F1717] },
      away: { contrast: "ESCURO", angle: 0, textColor: 0xF2C78F, colors: [0x0C193D, 0x0A1430, 0x081026] }
    },
    mushuc_runa: {
      name: "Mushuc Runa",
      home:  { contrast: "CLARO",  angle: 90, textColor: 0xFFFFFF, colors: [0x730F18, 0x5E0C14, 0x5E0C14] },
      away:  { contrast: "CLARO",  angle: 0,  textColor: 0xFFFFFF, colors: [0x2C6311, 0x427714, 0x2C6311] },
      third: { contrast: "ESCURO", angle: 0,  textColor: 0x2C6311, colors: [0xFFFFFF] }
    }
  };
  // #endregion KITS

  /*──────────────────────────── STADIUMS ─────────────────────────────────────*/
  function getRealSoccerMap(map) {
    map = {
      "name": "Estadio HSBR",
      "width": 1300,
      "height": 670,
      "spawnDistance": 560,
      "bg": { "type": "grass", "width": 1150, "height": 600, "kickOffRadius": 180, "cornerRadius": 0, "color": mapBGColor },
      "playerPhysics": {
        "bCoef": 0.3, "invMass": 0.5, "damping": 0.96,
        "acceleration": 0.12, "kickingAcceleration": 0.07,
        "kickingDamping": 0.97, "kickStrength": 5.65
      },
      "ballPhysics": {
        "radius": 8.25, "bCoef": 0.5, "invMass": 1.05, "damping": 0.99,
        "color": "FFFFFF", "cMask": ["all"], "cGroup": ["ball"]
      },
      "vertexes": [
        /* 0  */ { "x": 0,     "y": 675,  "trait": "kickOffBarrier" },
        /* 1  */ { "x": 0,     "y": 180,  "trait": "kickOffBarrier" },
        /* 2  */ { "x": 0,     "y": -180, "trait": "kickOffBarrier" },
        /* 3  */ { "x": 0,     "y": -675, "trait": "kickOffBarrier" },
        /* 4  */ { "x": 1150,  "y": 320,  "trait": "line" },
        /* 5  */ { "x": 840,   "y": 320,  "trait": "line" },
        /* 6  */ { "x": 1150,  "y": -320, "trait": "line" },
        /* 7  */ { "x": 840,   "y": -320, "trait": "line" },
        /* 8  */ { "x": 1150,  "y": 180,  "trait": "line" },
        /* 9  */ { "x": 1030,  "y": 180,  "trait": "line" },
        /* 10 */ { "x": 1150,  "y": -180, "trait": "line" },
        /* 11 */ { "x": 1030,  "y": -180, "trait": "line" },
        /* 12 */ { "x": 840,   "y": -130, "trait": "line", "curve": -130 },
        /* 13 */ { "x": 840,   "y": 130,  "trait": "line", "curve": -130 },
        /* 14 */ { "x": -1150, "y": -320, "trait": "line" },
        /* 15 */ { "x": -840,  "y": -320, "trait": "line" },
        /* 16 */ { "x": -1150, "y": 320,  "trait": "line" },
        /* 17 */ { "x": -840,  "y": 320,  "trait": "line" },
        /* 18 */ { "x": -1150, "y": -175, "trait": "line" },
        /* 19 */ { "x": -1030, "y": -175, "trait": "line" },
        /* 20 */ { "x": -1150, "y": 175,  "trait": "line" },
        /* 21 */ { "x": -1030, "y": 175,  "trait": "line" },
        /* 22 */ { "x": -840,  "y": 130,  "trait": "line", "curve": -130 },
        /* 23 */ { "x": -840,  "y": -130, "trait": "line", "curve": -130 },
        /* 24 */ { "x": 935,   "y": 3,    "trait": "line" },
        /* 25 */ { "x": 935,   "y": -3,   "trait": "line" },
        /* 26 */ { "x": -935,  "y": 3,    "trait": "line" },
        /* 27 */ { "x": -935,  "y": -3,   "trait": "line" },
        /* 28 */ { "x": -1150, "y": 570,  "bCoef": -2.9, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line" },
        /* 29 */ { "x": -1120, "y": 600,  "bCoef": -2.9, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line" },
        /* 30 */ { "x": -1120, "y": -600, "bCoef": -2.9, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line" },
        /* 31 */ { "x": -1150, "y": -570, "bCoef": -2.9, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line" },
        /* 32 */ { "x": 1120,  "y": 600,  "bCoef": -2.9, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line" },
        /* 33 */ { "x": 1150,  "y": 570,  "bCoef": -2.9, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line" },
        /* 34 */ { "x": 1150,  "y": -570, "bCoef": -2.9, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line" },
        /* 35 */ { "x": 1120,  "y": -600, "bCoef": -2.9, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line" },
        /* 36 */ { "x": 0,  "y": 180,  "bCoef": 0.1, "cMask": ["red","blue"], "cGroup": ["blueKO"], "trait": "kickOffBarrier", "curve": -180 },
        /* 37 */ { "x": 0,  "y": -180, "bCoef": 0.1, "cMask": ["red","blue"], "cGroup": ["redKO"],  "trait": "kickOffBarrier", "curve": 180 },
        /* 38 */ { "x": 0,  "y": 180,  "bCoef": 0.1, "cMask": ["red","blue"], "cGroup": ["redKO"],  "trait": "kickOffBarrier", "curve": 180 },
        /* 39 */ { "x": -1030, "y": -40, "bCoef": -5.7, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line", "curve": 70,  "color": "576C46", "vis": false },
        /* 40 */ { "x": -1030, "y": 40,  "bCoef": -5.7, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line", "curve": 70,  "color": "576C46", "vis": false },
        /* 41 */ { "x": 1030,  "y": -40, "bCoef": -5.7, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line", "curve": -70, "color": "576C46", "vis": false },
        /* 42 */ { "x": 1030,  "y": 40,  "bCoef": -5.7, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line", "curve": -70, "color": "576C46", "vis": false },
        /* 43 */ { "x": 1030,  "y": -40, "trait": "line", "color": "576C46" },
        /* 44 */ { "x": 1030,  "y": 40,  "trait": "line", "color": "576C46" },
        /* 45 */ { "x": -1030, "y": -40, "trait": "line", "color": "576C46" },
        /* 46 */ { "x": -1030, "y": 40,  "trait": "line", "color": "576C46" },
        /* 47 */ { "x": 0, "y": 3,  "trait": "line" },
        /* 48 */ { "x": 0, "y": -3, "trait": "line" },
        /* 49 */ { "x": -1300, "y": -460, "bCoef": 0, "cMask": ["c1"], "cGroup": ["red","blue"], "color": "ec644b", "vis": false },
        /* 50 */ { "x": 1300,  "y": -460, "bCoef": 0, "cMask": ["c1"], "cGroup": ["red","blue"], "color": "ec644b", "vis": false },
        /* 51 */ { "x": -1300, "y": 460,  "bCoef": 0, "cMask": ["c1"], "cGroup": ["red","blue"], "color": "ec644b", "vis": false },
        /* 52 */ { "x": 1300,  "y": 460,  "bCoef": 0, "cMask": ["c1"], "cGroup": ["red","blue"], "color": "ec644b", "vis": false },
        /* 53 */ { "x": -1295, "y": -320, "cMask": ["c0"], "cGroup": ["red","blue"] },
        /* 54 */ { "x": -840,  "y": -320, "cMask": ["c0"], "cGroup": ["red","blue"] },
        /* 55 */ { "x": -840,  "y": 320,  "cMask": ["c0"], "cGroup": ["red","blue"] },
        /* 56 */ { "x": -1295, "y": 320,  "cMask": ["c0"], "cGroup": ["red","blue"] },
        /* 57 */ { "x": 1295,  "y": -320, "cMask": ["c0"], "cGroup": ["red","blue"] },
        /* 58 */ { "x": 840,   "y": -320, "cMask": ["c0"], "cGroup": ["red","blue"] },
        /* 59 */ { "x": 840,   "y": 320,  "cMask": ["c0"], "cGroup": ["red","blue"] },
        /* 60 */ { "x": 1295,  "y": 320,  "cMask": ["c0"], "cGroup": ["red","blue"] },
        /* 61 */ { "x": -1150, "y": -124, "bCoef": 0.1, "cMask": ["ball","red","blue"] },
        /* 62 */ { "x": -1210, "y": -124, "bCoef": 0.1, "cMask": ["red","blue"], "bias": 0, "curve": 5 },
        /* 63 */ { "x": -1150, "y": 124,  "bCoef": 0.1, "cMask": ["ball","red","blue"] },
        /* 64 */ { "x": -1210, "y": 124,  "bCoef": 0.1, "cMask": ["red","blue"], "bias": 0, "curve": 5 },
        /* 65 */ { "x": -1250, "y": -158, "bCoef": 0, "cMask": ["ball"] },
        /* 66 */ { "x": -1250, "y": 158,  "bCoef": 0, "cMask": ["ball"] },
        /* 67 */ { "x": 1150,  "y": 124,  "bCoef": 0.1, "cMask": ["ball","red","blue"] },
        /* 68 */ { "x": 1210,  "y": 124,  "bCoef": 0.1, "cMask": ["red","blue"], "curve": -5 },
        /* 69 */ { "x": 1150,  "y": -124, "bCoef": 0.1, "cMask": ["ball","red","blue"] },
        /* 70 */ { "x": 1210,  "y": -124, "bCoef": 0.1, "cMask": ["red","blue"], "curve": -5 },
        /* 71 */ { "x": 1250,  "y": -158, "bCoef": 0, "cMask": ["ball"] },
        /* 72 */ { "x": 1250,  "y": 158,  "bCoef": 0, "cMask": ["ball"] }
      ],
      "segments": [
        { "v0": 0, "v1": 1, "trait": "kickOffBarrier" },
        { "v0": 2, "v1": 3, "trait": "kickOffBarrier" },
        { "v0": 4,  "v1": 5,  "trait": "line", "y": 320 },
        { "v0": 5,  "v1": 7,  "trait": "line", "x": 840 },
        { "v0": 6,  "v1": 7,  "trait": "line", "y": -320 },
        { "v0": 8,  "v1": 9,  "trait": "line", "y": 180 },
        { "v0": 9,  "v1": 11, "trait": "line", "x": 1030 },
        { "v0": 10, "v1": 11, "trait": "line", "y": -180 },
        { "v0": 12, "v1": 13, "curve": -130, "trait": "line", "x": 840 },
        { "v0": 14, "v1": 15, "trait": "line", "y": -320 },
        { "v0": 15, "v1": 17, "trait": "line", "x": -840 },
        { "v0": 16, "v1": 17, "trait": "line", "y": 320 },
        { "v0": 18, "v1": 19, "trait": "line", "y": -175 },
        { "v0": 19, "v1": 21, "trait": "line", "x": -1030 },
        { "v0": 20, "v1": 21, "trait": "line", "y": 175 },
        { "v0": 22, "v1": 23, "curve": -130, "trait": "line", "x": -840 },
        { "v0": 24, "v1": 25, "curve": -180, "trait": "line", "x": 935 },
        { "v0": 26, "v1": 27, "curve": -180, "trait": "line", "x": -935 },
        { "v0": 24, "v1": 25, "curve": 180,  "trait": "line", "x": 935 },
        { "v0": 26, "v1": 27, "curve": 180,  "trait": "line", "x": -935 },
        { "v0": 24, "v1": 25, "curve": 90,   "trait": "line", "x": 935 },
        { "v0": 26, "v1": 27, "curve": 90,   "trait": "line", "x": -935 },
        { "v0": 24, "v1": 25, "curve": -90,  "trait": "line", "x": 935 },
        { "v0": 26, "v1": 27, "curve": -90,  "trait": "line", "x": -935 },
        { "v0": 24, "v1": 25, "trait": "line", "x": 935 },
        { "v0": 26, "v1": 27, "trait": "line", "x": -935 },
        { "v0": 28, "v1": 29, "curve": 90, "bCoef": -2.9, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line" },
        { "v0": 30, "v1": 31, "curve": 90, "bCoef": -2.9, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line" },
        { "v0": 32, "v1": 33, "curve": 90, "bCoef": -2.9, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line" },
        { "v0": 34, "v1": 35, "curve": 90, "bCoef": -2.9, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line" },
        { "v0": 37, "v1": 36, "curve": -180, "vis": false, "bCoef": 0.1, "cGroup": ["blueKO"], "trait": "kickOffBarrier" },
        { "v0": 39, "v1": 40, "curve": 70,  "vis": false, "color": "576C46", "bCoef": -5.7, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line", "x": -1030 },
        { "v0": 41, "v1": 42, "curve": -70, "vis": false, "color": "576C46", "bCoef": -5.7, "cMask": ["ball"], "cGroup": ["c0"], "trait": "line", "x": 1030 },
        { "v0": 37, "v1": 38, "curve": 180, "vis": false, "bCoef": 0.1, "cMask": ["red","blue"], "cGroup": ["redKO"], "trait": "kickOffBarrier" },
        { "v0": 43, "v1": 44, "vis": true,  "color": "576C46", "trait": "line", "x": 1030 },
        { "v0": 45, "v1": 46, "vis": true,  "color": "576C46", "trait": "line", "x": -1030 },
        { "v0": 47, "v1": 48, "curve": -180, "trait": "line", "x": -935 },
        { "v0": 47, "v1": 48, "curve": 180,  "trait": "line", "x": -935 },
        { "v0": 47, "v1": 48, "curve": 90,   "trait": "line", "x": -935 },
        { "v0": 47, "v1": 48, "curve": -90,  "trait": "line", "x": -935 },
        { "v0": 47, "v1": 48, "trait": "line", "x": -935 },
        { "v0": 49, "v1": 50, "vis": false, "color": "ec644b", "bCoef": 0, "cMask": ["c1"], "cGroup": ["red","blue"], "y": -460 },
        { "v0": 51, "v1": 52, "vis": false, "color": "ec644b", "bCoef": 0, "cMask": ["c1"], "cGroup": ["red","blue"], "y": 460 },
        { "v0": 53, "v1": 54, "vis": false, "color": "ec644b", "cMask": ["c0"], "cGroup": ["red","blue"] },
        { "v0": 54, "v1": 55, "vis": false, "color": "ec644b", "cMask": ["c0"], "cGroup": ["red","blue"] },
        { "v0": 55, "v1": 56, "vis": false, "color": "ec644b", "cMask": ["c0"], "cGroup": ["red","blue"] },
        { "v0": 57, "v1": 58, "vis": false, "cMask": ["c0"], "cGroup": ["red","blue"] },
        { "v0": 58, "v1": 59, "vis": false, "cMask": ["c0"], "cGroup": ["red","blue"] },
        { "v0": 59, "v1": 60, "vis": false, "cMask": ["c0"], "cGroup": ["red","blue"] },
        { "v0": 61, "v1": 62, "color": "FFFFFF", "bCoef": 0.1, "cMask": ["ball","red","blue"], "y": -124 },
        { "v0": 63, "v1": 64, "color": "FFFFFF", "bCoef": 0.1, "cMask": ["ball","red","blue"], "y": 124 },
        { "v0": 64, "v1": 62, "curve": 5, "color": "FFFFFF", "bCoef": 0.1, "cMask": ["ball","red","blue"], "bias": 0 },
        { "v0": 62, "v1": 65, "color": "FFFFFF", "bCoef": 0, "cMask": ["ball"] },
        { "v0": 64, "v1": 66, "color": "FFFFFF", "bCoef": 0, "cMask": ["ball"] },
        { "v0": 67, "v1": 68, "color": "FFFFFF", "bCoef": 0.1, "cMask": ["ball","red","blue"], "y": 124 },
        { "v0": 69, "v1": 70, "color": "FFFFFF", "bCoef": 0.1, "cMask": ["ball","red","blue"], "y": -124 },
        { "v0": 68, "v1": 70, "curve": -5, "color": "FFFFFF", "bCoef": 0.1, "cMask": ["ball","red","blue"] },
        { "v0": 70, "v1": 71, "color": "FFFFFF", "bCoef": 0, "cMask": ["ball"] },
        { "v0": 68, "v1": 72, "color": "FFFFFF", "bCoef": 0, "cMask": ["ball"] }
      ],
      "goals": [
        { "p0": [-1161.45, 124], "p1": [-1161.45, -124], "team": "red" },
        { "p0": [1161.45,  124], "p1": [1161.45,  -124], "team": "blue", "radius": 0, "invMass": 1 }
      ],
      "discs": [
        { "radius": 0, "invMass": 0, "pos": [-1311, -19], "color": "ffffffff", "bCoef": 0, "cMask": ["red"],        "cGroup": ["ball"] },
        { "radius": 0, "invMass": 0, "pos": [-1310, 29],  "color": "ffffffff", "bCoef": 0, "cMask": ["blue"],       "cGroup": ["ball"] },
        { "radius": 0, "invMass": 0, "pos": [-1308, 62],  "color": "ffffffff", "bCoef": 0, "cMask": ["red","blue"], "cGroup": ["ball"] },
        { "radius": 2.7, "pos": [-1150,  600], "cGroup": ["ball"], "trait": "cornerflag" },
        { "radius": 2.7, "pos": [1150,  -600], "cGroup": ["ball"], "trait": "cornerflag" },
        { "radius": 2.7, "pos": [1150,   600], "cGroup": ["ball"], "trait": "cornerflag" },
        { "radius": 5, "invMass": 0, "pos": [-1150, -124], "bCoef": 0.5, "trait": "goalPost" },
        { "radius": 5, "invMass": 0, "pos": [-1150,  124], "bCoef": 0.5, "trait": "goalPost" },
        { "radius": 2, "invMass": 0, "pos": [-1250, -158], "color": "000000", "bCoef": 1, "trait": "goalPost" },
        { "radius": 2, "invMass": 0, "pos": [-1250,  158], "color": "000000", "bCoef": 1, "trait": "goalPost" },
        { "radius": 5, "invMass": 0, "pos": [1150,  -124], "bCoef": 0.5, "trait": "goalPost" },
        { "radius": 5, "invMass": 0, "pos": [1150,   124], "bCoef": 0.5, "trait": "goalPost" },
        { "radius": 2, "invMass": 0, "pos": [1250,  -158], "color": "000000", "bCoef": 1, "trait": "goalPost" },
        { "radius": 2, "invMass": 0, "pos": [1250,   158], "color": "000000", "bCoef": 1, "trait": "goalPost" },
        { "radius": 2.7, "pos": [-1150, -600], "cGroup": ["ball"], "trait": "cornerflag" },
        { "radius": 0, "pos": [-1149, -460], "cMask": ["none"] },
        { "radius": 0, "pos": [1149,  -460], "cMask": ["none"] },
        { "radius": 0, "pos": [-1149, -460], "cMask": ["none"] },
        { "radius": 0, "pos": [1149,  -460], "cMask": ["none"] },
        { "radius": 0, "pos": [-1149,  460], "cMask": ["none"] },
        { "radius": 0, "pos": [1149,   460], "cMask": ["none"] },
        { "radius": 0, "pos": [-1149,  460], "cMask": ["none"] },
        { "radius": 0, "pos": [1149,   460], "cMask": ["none"] }
      ],
      "planes": [
        { "normal": [0,  1],  "dist": -627,  "bCoef": 0, "cGroup": ["ball"], "trait": "ballArea" },
        { "normal": [0, -1],  "dist": -627,  "bCoef": 0, "cGroup": ["ball"], "trait": "ballArea" },
        { "normal": [0,  1],  "dist": -670,  "bCoef": 0 },
        { "normal": [0, -1],  "dist": -670,  "bCoef": 0 },
        { "normal": [1,  0],  "dist": -1300, "bCoef": 0 },
        { "normal": [-1, 0],  "dist": -1300, "bCoef": 0.1 },
        { "normal": [1,  0],  "dist": -1230, "bCoef": 0, "cMask": ["ball"], "cGroup": ["ball"] },
        { "normal": [-1, 0],  "dist": -1230, "bCoef": 0, "cMask": ["ball"], "cGroup": ["ball"] }
      ],
      "traits": {
        "ballArea":        { "vis": false, "bCoef": 0, "cMask": ["ball"], "cGroup": ["ball"] },
        "goalPost":        { "radius": 5, "invMass": 0, "bCoef": 1, "cGroup": ["wall"] },
        "rightNet":        { "radius": 0, "invMass": 1, "bCoef": 0, "cGroup": ["ball","c3"] },
        "leftNet":         { "radius": 0, "invMass": 1, "bCoef": 0, "cGroup": ["ball","c2"] },
        "stanchion":       { "radius": 3, "invMass": 0, "bCoef": 3, "cMask": ["none"] },
        "cornerflag":      { "radius": 3, "invMass": 0, "bCoef": 0.2, "color": "FFFF00", "cMask": ["ball"] },
        "reargoalNetleft":  { "vis": true, "bCoef": 0.1, "cMask": ["ball","red","blue"], "curve": 10,  "color": "C7E6BD" },
        "reargoalNetright": { "vis": true, "bCoef": 0.1, "cMask": ["ball","red","blue"], "curve": -10, "color": "C7E6BD" },
        "sidegoalNet":     { "vis": true, "bCoef": 1,   "cMask": ["ball","red","blue"], "color": "C7E6BD" },
        "kickOffBarrier":  { "vis": false, "bCoef": 0.1, "cGroup": ["redKO","blueKO"], "cMask": ["red","blue"] },
        "line":            { "vis": true, "cMask": [], "color": "C7E6BD" }
      },
      "joints": [ {}, {}, {}, {} ],
      "redSpawnPoints":  [],
      "blueSpawnPoints": [],
      "canBeStored": true
    };

    penalArea        = [840, 320];
    penalMark        = 935;
    goalKickCoord    = 1060;
    cornerKickCoord  = [1140, 590];
    cornerKickStrength = 1.05;
    currentStadium   = map;
    goalCoord_x      = Math.abs(map.goals[0].p0[0]);
    goalCoord_y      = Math.abs(map.goals[0].p0[1]);
    goalsCoord       = [goalCoord_x, goalCoord_y];
    return JSON.stringify(map);
  }

  var currentStadium;
  var goalsCoord;
  var penalArea;
  var penalMark;
  var goalKickCoord;
  var cornerKickCoord;
  var cornerKickStrength;
  /*──────────────────────── END OF STADIUMS ──────────────────────────────────*/

  // ── Global Variables ────────────────────────────────────────────────────────
  var roomName      = "🌐 HSBR | x5 | Real Soccer 🌐";
  var roomPassword  = null;
  var maxPlayers    = 22;
  var roomPublic    = true;
  var token         = "thr1.AAAAAGmu619snHZQX5j3Yg.C6C03ZjbSk4";
  var roomLink      = "";
  var gameTime      = 5;
  var map           = "RSR";
  var superAdmins   = [];
  var vipPlayers    = [];

  var sendRecWebhookURL      = "";

  // Sistema de Senhas
  var senhaWebhookURL   = "";
  var senhaAdminDiaria  = "";
  var senhaVipDiaria    = "";
  var ultimaDataSenha   = "";

  var recordingActive = false;

  // Webhook para chat log
  var chatLogWebhookURL  = "";
  // Webhook para eventos
  var eventLogWebhookURL = "";
  // Webhook para confirmações
  var confirmacaoWebhookURL = "";
	
  // Sistema de Confirmação
  var sistemaConfirmacaoAtivo = false;
  var jogadoresConfirmados    = {};
  var jogadoresIPs            = {};

  // Sistema de Súmula
  var sistemaSumulaAtivo = false;
  var sumulaWebhookURL   = "";
  var dadosPartida = {
    ativa: false, nomeRed: "", nomeBlue: "",
    golsRed: [], golsBlue: [], assistsRed: [], assistsBlue: [],
    placarRed: 0, placarBlue: 0,
    goleiroRed: null, goleiroBlue: null, recording: null
  };

  // Lista de nicks admins
  var authorizedNicks = ["","jp mantega","","","","","","","","","",""];

  // Sistema de mute
  var globalMuteActive = false;
  var mutedPlayers     = {};

  // Sistema de Posições
  var sistemaPosicoes = {
    ativo: false, usado: false,
    posicoesRed: {
      gk: { ocupada: false, jogador: null, coords: { x: -1200, y: 0 },   nome: "GK" },
      vl: { ocupada: false, jogador: null, coords: { x: -870,  y: 0 },   nome: "VL" },
      me: { ocupada: false, jogador: null, coords: { x: -663,  y: -308 }, nome: "ME" },
      md: { ocupada: false, jogador: null, coords: { x: -685,  y: 308 },  nome: "MD" },
      ca: { ocupada: false, jogador: null, coords: { x: -203,  y: 0 },   nome: "CA" }
    },
    posicoesBlue: {
      gk: { ocupada: false, jogador: null, coords: { x: 1200, y: 0 },   nome: "GK" },
      vl: { ocupada: false, jogador: null, coords: { x: 870,  y: 0 },   nome: "VL" },
      me: { ocupada: false, jogador: null, coords: { x: 663,  y: 308 },  nome: "ME" },
      md: { ocupada: false, jogador: null, coords: { x: 685,  y: -308 }, nome: "MD" },
      ca: { ocupada: false, jogador: null, coords: { x: 203,  y: 0 },   nome: "CA" }
    },
    jogadoresComPosicao: []
  };

  // ── Room init ────────────────────────────────────────────────────────────────
  var room = HBInit({
    roomName:   roomName,
    password:   roomPassword,
    maxPlayers: maxPlayers,
    public:     roomPublic,
    geo:        { code: "BR", lat: -23.650108, lon: -46.598405 },
    noPlayer:   true,
    token:      token
  });

  // ── Classes ──────────────────────────────────────────────────────────────────
  class Game {
    constructor() {
      this.time                  = 0;
      this.paused                = false;
      this.ballRadius            = 0;
      this.rsTouchTeam           = 0;
      this.rsActive              = true;
      this.rsReady               = false;
      this.rsCorner              = false;
      this.rsGoalKick            = false;
      this.rsSwingTimer          = 1000;
      this.rsTimer               = 0;
      this.rsPenalty             = false;
      this.ballOutPositionX      = 0;
      this.ballOutPositionY      = 0;
      this.throwInPosY           = 0;
      this.outStatus             = "";
      this.warningCount          = 0;
      this.bringThrowBack        = false;
      this.extraTime             = false;
      this.extraTimeCount        = 0;
      this.extraTimeEnd          = 0;
      this.extraTimeAnnounced    = false;
      this.lastPlayAnnounced     = false;
      this.boosterState          = false;
      this.boosterCount          = 0;       // FIX: estava faltando
      this.throwinKicked         = false;
      this.pushedOut             = null;
      this.lastKickerId          = null;
      this.lastKickerName        = null;
      this.lastKickerTeam        = null;
      this.secondLastKickerId    = null;
      this.secondLastKickerName  = null;
      this.secondLastKickerTeam  = null;
      this.redScore              = 0;
      this.blueScore             = 0;
      this.powershotCounter      = 0;
      this.powershotID           = 0;
      this.powershotTrigger      = false;
      this.penaltyKickerId       = null;
    }

    updateLastKicker(id, name, team) {
      this.secondLastKickerId   = this.lastKickerId;
      this.secondLastKickerName = this.lastKickerName;
      this.secondLastKickerTeam = this.lastKickerTeam;
      this.lastKickerId         = id;
      this.lastKickerName       = name;
      this.lastKickerTeam       = team;
    }
  }

  // FIX: game precisa existir antes dos event handlers para evitar crashes
  var game = new Game();

  // ── a organizar ──────────────────────────────────────────────────────────────
  var redTeamName  = "RED";
  var blueTeamName = "BLUE";

  // ── Sistema de REC ────────────────────────────────────────────────────────────
  const https     = require("https");
  const { URL }   = require("url");

  let RecSistem = {
    getCustomDate: () => {
      let data    = new Date().toLocaleDateString().split("/").join("-");
      let relogio = new Date().toLocaleTimeString().split(":");
      return `${data}-${relogio[0]}h${relogio[1]}m`;
    },
    getScoresTime: time => {
      return ~~(Math.trunc(time) / 60) + ":" + (Math.trunc(time) % 60).toString().padStart(2, "0");
    },
    sendDiscordWebhook: (scores, retryCount = 0) => {
      if (sendRecWebhookURL === "") return;
      if (!recordingActive) return;

      let red  = room.getPlayerList().filter(p => p.team === 1).map(p => p.name);
      let blue = room.getPlayerList().filter(p => p.team === 2).map(p => p.name);

      const recData   = room.stopRecording();
      recordingActive = false;
      const params    = RecSistem.getParams(scores, red, blue);
      const recBuffer = Buffer.from(recData);
      const boundary  = "----WebKitFormBoundary" + Math.random().toString(36).substr(2);

      const header1 = Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="file"; filename="HBReplay-${RecSistem.getCustomDate()}.hbr2"\r\n` +
        `Content-Type: application/octet-stream\r\n\r\n`
      );
      const footer1  = Buffer.from("\r\n");
      const header2  = Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="payload_json"\r\n` +
        `Content-Type: application/json\r\n\r\n`
      );
      const jsonData = Buffer.from(JSON.stringify(params));
      const footer2  = Buffer.from(`\r\n--${boundary}--\r\n`);
      const body     = Buffer.concat([header1, recBuffer, footer1, header2, jsonData, footer2]);

      const webhookUrl = new URL(sendRecWebhookURL);
      const options = {
        hostname: webhookUrl.hostname,
        path:     webhookUrl.pathname + webhookUrl.search,
        method:   "POST",
        headers: {
          "Content-Type":   `multipart/form-data; boundary=${boundary}`,
          "Content-Length": body.length,
          "User-Agent":     "CLA-Bot/1.0"
        },
        timeout: 30000
      };

      const req = https.request(options, (res) => {
        res.on("data", () => {});
        res.on("end", () => {
          if (res.statusCode >= 400 && retryCount < 3) {
            console.log(`[REC] Erro ${res.statusCode}, tentando novamente... (${retryCount + 1}/3)`);
            setTimeout(() => RecSistem.sendDiscordWebhook(scores, retryCount + 1), 3000);
          } else if (res.statusCode < 400) {
            console.log("[REC] Gravação enviada com sucesso!");
          }
        });
      });
      req.on("error", (error) => {
        console.error("[REC] Erro:", error.code);
        if (retryCount < 3 && ["ECONNRESET","ETIMEDOUT","ECONNREFUSED"].includes(error.code)) {
          setTimeout(() => RecSistem.sendDiscordWebhook(scores, retryCount + 1), 3000);
        }
      });
      req.on("timeout", () => {
        console.error("[REC] Timeout na requisição");
        req.destroy();
        if (retryCount < 3) setTimeout(() => RecSistem.sendDiscordWebhook(scores, retryCount + 1), 3000);
      });
      req.write(body);
      req.end();
    },
    getParams: (scores, red, blue) => {
      return {
        username:   "REC CLA",
        avatar_url: "",
        content:    "",
        embeds: [{
          title:       "",
          color:       0x00E2FF,
          description: "",
          timestamp:   null,
          author:      { name: roomName },
          image:       {},
          thumbnail:   {},
          footer:      { text: "CLA - RECS", icon_url: "" },
          fields: [
            { name: "🔴RED",  value: `${red.join("\n")}\n**⚽Goals**\n${scores.red}`,  inline: true },
            { name: "🔵BLUE", value: `${blue.join("\n")}\n**⚽Goals**\n${scores.blue}`, inline: true },
            { name: "🕐Time", value: RecSistem.getScoresTime(scores.time) }
          ]
        }],
        components: []
      };
    }
  };

  // ── Sistema de Chat Log ───────────────────────────────────────────────────────
  function sendChatLog(playerName, message, isAdmin, isVip) {
    if (chatLogWebhookURL === "") return;
    let prefix = "";
    if (isAdmin) prefix = "[ADMIN] ";
    else if (isVip) prefix = "[VIP] ";
    const content    = `${prefix}${playerName}: ${message}`;
    const data       = JSON.stringify({ content, username: "Chat Log" });
    const webhookUrl = new URL(chatLogWebhookURL);
    const req = https.request({
      hostname: webhookUrl.hostname,
      path:     webhookUrl.pathname + webhookUrl.search,
      method:   "POST",
      headers:  { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) }
    });
    req.on("error", () => {});
    req.write(data);
    req.end();
  }

  // ── Sistema de Senhas ─────────────────────────────────────────────────────────
  function gerarSenhaAleatoria(prefixo) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let senha   = prefixo;
    for (let i = 0; i < 4; i++) senha += chars.charAt(Math.floor(Math.random() * chars.length));
    return senha;
  }

  function getDataAtual() {
    const agora = new Date();
    return `${agora.getDate()}/${agora.getMonth() + 1}/${agora.getFullYear()}`;
  }

  function verificarEGerarSenhas() {
    const dataAtual = getDataAtual();
    if (ultimaDataSenha !== dataAtual || senhaAdminDiaria === "" || senhaVipDiaria === "") {
      senhaAdminDiaria = gerarSenhaAleatoria("ADM");
      senhaVipDiaria   = gerarSenhaAleatoria("VIP");
      ultimaDataSenha  = dataAtual;
      console.log(`[SENHAS] Novas senhas geradas para ${dataAtual}`);
      console.log(`[SENHAS] Admin: ${senhaAdminDiaria} | VIP: ${senhaVipDiaria}`);
      enviarSenhasWebhook();
    }
  }

  function enviarSenhasWebhook(retryCount = 0) {
    if (senhaWebhookURL === "") return;
    const dataAtual = getDataAtual();
    const payload   = {
      username: "CLA - Senhas Diárias",
      embeds: [{
        title:       "🔐 Senhas do Dia - " + dataAtual,
        color:       0x00E2FF,
        description: "As senhas abaixo são válidas até às **23:00** de hoje.",
        fields: [
          { name: "🧊 Senha Admin", value: `\`\`\`${senhaAdminDiaria}\`\`\``, inline: true },
          { name: "💎 Senha VIP",   value: `\`\`\`${senhaVipDiaria}\`\`\``,   inline: true }
        ],
        footer:    { text: "CLA 2026" },
        timestamp: new Date().toISOString()
      }]
    };
    const data       = JSON.stringify(payload);
    const webhookUrl = new URL(senhaWebhookURL);
    const options    = {
      hostname: webhookUrl.hostname,
      path:     webhookUrl.pathname + webhookUrl.search,
      method:   "POST",
      headers:  { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data), "User-Agent": "CLA-Bot/1.0" },
      timeout:  10000
    };
    const req = https.request(options, (res) => {
      res.on("data", () => {});
      res.on("end", () => {
        if (res.statusCode >= 400 && retryCount < 3) {
          setTimeout(() => enviarSenhasWebhook(retryCount + 1), 2000);
        } else if (res.statusCode < 400) {
          console.log("[SENHAS] Senhas enviadas com sucesso para o Discord!");
        }
      });
    });
    req.on("error", (error) => {
      console.error("[SENHAS] Erro:", error.code);
      if (retryCount < 3) setTimeout(() => enviarSenhasWebhook(retryCount + 1), 2000);
    });
    req.on("timeout", () => {
      req.destroy();
      if (retryCount < 3) setTimeout(() => enviarSenhasWebhook(retryCount + 1), 2000);
    });
    req.write(data);
    req.end();
  }

  function verificarResetSenhas() {
    const agora   = new Date();
    const hora    = agora.getHours();
    const minuto  = agora.getMinutes();
    if (hora === 23 && minuto === 0) {
      const dataAtual = getDataAtual();
      if (ultimaDataSenha === dataAtual) {
        ultimaDataSenha = "";
        vipPlayers      = [];
        announce("🔐 As senhas diárias foram resetadas! Novas senhas serão geradas.", null, 0xFFAA00, "bold", 2);
        verificarEGerarSenhas();
      }
    }
  }

  setInterval(verificarResetSenhas, 60000);
  verificarEGerarSenhas();

  function sendEventLog(playerName, ip, eventType, extraInfo, retryCount = 0) {
    if (eventLogWebhookURL === "") return;
    let content;
    if (eventType === true  || eventType === "join")      content = `Entrou o jogador: ${playerName} com o IP: \`${ip}\``;
    else if (eventType === false || eventType === "leave") content = `${playerName} saiu da sala`;
    else if (eventType === "mute")      content = `[MUTE] ${playerName}`;
    else if (eventType === "unmute")    content = `[UNMUTE] ${playerName}`;
    else if (eventType === "muteall")   content = `[MUTEALL] ${playerName}`;
    else if (eventType === "unmuteall") content = `[UNMUTEALL] ${playerName}`;
    else if (eventType === "ban")       content = `[BAN] ${playerName}`;
    else if (eventType === "kick")      content = `[KICK] ${playerName}`;
    else if (eventType === "lock")      content = `[LOCK] ${playerName} trancou a sala com a senha: \`${extraInfo}\``;
    else if (eventType === "unlock")    content = `[UNLOCK] ${playerName} destrancou a sala`;
    else if (eventType === "admin")     content = `[ADMIN] ${playerName} deu admin para ${extraInfo}`;

    const data       = JSON.stringify({ content, username: "Event Log" });
    const webhookUrl = new URL(eventLogWebhookURL);
    const options    = {
      hostname: webhookUrl.hostname,
      path:     webhookUrl.pathname + webhookUrl.search,
      method:   "POST",
      headers:  { "Content-Type": "application/json", "Content-Length": data.length, "User-Agent": "CLA-Bot/1.0" },
      timeout:  10000
    };
    const req = https.request(options, (res) => {
      res.on("data", () => {});
      res.on("end", () => {
        if (res.statusCode >= 400 && retryCount < 3) {
          setTimeout(() => sendEventLog(playerName, ip, eventType, extraInfo, retryCount + 1), 2000);
        }
      });
    });
    req.on("error", (error) => {
      console.error("[EVENT-LOG] Erro:", error.code);
      if (retryCount < 3 && ["ECONNRESET","ETIMEDOUT","ECONNREFUSED"].includes(error.code)) {
        setTimeout(() => sendEventLog(playerName, ip, eventType, extraInfo, retryCount + 1), 2000);
      }
    });
    req.on("timeout", () => {
      console.error("[EVENT-LOG] Timeout na requisição");
      req.destroy();
      if (retryCount < 3) setTimeout(() => sendEventLog(playerName, ip, eventType, extraInfo, retryCount + 1), 2000);
    });
    req.write(data);
    req.end();
  }

  // ── Sistema de Confirmação ────────────────────────────────────────────────────
  function sendConfirmacaoWebhook(playerName, ip, retryCount = 0) {
    if (confirmacaoWebhookURL === "") return;
    const payload = {
      embeds: [{
        title:       "Confirmação CLA",
        color:       0x00E2FF,
        description: `**Nome:** ${playerName}\n**IP:** ||${ip}||`
      }]
    };
    const data       = JSON.stringify(payload);
    const webhookUrl = new URL(confirmacaoWebhookURL);
    const options    = {
      hostname: webhookUrl.hostname,
      path:     webhookUrl.pathname + webhookUrl.search,
      method:   "POST",
      headers:  { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) },
      timeout:  10000
    };
    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", chunk => { body += chunk; });
      res.on("end", () => {
        if (res.statusCode >= 400) {
          console.log(`[CONFIRMACAO] Erro ${res.statusCode}: ${body}`);
          if (retryCount < 3) setTimeout(() => sendConfirmacaoWebhook(playerName, ip, retryCount + 1), 2000);
        } else {
          console.log(`[CONFIRMACAO] ${playerName} confirmado com sucesso!`);
        }
      });
    });
    req.on("error", (error) => {
      console.error("[CONFIRMACAO] Erro:", error.code);
      if (retryCount < 3 && ["ECONNRESET","ETIMEDOUT","ECONNREFUSED"].includes(error.code)) {
        setTimeout(() => sendConfirmacaoWebhook(playerName, ip, retryCount + 1), 2000);
      }
    });
    req.on("timeout", () => {
      console.error("[CONFIRMACAO] Timeout na requisição");
      req.destroy();
      if (retryCount < 3) setTimeout(() => sendConfirmacaoWebhook(playerName, ip, retryCount + 1), 2000);
    });
    req.write(data);
    req.end();
  }

  function isPlayerConfirmado(playerId) { return jogadoresConfirmados[playerId] === true; }

  function confirmarJogador(player) {
    if (!sistemaConfirmacaoAtivo) {
      whisper("❌ O sistema de confirmação está desativado.", player.id);
      return false;
    }
    if (player.team !== 0) {
      whisper("❌ Você precisa estar no spec para confirmar!", player.id, 0xFF6B6B, "bold");
      return false;
    }
    if (isPlayerConfirmado(player.id)) {
      whisper("✅ Você já confirmou!", player.id, 0x00FF00, "bold");
      return false;
    }
    const playerConn = jogadoresIPs[player.id];
    const playerIP   = hexToIP(playerConn);
    jogadoresConfirmados[player.id] = true;
    sendConfirmacaoWebhook(player.name, playerIP);
    whisper("✅ Confirmação bem-sucedida!", player.id, 0x00FF00, "bold");
    return true;
  }

  function removerConfirmacao(playerId) {
    if (jogadoresConfirmados[playerId]) delete jogadoresConfirmados[playerId];
  }

  // ── Sistema de Súmula ─────────────────────────────────────────────────────────
  function resetarDadosPartida() {
    dadosPartida = {
      ativa: false, nomeRed: "", nomeBlue: "",
      golsRed: [], golsBlue: [], assistsRed: [], assistsBlue: [],
      placarRed: 0, placarBlue: 0,
      goleiroRed: null, goleiroBlue: null, recording: null
    };
  }

  function registrarGol(team, scorer, assister, isOwnGoal = false) {
    if (!sistemaSumulaAtivo || !dadosPartida.ativa) return;
    const formatName         = name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const scorerFormatted    = formatName(scorer) + (isOwnGoal ? " (GC)" : "");
    const assisterFormatted  = assister ? formatName(assister) : null;
    if (team === 1) {
      dadosPartida.golsRed.push(scorerFormatted);
      if (assisterFormatted) dadosPartida.assistsRed.push(assisterFormatted);
      dadosPartida.placarRed++;
    } else if (team === 2) {
      dadosPartida.golsBlue.push(scorerFormatted);
      if (assisterFormatted) dadosPartida.assistsBlue.push(assisterFormatted);
      dadosPartida.placarBlue++;
    }
  }

  function enviarSumula(retryCount = 0) {
    if (!sistemaSumulaAtivo || sumulaWebhookURL === "") return;
    if (!dadosPartida.recording) return;

    const golsRedText      = dadosPartida.golsRed.length   > 0 ? dadosPartida.golsRed.join(", ")   : "Nenhum";
    const golsBlueText     = dadosPartida.golsBlue.length  > 0 ? dadosPartida.golsBlue.join(", ")  : "Nenhum";
    const assistsRedText   = dadosPartida.assistsRed.length  > 0 ? dadosPartida.assistsRed.join(", ")  : "Nenhum";
    const assistsBlueText  = dadosPartida.assistsBlue.length > 0 ? dadosPartida.assistsBlue.join(", ") : "Nenhum";

    const formatName = name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    let csText = "";
    if (dadosPartida.placarRed === 0 && dadosPartida.placarBlue === 0) {
      if (dadosPartida.goleiroRed && dadosPartida.goleiroBlue)
        csText = formatName(dadosPartida.goleiroRed) + " e " + formatName(dadosPartida.goleiroBlue);
      else if (dadosPartida.goleiroRed)  csText = formatName(dadosPartida.goleiroRed);
      else if (dadosPartida.goleiroBlue) csText = formatName(dadosPartida.goleiroBlue);
      else csText = "Nenhum";
    } else if (dadosPartida.placarRed  === 0 && dadosPartida.goleiroBlue) csText = formatName(dadosPartida.goleiroBlue);
    else if   (dadosPartida.placarBlue === 0 && dadosPartida.goleiroRed)  csText = formatName(dadosPartida.goleiroRed);
    else csText = "Nenhum";

    let mvpText    = "undefined";
    const pStats   = {};
    [...dadosPartida.golsRed,   ...dadosPartida.golsBlue].forEach(gol => {
      if (!gol.includes("(GC)")) { const n = gol.replace(" (GC)",""); pStats[n] = (pStats[n] || 0) + 1; }
    });
    [...dadosPartida.assistsRed, ...dadosPartida.assistsBlue].forEach(a => { pStats[a] = (pStats[a] || 0) + 1; });

    let maxPts = 0, mvpCount = 0, mvpName = "";
    for (const n in pStats) {
      if (pStats[n] > maxPts) { maxPts = pStats[n]; mvpName = n; mvpCount = 1; }
      else if (pStats[n] === maxPts) mvpCount++;
    }
    if (mvpCount === 1 && maxPts > 0) mvpText = mvpName;

    const content =
      `# ${dadosPartida.nomeRed} <:Equipe:1418812571334610984> [${dadosPartida.placarRed}x${dadosPartida.placarBlue}] <:Equipe:1418812571334610984> ${dadosPartida.nomeBlue}\n\n` +
      `> <:Bola:1418432144686190645> Gols: ${golsRedText} | ${golsBlueText}\n\n` +
      `> <:assist:1428067410954420244> Assistências: ${assistsRedText} | ${assistsBlueText}\n\n` +
      `> <:cs:1428067395125121224> CS: ${csText}\n\n` +
      `> <:Estrela:1418812619032367256> MVP: ${mvpText}`;

    const recBuffer = Buffer.from(dadosPartida.recording);
    const boundary  = "----WebKitFormBoundary" + Math.random().toString(36).substr(2);
    const header1   = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="HBReplay-${RecSistem.getCustomDate()}.hbr2"\r\nContent-Type: application/octet-stream\r\n\r\n`);
    const footer1   = Buffer.from("\r\n");
    const header2   = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="payload_json"\r\nContent-Type: application/json\r\n\r\n`);
    const jsonData  = Buffer.from(JSON.stringify({ content }));
    const footer2   = Buffer.from(`\r\n--${boundary}--\r\n`);
    const body      = Buffer.concat([header1, recBuffer, footer1, header2, jsonData, footer2]);

    const webhookUrl = new URL(sumulaWebhookURL);
    const options    = {
      hostname: webhookUrl.hostname,
      path:     webhookUrl.pathname + webhookUrl.search,
      method:   "POST",
      headers:  { "Content-Type": `multipart/form-data; boundary=${boundary}`, "Content-Length": body.length, "User-Agent": "CLA-Bot/1.0" },
      timeout:  30000
    };
    const req = https.request(options, (res) => {
      res.on("data", () => {});
      res.on("end", () => {
        if (res.statusCode >= 400 && retryCount < 3) {
          setTimeout(() => enviarSumula(retryCount + 1), 3000);
        } else if (res.statusCode < 400) {
          console.log("[SUMULA] Súmula enviada com sucesso!");
        }
      });
    });
    req.on("error", error => {
      console.error("[SUMULA] Erro:", error.code);
      if (retryCount < 3) setTimeout(() => enviarSumula(retryCount + 1), 3000);
    });
    req.on("timeout", () => {
      console.error("[SUMULA] Timeout na requisição");
      req.destroy();
      if (retryCount < 3) setTimeout(() => enviarSumula(retryCount + 1), 3000);
    });
    req.write(body);
    req.end();
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Room setup
  // ────────────────────────────────────────────────────────────────────────────
  room.setCustomStadium(getRealSoccerMap());
  room.setScoreLimit(0);
  room.setTimeLimit(10);

  room.onRoomLink = function (url) {
    roomLink = url;
    console.log("[SALA] Link:", url);
  };

  room.onStadiumChange = function (newStadiumName, byPlayer) {
    map = byPlayer != null ? "custom" : "RSR";
    fieldWidth       = currentStadium.bg.width;
    fieldHeight      = currentStadium.bg.height;
    fieldWidthLimit  = fieldWidth  + 11.45;
    fieldHeightLimit = fieldHeight + 11.45;
  };

  // ── Utilitários ──────────────────────────────────────────────────────────────
  function hexToIP(hex) {
    if (!hex || hex === "") return "IP não disponível";
    try {
      let str = "";
      for (let i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      return str || "IP não disponível";
    } catch (e) {
      console.error("[IP] Erro ao converter:", e);
      return hex;
    }
  }

  // ── Eventos de jogadores ─────────────────────────────────────────────────────
  room.onPlayerJoin = function (player) {
    whisper("🌐 Seja-bem vindo a Hax Sports Brasil 🌐", player.id, 0x00CED1, "bold", 0);
    whisper("Entre em nosso discord: https://discord.gg/vT8Jf4Af3K", player.id, 0x00CED1, "bold", 0);
    jogadoresIPs[player.id] = player.conn;
    sendEventLog(player.name, hexToIP(player.conn), true);
    if (authorizedNicks.includes(player.name)) {
      room.setPlayerAdmin(player.id, true);
      if (superAdmins.indexOf(player.id) === -1) superAdmins.push(player.id);
      announce(`🌐 ${player.name} recebeu Admin!`, null, 0x00E2FF, "bold", 2);
    }
    displayAdminMessage();

    // ── Auto Balance: manda pro time menor ──────────────────────────────────
    const pl   = room.getPlayerList();
    const reds  = pl.filter(p => p.team === 1).length;
    const blues = pl.filter(p => p.team === 2).length;
    const maxPerTeam = 5;
    if (reds < maxPerTeam && reds <= blues) {
      room.setPlayerTeam(player.id, 1);
    } else if (blues < maxPerTeam) {
      room.setPlayerTeam(player.id, 2);
    }

    // ── Auto Start: inicia se ambos os times têm pelo menos 1 jogador ───────
    setTimeout(() => {
      if (room.getScores() == null) {
        const r = room.getPlayerList().filter(p => p.team === 1).length;
        const b = room.getPlayerList().filter(p => p.team === 2).length;
        if (r >= 1 && b >= 1) room.startGame();
      }
    }, 500);
  };

  room.onPlayerLeave = function (player) {
    displayAdminMessage();
    console.log(player.name + " saiu da sala");
    sendEventLog(player.name, "", false);
    if (isPlayerAFK(player.id)) removePlayerAFK(player.id);
    if (sistemaConfirmacaoAtivo && isPlayerConfirmado(player.id)) removerConfirmacao(player.id);
    if (jogadoresIPs[player.id]) delete jogadoresIPs[player.id];
    let index = superAdmins.indexOf(player.id);
    if (index > -1) sleep(100).then(() => superAdmins.splice(index, 1));
    let vipIndex = vipPlayers.indexOf(player.id);
    if (vipIndex > -1) vipPlayers.splice(vipIndex, 1);
  };

  // ── Sistema de Mute ───────────────────────────────────────────────────────────
  function isPlayerMuted(playerName) {
    if (!mutedPlayers[playerName]) return false;
    if (Date.now() >= mutedPlayers[playerName].endTime) { delete mutedPlayers[playerName]; return false; }
    return true;
  }
  function mutePlayer(playerName, duration, reason) {
    const now = Date.now();
    mutedPlayers[playerName] = { mutedAt: now, endTime: now + duration, reason };
  }
  function unmutePlayer(playerName) { delete mutedPlayers[playerName]; }

  // ── Sistema AFK ───────────────────────────────────────────────────────────────
  var afkPlayers      = {};
  var afkTimeoutNormal = 10 * 60 * 1000;

  function setPlayerAFK(player) {
    if (afkPlayers[player.id]) {
      removePlayerAFK(player.id);
      announce(`${player.name} voltou do AFK!`, null, 0x00FF00, "normal", 1);
      return false;
    }
    afkPlayers[player.id] = { name: player.name, startTime: Date.now(), isAdmin: player.admin };
    if (player.team !== 0) room.setPlayerTeam(player.id, 0);
    announce(`💤 ${player.name} está AFK`, null, 0xFFAA00, "normal", 1);
    return true;
  }
  function removePlayerAFK(playerId)  { delete afkPlayers[playerId]; }
  function isPlayerAFK(playerId)      { return afkPlayers[playerId] !== undefined; }

  function checkAFKTimeouts() {
    const now = Date.now();
    Object.keys(afkPlayers).forEach(playerId => {
      const afkData = afkPlayers[playerId];
      if (afkData.isAdmin) return;
      if (now - afkData.startTime >= afkTimeoutNormal) {
        removePlayerAFK(playerId);
        announce(`${afkData.name} saiu do AFK automaticamente (10 minutos)`, null, 0x00FF00, "normal", 1);
      }
    });
  }

  function getAFKList() {
    const list = [];
    Object.keys(afkPlayers).forEach(playerId => {
      const player = room.getPlayer(parseInt(playerId));
      if (player) {
        const timeAFK   = Math.floor((Date.now() - afkPlayers[playerId].startTime) / 60000);
        const timeLimit = afkPlayers[playerId].isAdmin ? "∞" : "10min";
        list.push(`${player.name} (${timeAFK}min/${timeLimit})`);
      }
    });
    return list;
  }

  // ── Sistema de Posições ───────────────────────────────────────────────────────
  function resetarSistemaPosicoes() {
    sistemaPosicoes.ativo  = false;
    sistemaPosicoes.usado  = false;
    sistemaPosicoes.jogadoresComPosicao.forEach(playerId => {
      if (room.getPlayer(playerId)) room.setPlayerAvatar(playerId, null);
    });
    sistemaPosicoes.jogadoresComPosicao = [];
    ["posicoesRed","posicoesBlue"].forEach(lado => {
      Object.keys(sistemaPosicoes[lado]).forEach(pos => {
        sistemaPosicoes[lado][pos].ocupada  = false;
        sistemaPosicoes[lado][pos].jogador  = null;
        sistemaPosicoes[lado][pos].playerId = null;
      });
    });
  }

  function enviarPosicoesDisponiveis() {
    const buildDisp = (lado, team) => {
      const disp = Object.keys(sistemaPosicoes[lado])
        .filter(p => !sistemaPosicoes[lado][p].ocupada)
        .map(p => `!${p}`);
      if (disp.length > 0) {
        room.getPlayerList().filter(p => p.team === team).forEach(player => {
          room.sendAnnouncement(`⚽ Posições disponíveis: ${disp.join(", ")}`, player.id, 0x00E2FF, "bold", 2);
        });
      }
    };
    buildDisp("posicoesRed", 1);
    buildDisp("posicoesBlue", 2);
  }

  function verificarTodasPosicoesEscolhidas() {
    const pl = room.getPlayerList();
    const red  = pl.filter(p => p.team === 1);
    const blue = pl.filter(p => p.team === 2);
    const todosEscolheram = arr => arr.length > 0 && arr.every(p => sistemaPosicoes.jogadoresComPosicao.includes(p.id));
    return todosEscolheram(red) && todosEscolheram(blue);
  }

  function finalizarSistemaPosicoes() {
    announce("Todas as posições foram escolhidas!", null, 0x00E2FF, "bold", 2);
    announce("O jogo será retomado em 5 segundos...", null, 0x00E2FF, "bold", 2);
    sleep(5000).then(() => {
      room.pauseGame(false);
      globalMuteActive = false;
      announce("Jogo retomado!", null, 0x00E2FF, "bold", 1);
    });
  }

  function escolherPosicao(player, posicao) {
    if (!sistemaPosicoes.ativo)  { whisper("O sistema de posições não está ativo.", player.id); return; }
    if (player.team === 0)       { whisper("Você precisa estar em um time para escolher uma posição.", player.id); return; }
    if (sistemaPosicoes.jogadoresComPosicao.includes(player.id)) { whisper("Você já escolheu uma posição.", player.id); return; }
    const posicoes = player.team === 1 ? sistemaPosicoes.posicoesRed : sistemaPosicoes.posicoesBlue;
    if (!posicoes[posicao])        { whisper("Essa posição não existe.", player.id); return; }
    if (posicoes[posicao].ocupada) { whisper("Essa posição já foi escolhida por outro jogador.", player.id); return; }

    posicoes[posicao].ocupada  = true;
    posicoes[posicao].jogador  = player.name;
    posicoes[posicao].playerId = player.id;
    sistemaPosicoes.jogadoresComPosicao.push(player.id);

    if (posicao === "gk" && sistemaSumulaAtivo && dadosPartida.ativa) {
      if (player.team === 1) dadosPartida.goleiroRed  = player.name;
      else                   dadosPartida.goleiroBlue = player.name;
    }

    room.setPlayerDiscProperties(player.id, posicoes[posicao].coords);
    room.setPlayerAvatar(player.id, posicoes[posicao].nome);
    const teamColor = player.team === 1 ? 0xff4640 : 0x089cff;
    announce(`${player.name} escolheu a posição ${posicoes[posicao].nome}`, null, teamColor, "bold", 2);
    enviarPosicoesDisponiveis();
    if (verificarTodasPosicoesEscolhidas()) finalizarSistemaPosicoes();
  }

  // ── Admin events ──────────────────────────────────────────────────────────────
  room.onPlayerAdminChange = function (changedPlayer, byPlayer) {
    if (byPlayer != null) {
      if (changedPlayer.id !== byPlayer.id) {
        if (superAdmins.indexOf(changedPlayer.id) > -1) {
          room.kickPlayer(byPlayer.id, "You cannot remove a Super Admin", false);
          room.setPlayerAdmin(changedPlayer.id, true);
        } else {
          if (changedPlayer.admin) sendEventLog(byPlayer.name, "", "admin", changedPlayer.name);
        }
      } else {
        if (!changedPlayer.admin) {
          let idx = superAdmins.indexOf(changedPlayer.id);
          if (idx > -1) superAdmins.splice(idx, 1);
        }
      }
    }
  };

  // ── Game events ───────────────────────────────────────────────────────────────
  room.onGameStart = function (byPlayer) {
    if (map === "RSR") {
      room.setDiscProperties(0, { invMass: 1.05 });
      if (byPlayer == null) {
        game = new Game();
        announce("Tempo de jogo: " + gameTime + " minutos");
        if (sistemaSumulaAtivo) {
          resetarDadosPartida();
          dadosPartida.ativa     = true;
          dadosPartida.nomeRed   = redTeamName;
          dadosPartida.nomeBlue  = blueTeamName;
          announce("📋 Sistema de súmula ativado - Registrando partida!", null, 0x00E2FF, "bold", 1);
        }
        if (sendRecWebhookURL !== "" || sistemaSumulaAtivo) {
          room.startRecording();
          recordingActive = true;
        }
      } else {
        gameTime = room.getScores().timeLimit !== 0 ? room.getScores().timeLimit / 60 : 10;
        room.stopGame();
        room.setTimeLimit(0);
        room.startGame();
      }
    }
  };

  room.onGameStop = function (byPlayer) {
    if (map === "RSR") {
      if (byPlayer != null) {
        room.setTimeLimit(gameTime);
      } else {
        let recData = null;
        if (recordingActive) { recData = room.stopRecording(); recordingActive = false; }
        if (sistemaSumulaAtivo && dadosPartida.ativa) {
          dadosPartida.recording = recData;
          announce("📋 Enviando súmula...", null, 0x00E2FF, "bold", 1);
          setTimeout(() => enviarSumula(), 100);
          dadosPartida.ativa = false;
        } else if (sendRecWebhookURL !== "" && recData) {
          let scores = room.getScores();
          if (scores != null) RecSistem.sendDiscordWebhook(scores);
        }
        // ── Auto Restart ──────────────────────────────────────────────────
        setTimeout(() => {
          const r = room.getPlayerList().filter(p => p.team === 1).length;
          const b = room.getPlayerList().filter(p => p.team === 2).length;
          if (r >= 1 && b >= 1) {
            announce("🔄 Reiniciando em 5 segundos...", null, 0x00E2FF, "bold", 1);
            setTimeout(() => room.startGame(), 5000);
          }
        }, 300);
      }
    }
    resetarSistemaPosicoes();
  };

  room.onPlayerBallKick = function (player) {
    if (map !== "RSR") return;
    game.rsTouchTeam = player.team;
    game.updateLastKicker(player.id, player.name, player.team);

    // POWERSHOT
    if (powerShotMode) {
      if (game.powershotCounter > 50) {
        room.setDiscProperties(0, {
          xgravity: -room.getPlayerDiscProperties(player.id).yspeed / 30,
          ygravity: -room.getPlayerDiscProperties(player.id).yspeed / 30
        });
        room.setDiscProperties(0, { color: "0xffffff" });
        game.rsSwingTimer = 50;
        // FIX: player.pm → player.id
        room.sendAnnouncement("OLHA O CHUTE!", player.id, 0x00E2FF, "bold", 1);
      }
      game.powershotCounter = 0;
      game.powershotID      = 0;
      game.powershotTrigger = false;
      if (parseFloat(room.getDiscProperties(0).invMass.toFixed(2)) !== 1.05)
        room.setDiscProperties(0, { invMass: 1.05 });
    }

    if (game.rsReady) {
      room.getPlayerList().filter(p => p.team !== 0).forEach(p => {
        if (room.getPlayerDiscProperties(p.id).invMass.toFixed(1) !== "0.3")
          room.setPlayerDiscProperties(p.id, { invMass: 0.3 });
      });
    }

    if (!game.rsActive && game.rsReady && (game.rsCorner || game.rsGoalKick)) {
      game.boosterState = true;
      game.rsActive     = true;
      game.rsReady      = false;
      room.setDiscProperties(1, { x: 2000, y: 2000 });
      room.setDiscProperties(2, { x: 2000, y: 2000 });
      room.setDiscProperties(0, { color: "0xffffff" });
      game.rsTimer = 1000000;
      game.warningCount++;
      if (game.rsCorner)
        room.setDiscProperties(0, { xgravity: room.getPlayerDiscProperties(player.id).xspeed / 16 * -1, ygravity: room.getPlayerDiscProperties(player.id).yspeed / 16 * -1 });
      if (game.rsGoalKick)
        room.setDiscProperties(0, { xgravity: 0, ygravity: room.getPlayerDiscProperties(player.id).yspeed / 20 * -1 });
      game.rsCorner   = false;
      game.rsGoalKick = false;
      game.outStatus  = "";
    }

    if (!game.rsActive && (game.outStatus === "redThrow" || game.outStatus === "blueThrow")) {
      game.outStatus  = "";
      game.rsActive   = true;
      game.rsReady    = false;
      room.setDiscProperties(0, { color: "0xffffff" });
      game.rsTimer = 1000000;
      game.warningCount++;
    }
  };

  room.onPlayerKicked = function (kickedPlayer, reason, ban, byPlayer) {
    if (superAdmins.indexOf(kickedPlayer.id) > -1 && byPlayer != null) {
      room.kickPlayer(byPlayer.id, "You cannot kick/ban a Super Admin", false);
      room.clearBans();
    } else if (byPlayer != null) {
      const eventType = ban ? "ban" : "kick";
      const message   = `${byPlayer.name} ${ban ? "baniu" : "kickou"} ${kickedPlayer.name} - Motivo: ${reason || "Sem motivo"}`;
      sendEventLog(message, "", eventType);
    }
  };

  // ── Chat ──────────────────────────────────────────────────────────────────────
  var playerLastMessage = {};
  var teamMsg           = "";   // FIX: declaração que estava faltando

  room.onPlayerChat = function (player, message) {
    console.log(player.name + ": " + message);

    if (!player.admin) {
      const now      = Date.now();
      const lastTime = playerLastMessage[player.id] || 0;
      if (now - lastTime < 1500) {
        whisper("⏳ Espere para mandar outra mensagem (intervalo de 1.5s)", player.id, 0xff6600, "bold");
        return false;
      }
      playerLastMessage[player.id] = now;
    }

    if (!message.startsWith("!")) {
      const isSuperAdmin = superAdmins.indexOf(player.id) > -1;
      const isVip        = vipPlayers.indexOf(player.id) > -1;
      sendChatLog(player.name, message, player.admin || isSuperAdmin, isVip);
    }

    if (globalMuteActive && !message.startsWith("!") && !player.admin) {
      whisper("🔇 O chat está mutado no momento!", player.id, 0xff6600, "bold");
      return false;
    }

    if (isPlayerMuted(player.name) && !message.startsWith("!")) {
      const muteData = mutedPlayers[player.name];
      const timeLeft = Math.ceil((muteData.endTime - Date.now()) / 60000);
      whisper(`🔇 Você está mutado! Tempo restante: ${timeLeft} minuto(s) | Motivo: ${muteData.reason}`, player.id, 0xff6600, "bold");
      return false;
    }

    if (message.startsWith("!")) {
      message = message.substr(1).toLowerCase();
      let args = message.split(" ");

      if (args[0] === "admin" && args.length === 1 && allowPublicAdmin) {
        if (!isAdminPresent()) room.setPlayerAdmin(player.id, true);
        else whisper("O Admin já está na sala ou o comando !admin não está permitido", player.id);
      }
      else if (args[0] === "admin" && args.length === 2) {
        if (args[1] === superAdminCode) {
          room.setPlayerAdmin(player.id, true);
          if (superAdmins.indexOf(player.id) === -1) superAdmins.push(player.id);
          announce(player.name + " pegou Super Admin!");
        } else if (args[1].toUpperCase() === senhaAdminDiaria && senhaAdminDiaria !== "") {
          room.setPlayerAdmin(player.id, true);
          if (superAdmins.indexOf(player.id) === -1) superAdmins.push(player.id);
          announce("🌐 " + player.name + " virou Admin!", null, 0x00E2FF, "bold", 2);
        } else {
          whisper("❌ Senha incorreta ou expirada!", player.id, 0xFF6B6B, "bold");
        }
      }
      else if (args[0] === "vip" && args.length === 2) {
        if (args[1].toUpperCase() === senhaVipDiaria && senhaVipDiaria !== "") {
          if (vipPlayers.indexOf(player.id) === -1) {
            vipPlayers.push(player.id);
            announce("💎 " + player.name + " virou VIP!", null, 0x9B59B6, "bold", 2);
          } else {
            whisper("✅ Você já é VIP!", player.id, 0x9B59B6, "bold");
          }
        } else {
          whisper("❌ Senha VIP incorreta ou expirada!", player.id, 0xFF6B6B, "bold");
        }
      }
      else if (args[0] === "reenviar_senhas" && player.admin) {
        if (superAdmins.indexOf(player.id) === -1) {
          whisper("❌ Apenas Super Admins podem usar este comando!", player.id, 0xFF6B6B, "bold");
          return false;
        }
        senhaAdminDiaria = gerarSenhaAleatoria("ADM");
        senhaVipDiaria   = gerarSenhaAleatoria("VIP");
        vipPlayers       = [];
        enviarSenhasWebhook();
        announce("🔑 Novas senhas geradas e enviadas por " + player.name + "!", null, 0x00E2FF, "bold", 2);
        whisper("🔑 Admin: " + senhaAdminDiaria + " | VIP: " + senhaVipDiaria, player.id, 0x00E2FF, "bold");
        console.log(`[SENHAS] Senhas resetadas manualmente por ${player.name}`);
      }
      else if (args[0] === "clearbans") {
        if (player.admin) { room.clearBans(); announce("Os bans foram retirados por: " + player.name); }
        else whisper("Apenas admins podem usar este comando", player.id);
      }
      else if (args[0] === "team" && args.length >= 3) {
        if (player.admin) {
          const side         = args[1].toLowerCase();
          const teamName     = args.slice(2).join(" ");
          const formattedName = teamName.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
          if (side === "r" || side === "red") {
            redTeamName = formattedName;
            announce(`Nome e uniforme do time vermelho alterado para: ${formattedName}`);
            setTeamKits("r", redTeamName.toLowerCase());
          } else if (side === "b" || side === "blue") {
            blueTeamName = formattedName;
            announce(`Nome e uniforme do azul alterado para: ${formattedName}`);
            setTeamKits("b", blueTeamName.toLowerCase());
          } else {
            whisper("Use: !team r/red <nome> ou !team b/blue <nome>", player.id);
          }
        } else whisper("Apenas admins podem usar este comando", player.id);
      }
      else if (args[0] === "restorekits") {
        if (player.admin) applyBothKits();
        else whisper("Apenas admins podem usar este comando", player.id);
      }
      else if (args[0] === "swap" && player.admin) {
        room.getPlayerList().filter(p => p.id !== 0).forEach(p => {
          if (p.team === 1) room.setPlayerTeam(p.id, 2);
          else if (p.team === 2) room.setPlayerTeam(p.id, 1);
        });
        announce("Times foram trocados por: " + player.name);
      }
      else if (args[0] === "swap" && !player.admin) {
        whisper("Comando apenas de Admin", player.id);
      }
      else if (args[0] === "lock" && player.admin) {
        if (superAdmins.indexOf(player.id) > -1) {
          room.setPassword(args[1]); roomPassword = args[1];
          announce("Senha foi trocada por: " + player.name);
          sendEventLog(player.name, "", "lock", args[1]);
        } else whisper("Apenas super admins podem mudar a senha.", player.id);
      }
      else if (args[0] === "unlock" && player.admin) {
        if (superAdmins.indexOf(player.id) > -1) {
          room.setPassword(null); roomPassword = null;
          announce("Senha foi retirada por: " + player.name);
          sendEventLog(player.name, "", "unlock");
        } else whisper("Apenas super admins podem tirar a senha.", player.id);
      }
      else if (args[0] === "rs" && player.admin) {
        if (room.getScores() == null) room.setCustomStadium(getRealSoccerMap());
        else whisper("Não é possível mudar o mapa durante o jogo.", player.id);
      }
      else if (args[0] === "rr" && player.admin) {
        let recData = null;
        if (recordingActive) { recData = room.stopRecording(); recordingActive = false; }
        if (sistemaSumulaAtivo && dadosPartida.ativa) {
          dadosPartida.recording = recData;
          enviarSumula();
          announce("📋 Súmula enviada", null, 0x00E2FF, "bold", 1);
          dadosPartida.ativa = false;
        } else if (sendRecWebhookURL !== "" && recData) {
          let scores = room.getScores();
          if (scores != null) RecSistem.sendDiscordWebhook(scores);
        }
        room.stopGame();
        room.startGame();
        resetarSistemaPosicoes();
      }
      else if (args[0] === "muteall" && player.admin) {
        if (superAdmins.indexOf(player.id) > -1) {
          globalMuteActive = true;
          announce("🔇 Chat foi mutado por " + player.name + "!", null, 0x20fd62, "bold");
          sendEventLog(`${player.name} mutou o chat`, "", "muteall");
        } else whisper("Apenas Super Admins podem executar este comando", player.id);
      }
      else if (args[0] === "unmuteall" && player.admin) {
        if (superAdmins.indexOf(player.id) > -1) {
          globalMuteActive = false;
          announce("🔊 Chat foi desmutado por " + player.name + "!", null, 0x20fd62, "bold");
          sendEventLog(`${player.name} desmutou o chat`, "", "unmuteall");
        } else whisper("Apenas Super Admins podem executar este comando", player.id);
      }
      else if (args[0] === "mute" && args.length >= 3 && player.admin) {
        if (superAdmins.indexOf(player.id) === -1) { whisper("❌ Apenas Super Admins podem usar este comando!", player.id); return false; }
        const targetId  = parseInt(args[1].replace("#",""));
        const duration  = args[2];
        const reason    = args.slice(3).join(" ") || "Sem motivo especificado";
        if (isNaN(targetId)) { whisper("❌ Use: !mute #id <tempo> [motivo] (ex: !mute #5 30m spam)", player.id); return false; }
        const timeMatch = duration.match(/^(\d+)([mhd])$/i);
        if (!timeMatch) { whisper("❌ Formato inválido! Use: 30m / 2h / 1d", player.id); return false; }
        const timeValue = parseInt(timeMatch[1]);
        const timeUnit  = timeMatch[2].toLowerCase();
        let durationMs, durationText;
        switch (timeUnit) {
          case "m": durationMs = timeValue * 60000;        durationText = `${timeValue} minuto(s)`;  break;
          case "h": durationMs = timeValue * 3600000;      durationText = `${timeValue} hora(s)`;    break;
          case "d": durationMs = timeValue * 86400000;     durationText = `${timeValue} dia(s)`;     break;
        }
        const targetPlayer = room.getPlayerList().find(p => p.id === targetId);
        if (!targetPlayer)       { whisper("❌ Jogador não encontrado!", player.id); return false; }
        if (targetPlayer.admin)  { whisper("❌ Não é possível mutar um admin!", player.id); return false; }
        mutePlayer(targetPlayer.name, durationMs, reason);
        whisper(`🔇 ${targetPlayer.name} foi mutado por ${durationText} - ${reason}`, player.id);
        whisper(`🔇 Você foi mutado por ${durationText} - ${reason}`, targetPlayer.id, 0xFF6B6B, "bold", 1);
        sendEventLog(`${player.name} mutou ${targetPlayer.name} por ${durationText} - Motivo: ${reason}`, "", "mute");
      }
      else if (args[0] === "unmute" && args.length === 2 && player.admin) {
        if (superAdmins.indexOf(player.id) === -1) { whisper("❌ Apenas Super Admins podem usar este comando!", player.id); return false; }
        const targetId = parseInt(args[1].replace("#",""));
        if (isNaN(targetId)) { whisper("❌ Use: !unmute #id", player.id); return false; }
        const targetPlayer = room.getPlayerList().find(p => p.id === targetId);
        if (!targetPlayer)               { whisper("❌ Jogador não encontrado!", player.id); return false; }
        if (!isPlayerMuted(targetPlayer.name)) { whisper("❌ Este jogador não está mutado!", player.id); return false; }
        unmutePlayer(targetPlayer.name);
        whisper(`🔊 ${targetPlayer.name} foi desmutado!`, player.id);
        whisper(`🔊 Você foi desmutado!`, targetPlayer.id, 0x00FF00, "bold", 1);
        sendEventLog(`${player.name} desmutou ${targetPlayer.name}`, "", "unmute");
      }
      else if (args[0] === "bb") {
        room.kickPlayer(player.id, "Vaza, Imundo", false);
      }
      else if (args[0] === "dc" || args[0] === "discord") {
        whisper("Discord da CLA: https://discord.gg/kt2fSR8REK", player.id, 0x00E2FF, "bold");
      }
      else if ((args[0] === "powershot" || args[0] === "ps") && player.admin) {
        powerShotMode = !powerShotMode;
        announce(`MODO DE POWERSHOT ${powerShotMode ? "ATIVADO" : "DESATIVADO"} POR ${player.name}`, null, powerShotMode ? 0x00FF00 : 0xFF0000);
      }
      else if (args[0] === "posicao" && player.admin) {
        if (superAdmins.indexOf(player.id) === -1) { whisper("Apenas super admins podem usar este comando.", player.id); return false; }
        if (room.getScores() == null)               { whisper("O jogo precisa estar iniciado para usar este comando.", player.id); return false; }
        if (room.getScores().time !== 0)            { whisper("Este comando só pode ser usado no início da partida.", player.id); return false; }
        if (sistemaPosicoes.usado)                  { whisper("O sistema de posições já foi usado nesta partida. Use !rr para resetar.", player.id); return false; }
        sistemaPosicoes.ativo = true;
        sistemaPosicoes.usado = true;
        room.pauseGame(true);
        globalMuteActive = true;
        announce("🔇 Chat mutado durante escolha de posições", null, 0xFFAA00, "bold", 1);
        enviarPosicoesDisponiveis();
        const interval = setInterval(() => {
          if (!sistemaPosicoes.ativo || verificarTodasPosicoesEscolhidas()) clearInterval(interval);
          else enviarPosicoesDisponiveis();
        }, 5000);
      }
      else if (args[0] === "gk") { escolherPosicao(player, "gk"); return false; }
      else if (args[0] === "vl") { escolherPosicao(player, "vl"); return false; }
      else if (args[0] === "me") { escolherPosicao(player, "me"); return false; }
      else if (args[0] === "md") { escolherPosicao(player, "md"); return false; }
      else if (args[0] === "ca") { escolherPosicao(player, "ca"); return false; }
      else if (args[0] === "afk") { setPlayerAFK(player); return false; }
      else if (args[0] === "afklist") {
        const afkList = getAFKList();
        if (afkList.length === 0) whisper("📋 Nenhum jogador está AFK no momento", player.id, 0x00E2FF, "normal");
        else {
          whisper("📋 Jogadores AFK:", player.id, 0x00E2FF, "bold");
          afkList.forEach(info => whisper("  • " + info, player.id, 0xFFFFFF, "normal"));
        }
        return false;
      }
      else if (args[0] === "confirmar") {
        if (args.length >= 2) {
          if (args[1] === "on") {
            if (!player.admin) { whisper("❌ Apenas admins podem ativar/desativar o sistema de confirmação!", player.id, 0xFF6B6B, "bold"); return false; }
            sistemaConfirmacaoAtivo = true;
            announce(`✅ Sistema de confirmação ativado por ${player.name}!`, null, 0x00E2FF, "bold", 1);
            return false;
          } else if (args[1] === "off") {
            if (!player.admin) { whisper("❌ Apenas admins podem ativar/desativar o sistema de confirmação!", player.id, 0xFF6B6B, "bold"); return false; }
            sistemaConfirmacaoAtivo = false;
            announce(`❌ Sistema de confirmação desativado por ${player.name}!`, null, 0xFF6B6B, "bold", 1);
            return false;
          }
        }
        confirmarJogador(player);
        return false;
      }
      else if (args[0] === "sumula" && args.length >= 2) {
        if (!player.admin) { whisper("❌ Apenas admins podem usar este comando!", player.id, 0xFF6B6B, "bold"); return false; }
        const scores = room.getScores();
        if (args[1] === "on") {
          if (scores != null && scores.time > 0) { whisper("❌ Não é possível ativar a súmula com jogo em andamento!", player.id, 0xFF6B6B, "bold"); return false; }
          sistemaSumulaAtivo = true;
          announce(`Sistema de súmula ativado por ${player.name}!`, null, 0x00E2FF, "bold", 1);
        } else if (args[1] === "off") {
          if (scores != null && scores.time > 0) { whisper("❌ Não é possível desativar a súmula com jogo em andamento!", player.id, 0xFF6B6B, "bold"); return false; }
          sistemaSumulaAtivo = false;
          announce(`Sistema de súmula desativado por ${player.name}!`, null, 0xFF6B6B, "bold", 1);
        }
        return false;
      }
      else if (args[0] === "help") {
        displayHelp(player.id, args[1]);
      }
      else if (args[0] === "super") {
        let superMsg = "Super Admins: ";
        superAdmins.forEach(id => {
          const p = room.getPlayer(id);
          if (p != null) superMsg += p.name + ", ";
        });
        if (superAdmins.length > 0) superMsg = superMsg.slice(0, -2);
        else superMsg = "Não tem super admins presentes.";
        whisper(superMsg, player.id);
      }
      else if (args[0] === "pens" && ["red","r"].includes(args[1]) && player.admin) {
        room.getPlayerList().filter(p => p.team !== 0).forEach(p => {
          if (room.getPlayerDiscProperties(p.id).invMass !== 9999999)
            room.setPlayerDiscProperties(p.id, { invMass: 9999999 });
        });
        room.setDiscProperties(3, { x: penalMark, y: 0, radius: 18 });
        room.setDiscProperties(0, { invMass: 1.36, x: penalMark, y: 0, xspeed: 0, yspeed: 0, color: "0xff3f34", xgravity: 0, ygravity: 0 });
        game.rsReady   = true;
        game.rsPenalty = true;
        room.sendAnnouncement("⚽ PÊNALTI PARA O TIME VERMELHO!", null, 0xdc2626, "bold");
      }
      else if (args[0] === "pens" && ["blue","b"].includes(args[1]) && player.admin) {
        room.getPlayerList().filter(p => p.team !== 0).forEach(p => {
          if (room.getPlayerDiscProperties(p.id).invMass !== 9999999)
            room.setPlayerDiscProperties(p.id, { invMass: 9999999 });
        });
        room.setDiscProperties(3, { x: -penalMark, y: 0, radius: 18 });
        room.setDiscProperties(0, { invMass: 1.36, x: -penalMark, y: 0, xspeed: 0, yspeed: 0, color: "0x0fbcf9", xgravity: 0, ygravity: 0 });
        game.rsReady   = true;
        game.rsPenalty = true;
        room.sendAnnouncement("⚽ PÊNALTI PARA O TIME AZUL!", null, 0x334ebb, "bold");
      }
      else if (args[0] === "atr" && player.admin) {
        room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
        room.sendAnnouncement("Autorizado!", null, 0x00E2FF, "bold");
      }
      else if ((args[0] === "pens" || args[0] === "atr") && !player.admin) {
        announce("😂 " + player.name + " tentou usar o comando novamente?!", null, 0xFF6B6B, "bold");
      }

      return false;
    } // end if startsWith("!")

    // Mensagem de time
    if (message.startsWith("t ")) {
      teamMsg = message.substring(2).trim();
      const teamId  = player.team;
      const label   = teamId === 1 ? "[Team]" : teamId === 2 ? "[Team]" : "[Spec]";
      const color   = teamId === 1 ? 0xED6A5A : teamId === 2 ? 0x5995ED : 0xdee7fa;
      room.getPlayerList().filter(p => p.team === teamId).forEach(p => {
        room.sendAnnouncement(`${label} ${player.name}: ${teamMsg}`, p.id, color, "normal", 1);
      });
      return false;
    }

    // Chat Admin (xyz)
    if (message.startsWith("xyz ")) {
      if (!player.admin && superAdmins.indexOf(player.id) === -1) {
        whisper("❌ Apenas admins podem usar o chat admin!", player.id, 0xff0000, "bold");
        return false;
      }
      const adminMsg = message.substring(4).trim();
      room.getPlayerList().forEach(p => {
        if (p.admin || superAdmins.indexOf(p.id) > -1)
          room.sendAnnouncement("[ADMIN] " + player.name + ": " + adminMsg, p.id, 0x9B59B6, "bold", 1);
      });
      return false;
    }

    // PM (@@)
    if (message.startsWith("@@")) {
      message = message.substr(2).trim();
      if (message.indexOf(" ") !== -1) {
        let parts = message.match(/^(\S+)\s(.*)/);
        if (parts && parts.length > 2) {
          const targetName = parts[1];
          const pmMsg      = parts[2];
          let pmSent       = false;
          room.getPlayerList().forEach(p => {
            if (p.name === targetName || p.name === targetName.replace(/_/g, " ")) {
              whisper(`[PM > ${p.name}] ${player.name}: ${pmMsg}`, player.id, 0xffa220, "normal", 1);
              whisper(`[PM] ${player.name}: ${pmMsg}`,             p.id,      0xffa220, "normal", 1);
              pmSent = true;
            }
          });
          if (!pmSent) whisper(`Impossível encontrar usuário '${targetName}'`, player.id, 0xffa220, "normal", 1);
          return false;
        }
      }
    }

    // Formatar mensagem normal
    const isSuperAdmin = superAdmins.indexOf(player.id) > -1;
    const isVip        = vipPlayers.indexOf(player.id) > -1;
    let displayName    = player.name;
    let messageColor   = 0xFFFFFF;
    if (isSuperAdmin) displayName = "[⚜️] " + player.name;
    else if (isVip)   displayName = "[💎] " + player.name;
    if      (player.team === 1) messageColor = 0xff4640;
    else if (player.team === 2) messageColor = 0x089cff;
    else if (isSuperAdmin)      messageColor = 0x00E2FF;
    else if (isVip)             messageColor = 0x9B59B6;

    room.sendAnnouncement(displayName + ": " + message, null, messageColor, "bold", 1);
    return false;
  };

  // ── Ajuda ────────────────────────────────────────────────────────────────────
  function displayHelp(id) {
    whisper("Comandos: @@, t, xyz, !dc, !discord, !afk, !afklist, !confirmar, !team r/b <nome>, !sumula on/off, !rs, !rr, !bb, !powershot, !ps, !admin, !vip, !lock, !unlock, !clearbans, !swap, !posicao, !gk, !vl, !me, !md, !ca, !mute, !unmute, !muteall, !unmuteall, !pens r/b, !atr", id, null, "small");
  }

  room.onPlayerTeamChange = function (changedPlayer, byPlayer) {
    // ── Team Lock: jogador não pode mudar de time sozinho ──────────────────
    if (byPlayer != null && byPlayer.id === changedPlayer.id && !changedPlayer.admin && changedPlayer.team !== 0) {
      setTimeout(() => room.setPlayerTeam(changedPlayer.id, 0), 100);
      whisper("🔒 Times travados! Apenas admins podem mover jogadores.", changedPlayer.id, 0xFF6B6B, "bold");
      return;
    }

    // ── X5: limita a 5 jogadores por time ──────────────────────────────────
    if (changedPlayer.team !== 0) {
      const maxPerTeam = 5;
      const count = room.getPlayerList().filter(p => p.team === changedPlayer.team && p.id !== changedPlayer.id).length;
      if (count >= maxPerTeam) {
        setTimeout(() => room.setPlayerTeam(changedPlayer.id, 0), 100);
        whisper(`❌ Time cheio! Máximo de ${maxPerTeam} jogadores por time.`, changedPlayer.id, 0xFF6B6B, "bold");
        return;
      }
    }

    if (isPlayerAFK(changedPlayer.id) && changedPlayer.team !== 0) {
      setTimeout(() => room.setPlayerTeam(changedPlayer.id, 0), 100);
      announce(`${changedPlayer.name} está AFK e não pode entrar em times`, null, 0xFF6B6B, "normal", 1);
    }
    if (sistemaConfirmacaoAtivo && changedPlayer.team !== 0 && !isPlayerConfirmado(changedPlayer.id)) {
      setTimeout(() => room.setPlayerTeam(changedPlayer.id, 0), 100);
      announce(`❌ ${changedPlayer.name} não pode jogar sem confirmar! Use !confirmar`, null, 0xFF6B6B, "bold", 2);
    }
    if (map === "RSR" && room.getScores() != null && !game.rsActive) {
      room.getPlayerList().forEach(p => {
        if (p != null && (game.rsGoalKick || game.rsCorner || game.rsPenalty)) {
          room.setPlayerDiscProperties(p.id, { invMass: 9999999 });
        }
      });
    }
  };

  room.onTeamGoal = function (team) {
    if (map !== "RSR") return;
    game.rsActive = false;
    const goalTime = secondsToMinutes(Math.floor(room.getScores().time));
    let scorer, assister = "", goalType;

    if (team === 1) {
      if (game.lastKickerTeam === 1) {
        goalType = "GOLAÇOOOOOOO! É DO " + redTeamName;
        scorer   = "É DELE DELE DELE DELE: " + game.lastKickerName;
        avatarCelebration(game.lastKickerId, "⚽");
        let assisterName = null;
        if (game.secondLastKickerTeam === 1 && game.lastKickerId !== game.secondLastKickerId) {
          assister     = " (Assistência de: " + game.secondLastKickerName + ")";
          assisterName = game.secondLastKickerName;
          avatarCelebration(game.secondLastKickerId, "🎯");
        }
        registrarGol(1, game.lastKickerName, assisterName, false);
      }
      if (game.lastKickerTeam === 2) {
        goalType = "PUTA QUE PARIU";
        scorer   = "O GOL É DO OUTRO LADO INFELIZZZZZZZZ DESGRAÇADO: " + game.lastKickerName;
        avatarCelebration(game.lastKickerId, "🤡");
        if (game.secondLastKickerTeam === 1) { assister = " (Chute de: " + game.secondLastKickerName + ")"; avatarCelebration(game.secondLastKickerId, "🤡"); }
        registrarGol(1, game.lastKickerName, null, true);
      }
      game.redScore++;
    }
    if (team === 2) {
      if (game.lastKickerTeam === 2) {
        goalType = "GOLÃOOOOOOOOOO! É DO " + blueTeamName;
        scorer   = "O MENINU É LISO DEMAIS, DE: " + game.lastKickerName;
        avatarCelebration(game.lastKickerId, "⚽");
        let assisterName = null;
        if (game.secondLastKickerTeam === 2 && game.lastKickerId !== game.secondLastKickerId) {
          assister     = " (Assistência de: " + game.secondLastKickerName + ")";
          assisterName = game.secondLastKickerName;
          avatarCelebration(game.secondLastKickerId, "🎯");
        }
        registrarGol(2, game.lastKickerName, assisterName, false);
      }
      if (game.lastKickerTeam === 1) {
        goalType = "DESGRAÇAAAAAAAA";
        scorer   = "BICHO, NUNCA VI UM CARA TÃO RUIM COMO TU: " + game.lastKickerName;
        avatarCelebration(game.lastKickerId, "🤡");
        if (game.secondLastKickerTeam === 2) { assister = " (Chute de: " + game.secondLastKickerName + ")"; avatarCelebration(game.secondLastKickerId, "🤡"); }
        registrarGol(2, game.lastKickerName, null, true);
      }
      game.blueScore++;
    }
    announce(goalType + " 🟥 " + game.redScore + " - " + game.blueScore + " 🟦  🕐 " + goalTime + "  " + scorer + assister);
    game.lastKickerTeam       = undefined;
    game.secondLastKickerTeam = undefined;
  };

  room.onPositionsReset = function () {
    if (map === "RSR" && game.lastPlayAnnounced) {
      room.pauseGame(true);
      game.lastPlayAnnounced = false;
      announce("ACABOU AMIGOS!");
    }
  };

  room.onGameTick = function () {
    if (!game) return;  // guarda de segurança
    if (map === "RSR") {
      updateGameStatus();
      handleBallTouch();
      realSoccerRef();
    }
    if (game.time % 300 === 0) checkAFKTimeouts();
  };

  // ── Real Soccer Referee ───────────────────────────────────────────────────────
  function realSoccerRef() {
    blockThrowIn();
    blockGoalKick();
    removeBlock();

    if (game.time === gameTime * 60 && !game.extraTimeAnnounced) {
      extraTime();
      game.extraTimeAnnounced = true;
    }
    if (game.time === game.extraTimeEnd && !game.lastPlayAnnounced) {
      announce("ACABOU NÉ JUIZ!", null, null, null, 1);
      game.lastPlayAnnounced = true;
    }
    if (game.rsCorner || game.rsGoalKick) game.extraTimeCount++;

    if (game.rsTimer < 99999 && !game.paused && !game.rsActive && game.rsReady) game.rsTimer++;

    if (game.rsSwingTimer < 150 && !game.rsCorner && !game.rsGoalKick) {
      game.rsSwingTimer++;
      if (game.rsSwingTimer > 5)
        room.setDiscProperties(0, { xgravity: room.getDiscProperties(0).xgravity * 0.97, ygravity: room.getDiscProperties(0).ygravity * 0.97 });
      if (game.rsSwingTimer === 150)
        room.setDiscProperties(0, { xgravity: 0, ygravity: 0 });
    }

    if (game.boosterState) game.boosterCount++;
    if (game.boosterCount > 30) {
      game.boosterState = false;
      game.boosterCount = 0;
      room.setDiscProperties(0, { cMask: 63 });
    }

    if (room.getBallPosition().x === 0 && room.getBallPosition().y === 0) {
      game.rsActive  = true;
      game.outStatus = "";
    }

    if (!game.rsActive && game.rsReady) {
      if (game.outStatus === "redThrow") {
        if (game.rsTimer === throwTimeOut - 120) ballWarning("0xff3f34", ++game.warningCount);
        if (game.rsTimer === throwTimeOut && !game.bringThrowBack) {
          game.outStatus = "blueThrow"; game.rsTimer = 0;
          room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
          sleep(100).then(() => room.setDiscProperties(0, { color: "0x0fbcf9", xspeed: 0, yspeed: 0, x: game.ballOutPositionX, y: game.throwInPosY }));
        }
      } else if (game.outStatus === "blueThrow") {
        if (game.rsTimer === throwTimeOut - 120) ballWarning("0x0fbcf9", ++game.warningCount);
        if (game.rsTimer === throwTimeOut && !game.bringThrowBack) {
          game.outStatus = "redThrow"; game.rsTimer = 0;
          room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
          sleep(100).then(() => room.setDiscProperties(0, { color: "0xff3f34", xspeed: 0, yspeed: 0, x: game.ballOutPositionX, y: game.throwInPosY }));
        }
      } else if (game.outStatus === "blueGK" || game.outStatus === "redGK") {
        if (game.rsTimer === gkTimeOut - 120) {
          ballWarning(game.outStatus === "blueGK" ? "0x0fbcf9" : "0xff3f34", ++game.warningCount);
        }
        if (game.rsTimer === gkTimeOut) {
          game.outStatus = ""; room.setDiscProperties(0, { color: "0xffffff" }); game.rsTimer = 1000000;
        }
      } else if (game.outStatus === "blueCK" || game.outStatus === "redCK") {
        if (game.rsTimer === ckTimeOut - 120) {
          ballWarning(game.outStatus === "blueCK" ? "0x0fbcf9" : "0xff3f34", ++game.warningCount);
        }
        if (game.rsTimer === ckTimeOut) {
          game.outStatus = "";
          room.setDiscProperties(1, { x: 0, y: 2000, radius: 0 });
          room.setDiscProperties(2, { x: 0, y: 2000, radius: 0 });
          room.setDiscProperties(0, { color: "0xffffff" }); game.rsTimer = 1000000;
        }
      }
    }

    if (game.rsActive) {
      const bx = room.getBallPosition().x;
      const by = room.getBallPosition().y;

      if (by > 611.45 || by < -611.45) {
        game.rsActive = false;
        if (game.lastPlayAnnounced) { room.pauseGame(true); game.lastPlayAnnounced = false; announce("FIM DE JOGO!"); }
        room.setDiscProperties(0, { xgravity: 0, ygravity: 0 });
        game.ballOutPositionX = Math.round(bx * 10) / 10;
        game.throwInPosY      = by > 0 ? 610 : -610;
        if (bx > 1130)  game.ballOutPositionX = 1130;
        if (bx < -1130) game.ballOutPositionX = -1130;

        const outColor    = game.rsTouchTeam === 1 ? "0x0fbcf9" : "0xff3f34";
        const outStatus   = game.rsTouchTeam === 1 ? "blueThrow" : "redThrow";
        room.setDiscProperties(3, { x: game.ballOutPositionX, y: game.throwInPosY, radius: 18 });
        sleep(100).then(() => {
          game.outStatus    = outStatus;
          game.throwinKicked = false;
          game.rsTimer      = 0;
          game.rsReady      = true;
          room.setDiscProperties(0, { xspeed: 0, yspeed: 0, x: game.ballOutPositionX, y: game.throwInPosY, color: outColor, xgravity: 0, ygravity: 0 });
        });
        sleep(100).then(() => room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 }));
      }

      if (bx > 1161.45 && (by > 124 || by < -124)) {
        game.rsActive = false;
        if (game.lastPlayAnnounced) { room.pauseGame(true); game.lastPlayAnnounced = false; announce("ACABA O JOGO!"); }
        room.setDiscProperties(0, { xgravity: 0, ygravity: 0 });
        room.getPlayerList().forEach(p => room.setPlayerDiscProperties(p.id, { invMass: 100000 }));

        if (game.rsTouchTeam === 1) {
          // Tiro de meta azul
          room.setDiscProperties(3, { x: 1060, y: 0, radius: 18 });
          sleep(100).then(() => {
            game.outStatus    = "blueGK"; game.rsTimer = 0; game.rsReady = true;
            game.rsGoalKick   = true; game.rsSwingTimer = 0;
            game.boosterCount = 0;    game.boosterState = false;
            room.setDiscProperties(0, { xspeed: 0, yspeed: 0, x: 1060, y: 0, color: "0x0fbcf9", cMask: 268435519, xgravity: 0, ygravity: 0 });
          });
          sleep(3000).then(() => room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 }));
        } else {
          // Escanteio vermelho
          game.rsSwingTimer = 0;
          const cy = by < -124 ? -590 : 590;
          room.setDiscProperties(3, { x: 1140, y: cy, radius: 18 });
          sleep(100).then(() => {
            game.rsCorner = true; game.outStatus = "redCK"; game.rsTimer = 0; game.rsReady = true;
            game.boosterCount = 0; game.boosterState = false;
            room.setDiscProperties(0, { x: 1140, y: cy, xspeed: 0, yspeed: 0, color: "0xff3f34", cMask: 268435519, xgravity: 0, ygravity: 0 });
            room.setDiscProperties(2, { x: 1150, y: cy < 0 ? -670 : 670, radius: 420 });
            room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
          });
        }
      }

      if (bx < -1161.45 && (by > 124 || by < -124)) {
        game.rsActive = false;
        if (game.lastPlayAnnounced) { room.pauseGame(true); game.lastPlayAnnounced = false; announce("SEM MAIS JOGO!"); }
        room.setDiscProperties(0, { xgravity: 0, ygravity: 0 });
        room.getPlayerList().forEach(p => room.setPlayerDiscProperties(p.id, { invMass: 100000 }));

        if (game.rsTouchTeam === 1) {
          // Escanteio azul
          game.rsSwingTimer = 0;
          const cy = by < -124 ? -590 : 590;
          room.setDiscProperties(3, { x: -1140, y: cy, radius: 18 });
          sleep(100).then(() => {
            game.rsCorner = true; game.outStatus = "blueCK"; game.rsTimer = 0; game.rsReady = true;
            game.boosterCount = 0; game.boosterState = false;
            room.setDiscProperties(0, { x: -1140, y: cy, xspeed: 0, yspeed: 0, color: "0x0fbcf9", cMask: 268435519, xgravity: 0, ygravity: 0 });
            room.setDiscProperties(1, { x: -1150, y: cy < 0 ? -670 : 670, radius: 420 });
            room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
          });
        } else {
          // Tiro de meta vermelho
          room.setDiscProperties(3, { x: -1060, y: 0, radius: 18 });
          sleep(100).then(() => {
            game.outStatus    = "redGK"; game.rsTimer = 0; game.rsReady = true;
            game.rsGoalKick   = true; game.rsSwingTimer = 0;
            game.boosterCount = 0;    game.boosterState = false;
            room.setDiscProperties(0, { xspeed: 0, yspeed: 0, x: -1060, y: 0, color: "0xff3f34", cMask: 268435519, xgravity: 0, ygravity: 0 });
          });
          sleep(3000).then(() => room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 }));
        }
      }
    }
  }

  // ── Física / colisão ──────────────────────────────────────────────────────────
  function handleBallTouch() {
    const players        = room.getPlayerList();
    const ballPosition   = room.getBallPosition();
    const ballRadius     = game.ballRadius;
    const playerRadius   = 15;
    const triggerDist    = ballRadius + playerRadius + 0.01;

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (!player.position) continue;
      const dist = pointDistance(player.position, ballPosition);

      if (dist < triggerDist) {
        game.rsTouchTeam   = player.team;
        game.throwinKicked = false;

        // POWERSHOT
        if (!game.rsCorner && !game.rsGoalKick &&
            game.outStatus !== "blueThrow" && game.outStatus !== "redThrow" && powerShotMode) {
          if (game.powershotID !== player.id) {
            game.powershotID      = player.id;
            game.powershotTrigger = false;
            game.powershotCounter = 0;
          } else {
            game.powershotCounter++;
            const powershotPlayer      = room.getPlayer(game.powershotID);
            const targetPSInvMass      = (powershotPlayer && powershotPlayer.name === "Becace") ? becacePowerShotInvMass : defaultPowerShotInvMass;
            if (game.powershotCounter > 50 && !game.powershotTrigger &&
                Math.abs(room.getDiscProperties(0).invMass - targetPSInvMass) > 0.01) {
              room.setDiscProperties(0, { invMass: targetPSInvMass, color: "0x05EBDB" });
              room.sendAnnouncement("POWERSHOT ATIVADO!", game.powershotID, 0x00E2FF, "bold", 1);
              game.powershotTrigger = true;
            }
          }
        }

        if (!game.rsCorner && room.getDiscProperties(0).xgravity !== 0) {
          room.setDiscProperties(0, { xgravity: 0, ygravity: 0 });
          game.rsSwingTimer = 10000;
        }
      }

      if (dist > triggerDist + 3 && player.id === game.powershotID && game.powershotTrigger && powerShotMode) {
        game.powershotTrigger = false;
        game.powershotCounter = 0;
        game.powershotID      = 0;
        if (parseFloat(room.getDiscProperties(0).invMass.toFixed(2)) !== 1.05) {
          room.setDiscProperties(0, { invMass: 1.05, color: "0xffffff", cMask: 63 });
        }
        room.sendAnnouncement("POWERSHOT DESATIVADO!", game.powershotID, 0x00E2FF, "bold", 2);
      }
    }
  }

  function updateGameStatus() {
    game.time       = Math.floor(room.getScores().time);
    game.ballRadius = room.getDiscProperties(0).radius;
  }

  // ── Funções utilitárias ───────────────────────────────────────────────────────
  function announce(msg, targetId, color, style, sound) {
    if (color == null)  color  = 0xFFFD82;
    if (style == null)  style  = "bold";
    if (sound == null)  sound  = 0;
    room.sendAnnouncement(msg, targetId, color, style, sound);
    console.log("Announce: " + msg);
  }

  function whisper(msg, targetId, color, style, sound) {
    if (color == null)  color  = 0x66C7FF;
    if (style == null)  style  = "normal";
    if (sound == null)  sound  = 0;
    room.sendAnnouncement(msg, targetId, color, style, sound);
    const p = room.getPlayer(targetId);
    if (p) console.log("Whisper -> " + p.name + ": " + msg);
  }

  function isAdminPresent() {
    const players = room.getPlayerList();
    return players.some(p => p.admin);
  }

  function displayAdminMessage() {
    if (!isAdminPresent() && allowPublicAdmin)
      announce("Sem admin presente, digite !admin para assumir a sala!");
  }

  function pointDistance(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function sleep(time) { return new Promise(resolve => setTimeout(resolve, time)); }

  function ballWarning(origColour, warningCount) {
    const timings = [200, 400, 600, 800, 1000, 1200, 1400, 1600, 1675, 1750];
    timings.forEach((t, i) => {
      sleep(t).then(() => {
        if (game.warningCount === warningCount)
          room.setDiscProperties(0, { color: i % 2 === 0 ? "0xffffff" : origColour });
      });
    });
  }

  function extraTime() {
    const extraSeconds = Math.ceil(game.extraTimeCount / 60);
    game.extraTimeEnd  = gameTime * 60 + extraSeconds;
    announce("Acréscimos: " + extraSeconds + " segundos", null, null, null, 1);
  }

  function avatarCelebration(playerId, avatar) {
    let originalAvatar = null;
    const player = room.getPlayer(playerId);
    if (player && sistemaPosicoes.jogadoresComPosicao.includes(playerId)) {
      const posicoes = player.team === 1 ? sistemaPosicoes.posicoesRed : sistemaPosicoes.posicoesBlue;
      Object.keys(posicoes).forEach(pos => {
        if (posicoes[pos].playerId === playerId) originalAvatar = posicoes[pos].nome;
      });
    }
    const frames = [0, 250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 3000, 3250];
    frames.forEach((t, i) => {
      sleep(t).then(() => {
        room.setPlayerAvatar(playerId, i < frames.length - 1 ? (i % 2 === 0 ? avatar : null) : originalAvatar);
      });
    });
  }

  function secondsToMinutes(time) {
    const hrs  = ~~(time / 3600);
    const mins = ~~((time % 3600) / 60);
    const secs = ~~time % 60;
    let ret    = "";
    if (hrs > 0) ret += hrs + ":" + (mins < 10 ? "0" : "");
    ret += mins + ":" + (secs < 10 ? "0" : "") + secs;
    return ret;
  }

  // ── Throw In / Goal Kick / Remove Block ───────────────────────────────────────
  function blockThrowIn() {
    const players = room.getPlayerList().filter(p => p.team !== 0);
    const by      = room.getBallPosition().y;

    if (by === 0) return;
    const isTop = by < 0;

    if (game.outStatus === "redThrow" || game.outStatus === "blueThrow") {
      const throwerTeam  = game.outStatus === "redThrow" ? 1 : 2;
      const blockedTeam  = game.outStatus === "redThrow" ? 2 : 1;
      const showRedDisc  = game.outStatus === "redThrow" ? 17 : 19;
      const hideRedDisc  = game.outStatus === "redThrow" ? 19 : 17;
      const showBluDisc  = game.outStatus === "redThrow" ? 21 : 23;
      const hideBluDisc  = game.outStatus === "redThrow" ? 23 : 21;

      players.forEach(player => {
        if (room.getPlayerDiscProperties(player.id).invMass !== 9999999)
          room.setPlayerDiscProperties(player.id, { invMass: 9999999 });
        const pDiscY = room.getPlayerDiscProperties(player.id).y;
        const condDir = isTop ? pDiscY < 0 : pDiscY > 0;
        if (player.team === blockedTeam && condDir) {
          if (room.getPlayerDiscProperties(player.id).cGroup !== 536870918)
            room.setPlayerDiscProperties(player.id, { cGroup: 536870918 });
          const limit = isTop ? -(fieldHeight - 140) : fieldHeight - 140;
          if (isTop && player.position.y < limit) room.setPlayerDiscProperties(player.id, { y: -(fieldHeight - 155) });
          if (!isTop && player.position.y > limit) room.setPlayerDiscProperties(player.id, { y: fieldHeight - 155 });
        }
        if (player.team === throwerTeam && room.getPlayerDiscProperties(player.id).cGroup !== 2)
          room.setPlayerDiscProperties(player.id, { cGroup: 2 });
      });
      const fW1 = fieldWidth - 1;
      if (isTop) {
        if (room.getDiscProperties(showRedDisc).x !== fW1)  room.setDiscProperties(showRedDisc, { x: fW1 });
        if (room.getDiscProperties(hideRedDisc).x !== -fW1) room.setDiscProperties(hideRedDisc, { x: -fW1 });
      } else {
        if (room.getDiscProperties(showBluDisc).x !== fW1)  room.setDiscProperties(showBluDisc, { x: fW1 });
        if (room.getDiscProperties(hideBluDisc).x !== -fW1) room.setDiscProperties(hideBluDisc, { x: -fW1 });
      }
    }
  }

  function blockGoalKick() {
    const players = room.getPlayerList().filter(p => p.team !== 0);
    const bx      = room.getBallPosition().x;

    if (bx < 0 && game.outStatus === "redGK") {
      players.forEach(player => {
        if (player.team === 2 && room.getPlayerDiscProperties(player.id).x < 0) {
          if (room.getPlayerDiscProperties(player.id).cGroup !== 268435462)
            room.setPlayerDiscProperties(player.id, { cGroup: 268435462 });
          if (player.position.x < -penalArea[0] && Math.abs(player.position.y) < penalArea[1])
            room.setPlayerDiscProperties(player.id, { x: -(penalArea[0] - 15) });
        }
        if (player.team === 1 && room.getPlayerDiscProperties(player.id).cGroup !== 2)
          room.setPlayerDiscProperties(player.id, { cGroup: 2 });
      });
    }
    if (bx > 0 && game.outStatus === "blueGK") {
      players.forEach(player => {
        if (player.team === 1 && room.getPlayerDiscProperties(player.id).x > 0) {
          if (room.getPlayerDiscProperties(player.id).cGroup !== 268435462)
            room.setPlayerDiscProperties(player.id, { cGroup: 268435462 });
          if (player.position.x > penalArea[0] && Math.abs(player.position.y) < penalArea[1])
            room.setPlayerDiscProperties(player.id, { x: penalArea[0] - 15 });
        }
        if (player.team === 2 && room.getPlayerDiscProperties(player.id).cGroup !== 2)
          room.setPlayerDiscProperties(player.id, { cGroup: 2 });
      });
    }
  }

  function removeBlock() {
    const players = room.getPlayerList().filter(p => p.team !== 0);
    if (game.outStatus === "") {
      players.forEach(player => {
        if (player.team === 1 && room.getPlayerDiscProperties(player.id).cGroup !== 2)
          room.setPlayerDiscProperties(player.id, { cGroup: 2 });
        if (player.team === 2 && room.getPlayerDiscProperties(player.id).cGroup !== 4)
          room.setPlayerDiscProperties(player.id, { cGroup: 4 });
      });
      const fW1 = -(fieldWidth - 1);
      [17, 19, 21, 23].forEach(idx => {
        if (room.getDiscProperties(idx).x !== fW1) room.setDiscProperties(idx, { x: fW1 });
      });
    }
  }

  // ── Kits ──────────────────────────────────────────────────────────────────────
  function findClosestTeam(name) {
    const input = (name || "").toLowerCase().trim();
    if (!input) return kits.red;  // FIX: kits.default não existe → usa kits.red como fallback

    let bestKey   = "red";
    let bestScore = -1;

    for (const key in kits) {
      const tName = kits[key].name.toLowerCase();
      let score   = 0;
      if (tName === input)        score += 100;
      if (tName.includes(input))  score += 50;
      for (const ch of input) if (tName.includes(ch)) score += 0.5;
      if (score > bestScore) { bestScore = score; bestKey = key; }
    }
    return kits[bestKey];
  }

  function setTeamKits(side, tName) {
    const ourKey   = tName;
    const oppKey   = side === "r" ? blueTeamName.toLowerCase() : redTeamName.toLowerCase();
    const ourKitObj = findClosestTeam(ourKey);
    const oppKitObj = findClosestTeam(oppKey);
    const ourHome   = ourKitObj.home || ourKitObj.away;
    const oppHome   = oppKitObj.home || oppKitObj.away;
    let kitToApply  = ourHome;
    if (oppHome && oppHome.contrast === ourHome.contrast)
      kitToApply = ourKitObj.away || ourHome;
    const teamId = side === "r" ? 1 : 2;
    if (sistemaKitsAtivo) {
      room.setTeamColors(teamId, kitToApply.angle, kitToApply.textColor, kitToApply.colors);
      announce(`${ourKitObj.name} aplicado no time ${side === "r" ? "vermelho" : "azul"} (${kitToApply.contrast})`);
    }
  }

  function applyBothKits() {
    // FIX: applyKitToSide não existia → usa setTeamKits diretamente
    setTeamKits("r", redTeamName.toLowerCase());
    setTeamKits("b", blueTeamName.toLowerCase());
  }

}).catch(err => {
  console.error("[FATAL] Falha ao inicializar haxball.js:", err);
  process.exit(1);
});

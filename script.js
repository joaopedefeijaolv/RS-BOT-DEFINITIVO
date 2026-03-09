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

// ─── CONFIG ───────────────────────────────────────────────────────────────────
var throwTimeOut    = 420;   // 7s em ticks
var gkTimeOut       = 600;   // 10s em ticks
var ckTimeOut       = 600;   // 10s em ticks
var throwinDistance = 270;
var mapBGColor      = "86A578";
var superAdminCode  = "142";
var powerShotMode   = true;
var maxTeamSize     = 5;
var gameTime        = 5;

// ─── SISTEMA DE STATS (localStorage) ─────────────────────────────────────────
// Estrutura salva: { username: { senha, gols, assistencias, gc, vitorias, derrotas } }
var STATS_KEY = "hsbr_stats";

function statsLoad() {
	try { return JSON.parse(localStorage.getItem(STATS_KEY)) || {}; } catch(e) { return {}; }
}
function statsSave(db) {
	try { localStorage.setItem(STATS_KEY, JSON.stringify(db)); } catch(e) {}
}
function statsGet(username) {
	return statsLoad()[username] || null;
}
function statsSet(username, data) {
	var db = statsLoad();
	db[username] = data;
	statsSave(db);
}
function statsNewPlayer(username, senha) {
	return { senha, gols: 0, assistencias: 0, gc: 0, vitorias: 0, derrotas: 0, elo: 0 };
}

// Mapa de sessão: playerId -> username logado
var loggedIn = {}; // { playerId: username }
// Mapa de timers de login obrigatório: playerId -> timeoutId
var loginTimers = {};
// Mapa de nome -> playerId para detectar nomes registrados ao entrar
// (verificado no onPlayerJoin)

function is5v5() {
	var players = room.getPlayerList();
	return players.filter(p => p.team === 1).length === 5 &&
	       players.filter(p => p.team === 2).length === 5;
}

function getLoggedUsername(playerId) {
	return loggedIn[playerId] || null;
}

// Ao entrar na sala, verifica se o nome já está registrado e força login
function statsOnPlayerJoin(player) {
	var db = statsLoad();
	// Verifica se alguma conta tem esse nome (busca por username == player.name)
	if (db[player.name]) {
		whisper("⚠️ O nome '" + player.name + "' está registrado. Digite !login {senha} em 12 segundos ou será kickado.", player.id, 0xFF4444, "bold");
		loginTimers[player.id] = setTimeout(() => {
			if (!loggedIn[player.id]) {
				room.kickPlayer(player.id, "Você não fez login na conta '" + player.name + "'. Use !login {senha}.", false);
			}
		}, 12000);
	}
}

function statsOnPlayerLeave(player) {
	if (loginTimers[player.id]) { clearTimeout(loginTimers[player.id]); delete loginTimers[player.id]; }
	delete loggedIn[player.id];
}

// Registra gol/assist/gc para quem estiver logado — só conta em 5v5
function statsAddGoal(playerId) {
	if (!is5v5()) return;
	var u = getLoggedUsername(playerId);
	if (!u) return;
	var s = statsGet(u); if (!s) return;
	s.gols++; statsSet(u, s);
}
function statsAddAssist(playerId) {
	if (!is5v5()) return;
	var u = getLoggedUsername(playerId);
	if (!u) return;
	var s = statsGet(u); if (!s) return;
	s.assistencias++; statsSet(u, s);
}
function statsAddGC(playerId) {
	if (!is5v5()) return;
	var u = getLoggedUsername(playerId);
	if (!u) return;
	var s = statsGet(u); if (!s) return;
	s.gc++; statsSet(u, s);
}
function statsAddResult(team, winnerTeam) {
	if (!is5v5()) return;
	room.getPlayerList().filter(p => p.team !== 0).forEach(p => {
		var u = getLoggedUsername(p.id);
		if (!u) return;
		var s = statsGet(u); if (!s) return;
		if (p.team === winnerTeam) s.vitorias++; else s.derrotas++;
		statsSet(u, s);
	});
}

// ─── SISTEMA DE ELO / RANK / CARGO ───────────────────────────────────────────
var OWNER_NAME = "jp mantega"; // ← troque pelo seu nome registrado
var CARGO_KEY  = "hsbr_cargos";   // localStorage key para cargos

// Ranks por elo
var RANKS = [
	{ min: 0,   max: 100, emoji: "🟤" },
	{ min: 101, max: 200, emoji: "⚪️" },
	{ min: 201, max: 300, emoji: "🟡" },
	{ min: 301, max: 400, emoji: "🟠" },
	{ min: 401, max: 500, emoji: "🔴" },
	{ min: 501, max: 600, emoji: "⭐️" },
	{ min: 601, max: 800, emoji: "🌎" },
	{ min: 801, max: Infinity, emoji: "🌐" }
];

// Cargos (ordem de prioridade: maior = mais importante)
var CARGO_LIST = ["player", "vip", "mod", "admin", "gerente", "dono"];
var CARGO_EMOJI = { player: "✅️", vip: "💎", mod: "🦺", admin: "👔", gerente: "⚖️", dono: "👑" };
var CARGO_COLOR = { player: 0xFFFFFF, vip: 0x61ddff, mod: 0x90EE90, admin: 0xFF9999, gerente: 0xFF6666, dono: 0xCC2222 };

// ELO: vitória +5, gol +3, assist +2, derrota -3, gc -5, mínimo 0
var ELO_WIN    =  5;
var ELO_LOSS   = -3;
var ELO_GOAL   =  3;
var ELO_ASSIST =  2;
var ELO_GC     = -5;

function eloChange(playerId, delta) {
	if (!is5v5()) return;
	var u = getLoggedUsername(playerId);
	if (!u) return;
	var s = statsGet(u); if (!s) return;
	if (!s.elo) s.elo = 0;
	s.elo = Math.max(0, s.elo + delta);
	statsSet(u, s);
}

function cargosLoad() {
	try { return JSON.parse(localStorage.getItem(CARGO_KEY)) || {}; } catch(e) { return {}; }
}
function cargosSave(db) {
	try { localStorage.setItem(CARGO_KEY, JSON.stringify(db)); } catch(e) {}
}
function getCargo(username) {
	if (!username) return null;
	// Dono hardcoded
	if (username === OWNER_NAME) return "dono";
	var db = cargosLoad();
	return db[username] || (statsGet(username) ? "player" : null);
}
function setCargo(username, cargo) {
	var db = cargosLoad();
	db[username] = cargo;
	cargosSave(db);
}

function getRankEmoji(elo) {
	for (var i = RANKS.length - 1; i >= 0; i--) {
		if (elo >= RANKS[i].min) return RANKS[i].emoji;
	}
	return "🟤";
}

// Retorna o prefixo completo do jogador para o chat
// não-registrado: [🐁]
// registrado:     [✅️][🟤] etc
function getPrefix(playerId) {
	var username = getLoggedUsername(playerId);
	if (!username) return "[🐁]";
	var s = statsGet(username);
	var elo = s ? (s.elo || 0) : 0;
	var rank = getRankEmoji(elo);
	var cargo = getCargo(username);
	var cargoEmoji = cargo && cargo !== "player" ? "[" + CARGO_EMOJI[cargo] + "]" : "[✅️]";
	return cargoEmoji + "[" + rank + "]";
}

function getChatColor(playerId) {
	var username = getLoggedUsername(playerId);
	if (!username) return 0xFFFFFF;
	var cargo = getCargo(username);
	return cargo ? (CARGO_COLOR[cargo] || 0xFFFFFF) : 0xFFFFFF;
}

// Atualiza elo por vitória/derrota no fim da partida
function eloAddResult(winnerTeam) {
	if (!is5v5()) return;
	room.getPlayerList().filter(p => p.team !== 0).forEach(p => {
		var u = getLoggedUsername(p.id);
		if (!u) return;
		var s = statsGet(u); if (!s) return;
		if (!s.elo) s.elo = 0;
		var prevElo = s.elo;
		s.elo = Math.max(0, s.elo + (p.team === winnerTeam ? ELO_WIN : ELO_LOSS));
		statsSet(u, s);
		var diff = s.elo - prevElo;
		var sign = diff >= 0 ? "+" : "";
		sleep(1500).then(() => {
			whisper("📊 Elo: " + prevElo + " → " + s.elo + " (" + sign + diff + ") | Rank: " + getRankEmoji(s.elo), p.id, diff >= 0 ? 0x00FF88 : 0xFF4444, "bold");
		});
	});
}

// ─── MAPA ─────────────────────────────────────────────────────────────────────
function getMap() {
	return `{"name":"Real Soccer Revolution","width":1300,"height":670,"spawnDistance":560,"bg":{"type":"grass","width":1150,"height":600,"kickOffRadius":180,"cornerRadius":0,"color":"` + mapBGColor + `"},"playerPhysics":{"bCoef":0.3,"invMass":0.5,"damping":0.96,"acceleration":0.12,"kickingAcceleration":0.07,"kickingDamping":0.96,"kickStrength":5.65},"ballPhysics":{"radius":9,"bCoef":0.5,"invMass":1.05,"damping":0.99,"color":"FFFFFF","cMask":["all"],"cGroup":["ball"]},"vertexes":[{"x":0,"y":675,"trait":"kickOffBarrier"},{"x":0,"y":180,"trait":"kickOffBarrier"},{"x":0,"y":-180,"trait":"kickOffBarrier"},{"x":0,"y":-675,"trait":"kickOffBarrier"},{"x":1150,"y":320,"trait":"line"},{"x":840,"y":320,"trait":"line"},{"x":1150,"y":-320,"trait":"line"},{"x":840,"y":-320,"trait":"line"},{"x":1150,"y":180,"trait":"line"},{"x":1030,"y":180,"trait":"line"},{"x":1150,"y":-180,"trait":"line"},{"x":1030,"y":-180,"trait":"line"},{"x":840,"y":-130,"trait":"line","curve":-130},{"x":840,"y":130,"trait":"line","curve":-130},{"x":-1150,"y":-320,"trait":"line"},{"x":-840,"y":-320,"trait":"line"},{"x":-1150,"y":320,"trait":"line"},{"x":-840,"y":320,"trait":"line"},{"x":-1150,"y":-175,"trait":"line"},{"x":-1030,"y":-175,"trait":"line"},{"x":-1150,"y":175,"trait":"line"},{"x":-1030,"y":175,"trait":"line"},{"x":-840,"y":130,"trait":"line","curve":-130},{"x":-840,"y":-130,"trait":"line","curve":-130},{"x":935,"y":3,"trait":"line"},{"x":935,"y":-3,"trait":"line"},{"x":-935,"y":3,"trait":"line"},{"x":-935,"y":-3,"trait":"line"},{"x":-1150,"y":570,"bCoef":-2.9,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":-1120,"y":600,"bCoef":-2.9,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":-1120,"y":-600,"bCoef":-2.9,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":-1150,"y":-570,"bCoef":-2.9,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":1120,"y":600,"bCoef":-2.9,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":1150,"y":570,"bCoef":-2.9,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":1150,"y":-570,"bCoef":-2.9,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":1120,"y":-600,"bCoef":-2.9,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"x":0,"y":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"],"trait":"kickOffBarrier","curve":-180},{"x":0,"y":-180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"],"trait":"kickOffBarrier","curve":180},{"x":0,"y":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"],"trait":"kickOffBarrier","curve":180},{"x":-1030,"y":-40,"bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","curve":70,"color":"576C46","vis":false},{"x":-1030,"y":40,"bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","curve":70,"color":"576C46","vis":false},{"x":1030,"y":-40,"bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","curve":-70,"color":"576C46","vis":false},{"x":1030,"y":40,"bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","curve":-70,"color":"576C46","vis":false},{"x":1030,"y":-40,"trait":"line","color":"576C46"},{"x":1030,"y":40,"trait":"line","color":"576C46"},{"x":-1030,"y":-40,"trait":"line","color":"576C46"},{"x":-1030,"y":40,"trait":"line","color":"576C46"},{"x":0,"y":3,"trait":"line"},{"x":0,"y":-3,"trait":"line"},{"x":-1300,"y":-460,"bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"color":"ec644b","vis":false},{"x":1300,"y":-460,"bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"color":"ec644b","vis":false},{"x":-1300,"y":460,"bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"color":"ec644b","vis":false},{"x":1300,"y":460,"bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"color":"ec644b","vis":false},{"x":-1295,"y":-320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":-840,"y":-320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":-840,"y":320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":-1295,"y":320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":1295,"y":-320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":840,"y":-320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":840,"y":320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":1295,"y":320,"cMask":["c0"],"cGroup":["red","blue"]},{"x":-1150,"y":-124,"bCoef":0.1,"cMask":["ball","red","blue"]},{"x":-1210,"y":-124,"bCoef":0.1,"cMask":["red","blue"],"bias":0,"curve":5},{"x":-1150,"y":124,"bCoef":0.1,"cMask":["ball","red","blue"]},{"x":-1210,"y":124,"bCoef":0.1,"cMask":["red","blue"],"bias":0,"curve":5},{"x":-1250,"y":-158,"bCoef":0,"cMask":["ball"]},{"x":-1250,"y":158,"bCoef":0,"cMask":["ball"]},{"x":1150,"y":124,"bCoef":0.1,"cMask":["ball","red","blue"]},{"x":1210,"y":124,"bCoef":0.1,"cMask":["red","blue"],"curve":-5},{"x":1150,"y":-124,"bCoef":0.1,"cMask":["ball","red","blue"]},{"x":1210,"y":-124,"bCoef":0.1,"cMask":["red","blue"],"curve":-5},{"x":1250,"y":-158,"bCoef":0,"cMask":["ball"]},{"x":1250,"y":158,"bCoef":0,"cMask":["ball"]}],"segments":[{"v0":0,"v1":1,"trait":"kickOffBarrier"},{"v0":2,"v1":3,"trait":"kickOffBarrier"},{"v0":4,"v1":5,"trait":"line","y":320},{"v0":5,"v1":7,"trait":"line","x":840},{"v0":6,"v1":7,"trait":"line","y":-320},{"v0":8,"v1":9,"trait":"line","y":180},{"v0":9,"v1":11,"trait":"line","x":1030},{"v0":10,"v1":11,"trait":"line","y":-180},{"v0":12,"v1":13,"curve":-130,"trait":"line","x":840},{"v0":14,"v1":15,"trait":"line","y":-320},{"v0":15,"v1":17,"trait":"line","x":-840},{"v0":16,"v1":17,"trait":"line","y":320},{"v0":18,"v1":19,"trait":"line","y":-175},{"v0":19,"v1":21,"trait":"line","x":-1030},{"v0":20,"v1":21,"trait":"line","y":175},{"v0":22,"v1":23,"curve":-130,"trait":"line","x":-840},{"v0":24,"v1":25,"curve":-180,"trait":"line","x":935},{"v0":26,"v1":27,"curve":-180,"trait":"line","x":-935},{"v0":24,"v1":25,"curve":180,"trait":"line","x":935},{"v0":26,"v1":27,"curve":180,"trait":"line","x":-935},{"v0":24,"v1":25,"curve":90,"trait":"line","x":935},{"v0":26,"v1":27,"curve":90,"trait":"line","x":-935},{"v0":24,"v1":25,"curve":-90,"trait":"line","x":935},{"v0":26,"v1":27,"curve":-90,"trait":"line","x":-935},{"v0":24,"v1":25,"trait":"line","x":935},{"v0":26,"v1":27,"trait":"line","x":-935},{"v0":28,"v1":29,"curve":90,"bCoef":-2.9,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"v0":30,"v1":31,"curve":90,"bCoef":-2.9,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"v0":32,"v1":33,"curve":90,"bCoef":-2.9,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"v0":34,"v1":35,"curve":90,"bCoef":-2.9,"cMask":["ball"],"cGroup":["c0"],"trait":"line"},{"v0":37,"v1":36,"curve":-180,"vis":false,"bCoef":0.1,"cGroup":["blueKO"],"trait":"kickOffBarrier"},{"v0":39,"v1":40,"curve":70,"vis":false,"color":"576C46","bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","x":-1030},{"v0":41,"v1":42,"curve":-70,"vis":false,"color":"576C46","bCoef":-5.7,"cMask":["ball"],"cGroup":["c0"],"trait":"line","x":1030},{"v0":37,"v1":38,"curve":180,"vis":false,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"],"trait":"kickOffBarrier"},{"v0":43,"v1":44,"vis":true,"color":"576C46","trait":"line","x":1030},{"v0":45,"v1":46,"vis":true,"color":"576C46","trait":"line","x":-1030},{"v0":47,"v1":48,"curve":-180,"trait":"line","x":-935},{"v0":47,"v1":48,"curve":180,"trait":"line","x":-935},{"v0":47,"v1":48,"curve":90,"trait":"line","x":-935},{"v0":47,"v1":48,"curve":-90,"trait":"line","x":-935},{"v0":47,"v1":48,"trait":"line","x":-935},{"v0":49,"v1":50,"vis":false,"color":"ec644b","bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"y":-460},{"v0":51,"v1":52,"vis":false,"color":"ec644b","bCoef":0,"cMask":["c1"],"cGroup":["red","blue"],"y":460},{"v0":53,"v1":54,"vis":false,"color":"ec644b","cMask":["c0"],"cGroup":["red","blue"]},{"v0":54,"v1":55,"vis":false,"color":"ec644b","cMask":["c0"],"cGroup":["red","blue"]},{"v0":55,"v1":56,"vis":false,"color":"ec644b","cMask":["c0"],"cGroup":["red","blue"]},{"v0":57,"v1":58,"vis":false,"cMask":["c0"],"cGroup":["red","blue"]},{"v0":58,"v1":59,"vis":false,"cMask":["c0"],"cGroup":["red","blue"]},{"v0":59,"v1":60,"vis":false,"cMask":["c0"],"cGroup":["red","blue"]},{"v0":61,"v1":62,"color":"FFFFFF","bCoef":0.1,"cMask":["ball","red","blue"],"y":-124},{"v0":63,"v1":64,"color":"FFFFFF","bCoef":0.1,"cMask":["ball","red","blue"],"y":124},{"v0":64,"v1":62,"curve":5,"color":"FFFFFF","bCoef":0.1,"cMask":["ball","red","blue"],"bias":0},{"v0":62,"v1":65,"color":"FFFFFF","bCoef":0,"cMask":["ball"]},{"v0":64,"v1":66,"color":"FFFFFF","bCoef":0,"cMask":["ball"]},{"v0":67,"v1":68,"color":"FFFFFF","bCoef":0.1,"cMask":["ball","red","blue"],"y":124},{"v0":69,"v1":70,"color":"FFFFFF","bCoef":0.1,"cMask":["ball","red","blue"],"y":-124},{"v0":68,"v1":70,"curve":-5,"color":"FFFFFF","bCoef":0.1,"cMask":["ball","red","blue"]},{"v0":70,"v1":71,"color":"FFFFFF","bCoef":0,"cMask":["ball"]},{"v0":68,"v1":72,"color":"FFFFFF","bCoef":0,"cMask":["ball"]}],"goals":[{"p0":[-1161.45,124],"p1":[-1161.45,-124],"team":"red"},{"p0":[1161.45,124],"p1":[1161.45,-124],"team":"blue","radius":0,"invMass":1}],"discs":[{"radius":0,"invMass":0,"pos":[-1311,-19],"color":"ffffffff","bCoef":0,"cMask":["red"],"cGroup":["ball"]},{"radius":0,"invMass":0,"pos":[-1310,29],"color":"ffffffff","bCoef":0,"cMask":["blue"],"cGroup":["ball"]},{"radius":0,"invMass":0,"pos":[-1308,62],"color":"ffffffff","bCoef":0,"cMask":["red","blue"],"cGroup":["ball"]},{"radius":2.7,"pos":[-1150,600],"cGroup":["ball"],"trait":"cornerflag"},{"radius":2.7,"pos":[1150,-600],"cGroup":["ball"],"trait":"cornerflag"},{"radius":2.7,"pos":[1150,600],"cGroup":["ball"],"trait":"cornerflag","_data":{"mirror":{}}},{"radius":5,"invMass":0,"pos":[-1150,-124],"bCoef":0.5,"trait":"goalPost"},{"radius":5,"invMass":0,"pos":[-1150,124],"bCoef":0.5,"trait":"goalPost"},{"radius":2,"invMass":0,"pos":[-1250,-158],"color":"000000","bCoef":1,"trait":"goalPost"},{"radius":2,"invMass":0,"pos":[-1250,158],"color":"000000","bCoef":1,"trait":"goalPost"},{"radius":5,"invMass":0,"pos":[1150,-124],"bCoef":0.5,"trait":"goalPost"},{"radius":5,"invMass":0,"pos":[1150,124],"bCoef":0.5,"trait":"goalPost"},{"radius":2,"invMass":0,"pos":[1250,-158],"color":"000000","bCoef":1,"trait":"goalPost"},{"radius":2,"invMass":0,"pos":[1250,158],"color":"000000","bCoef":1,"trait":"goalPost"},{"radius":2.7,"pos":[-1150,-600],"cGroup":["ball"],"trait":"cornerflag"},{"radius":0,"pos":[-1149,-460],"cMask":["none"]},{"radius":0,"pos":[1149,-460],"cMask":["none"]},{"radius":0,"pos":[-1149,-460],"cMask":["none"]},{"radius":0,"pos":[1149,-460],"cMask":["none"]},{"radius":0,"pos":[-1149,460],"cMask":["none"]},{"radius":0,"pos":[1149,460],"cMask":["none"]},{"radius":0,"pos":[-1149,460],"cMask":["none"]},{"radius":0,"pos":[1149,460],"cMask":["none"]}],"planes":[{"normal":[0,1],"dist":-627,"bCoef":0,"cGroup":["ball"],"trait":"ballArea"},{"normal":[0,-1],"dist":-627,"bCoef":0,"cGroup":["ball"],"trait":"ballArea"},{"normal":[0,1],"dist":-670,"bCoef":0},{"normal":[0,-1],"dist":-670,"bCoef":0},{"normal":[1,0],"dist":-1300,"bCoef":0},{"normal":[-1,0],"dist":-1300,"bCoef":0.1},{"normal":[1,0],"dist":-1230,"bCoef":0,"cMask":["ball"],"cGroup":["ball"]},{"normal":[-1,0],"dist":-1230,"bCoef":0,"cMask":["ball"],"cGroup":["ball"]}],"traits":{"ballArea":{"vis":false,"bCoef":0,"cMask":["ball"],"cGroup":["ball"]},"goalPost":{"radius":5,"invMass":0,"bCoef":1,"cGroup":["ball"]},"cornerflag":{"radius":3,"invMass":0,"bCoef":0.2,"color":"FFFF00","cMask":["ball"]},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]},"line":{"vis":true,"cMask":[],"color":"C7E6BD"}},"joints":[{"d0":16,"d1":17,"strength":"rigid","color":"ec7458"},{"d0":18,"d1":19,"strength":"rigid","color":"48bef9"},{"d0":20,"d1":21,"strength":"rigid","color":"ec7458"},{"d0":22,"d1":23,"strength":"rigid","color":"48bef9"}],"redSpawnPoints":[],"blueSpawnPoints":[],"canBeStored":false}`;
}

// ─── SALA ─────────────────────────────────────────────────────────────────────
var room = HBInit({
	roomName: "🌐 HSBR | X5 | Real Soccer 🌐",
	geo: { code: "br", lat: -30.0346, lon: -51.2177 },
	maxPlayers: 28,
	public: true,
	noPlayer: true,
	token: "thr1.AAAAAGmu-pzhzKpOCx6ZCw.katAerQIvhw"
});

room.setCustomStadium(getMap());
room.setScoreLimit(3);
room.setTimeLimit(5);
room.setTeamsLock(true);

// ─── ESTADO DO JOGO ───────────────────────────────────────────────────────────
var game;
var superAdmins = [];
var map = "RSR";

class Game {
	constructor() {
		this.time = 0;
		this.paused = false;
		this.ballRadius = 9;
		this.rsTouchTeam = 0;
		this.rsActive = true;
		this.rsReady = false;
		this.rsCorner = false;
		this.rsGoalKick = false;
		this.rsSwingTimer = 1000;
		this.rsTimer = 0;
		this.outStatus = "";
		this.throwInPosY = 0;
		this.ballOutPositionX = 0;
		this.warningCount = 0;
		this.bringThrowBack = false;
		this.extraTime = false;
		this.extraTimeCount = 0;
		this.extraTimeEnd = 0;
		this.extraTimeAnnounced = false;
		this.lastPlayAnnounced = false;
		this.boosterState = false;
		this.boosterCount = 0;
		this.lastKickerId = null;
		this.lastKickerName = null;
		this.lastKickerTeam = null;
		this.secondLastKickerId = null;
		this.secondLastKickerName = null;
		this.secondLastKickerTeam = null;
		this.redScore = 0;
		this.blueScore = 0;
		this.powershotCounter = 0;
		this.powershotID = 0;
		this.powershotTrigger = false;
	}

	updateLastKicker(id, name, team) {
		this.secondLastKickerId   = this.lastKickerId;
		this.secondLastKickerName = this.lastKickerName;
		this.secondLastKickerTeam = this.lastKickerTeam;
		this.lastKickerId   = id;
		this.lastKickerName = name;
		this.lastKickerTeam = team;
	}
}

// ─── UTILIDADES ───────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function pointDistance(p1, p2) {
	var dx = p1.x - p2.x, dy = p1.y - p2.y;
	return Math.sqrt(dx * dx + dy * dy);
}

function announce(msg, targetId, color, style, sound) {
	room.sendAnnouncement(msg, targetId ?? null, color ?? 0xFFFD82, style ?? "bold", sound ?? 0);
}

function whisper(msg, targetId, color, style, sound) {
	room.sendAnnouncement(msg, targetId, color ?? 0x66C7FF, style ?? "normal", sound ?? 0);
}

function secondsToMinutes(t) {
	var m = ~~(t / 60), s = ~~(t % 60);
	return m + ":" + (s < 10 ? "0" : "") + s;
}

function avatarCelebration(id, av) {
	[0, 250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250].forEach((ms, i) => {
		sleep(ms).then(() => room.setPlayerAvatar(id, i % 2 === 0 ? av : null));
	});
}

function ballWarning(color, wc) {
	[200,400,600,800,1000,1200,1400,1600,1675,1750].forEach((ms, i) => {
		sleep(ms).then(() => {
			if (game.warningCount === wc)
				room.setDiscProperties(0, { color: i % 2 === 0 ? "0xffffff" : color });
		});
	});
}

// ─── TIME / BALANCEAMENTO ─────────────────────────────────────────────────────
function balanceTeams() {
	var players = room.getPlayerList();
	var red  = players.filter(p => p.team === 1).length;
	var blue = players.filter(p => p.team === 2).length;
	players.filter(p => p.team === 0).forEach(p => {
		if (red <= blue && red < maxTeamSize)  { room.setPlayerTeam(p.id, 1); red++;  }
		else if (blue < maxTeamSize)           { room.setPlayerTeam(p.id, 2); blue++; }
	});
}

function checkStart() {
	if (room.getPlayerList().some(p => p.team !== 0) && room.getScores() == null)
		room.startGame();
}

function quickRestart() {
	room.stopGame();
	setTimeout(() => room.startGame(), 2000);
}

// ─── EVENTOS DA SALA ──────────────────────────────────────────────────────────
room.onRoomLink = url => console.log("Link:", url);

room.onStadiumChange = (name, byPlayer) => { map = byPlayer ? "custom" : "RSR"; };

room.onPlayerJoin = function(player) {
	console.log(player.name + " entrou");
	whisper("🌐 Bem-Vindo a HSBR 🌐", player.id, 0x61ddff, "bold");
	whisper("Use !registrar {senha} para criar conta ou !login {senha} se já tem. Stats só contam em 5v5!", player.id, 0xaaaaaa, "small");
	statsOnPlayerJoin(player);
	balanceTeams();
	checkStart();
};

room.onPlayerLeave = function(player) {
	console.log(player.name + " saiu");
	let idx = superAdmins.indexOf(player.id);
	if (idx > -1) sleep(100).then(() => superAdmins.splice(idx, 1));
	statsOnPlayerLeave(player);
	if (!room.getPlayerList().some(p => p.team !== 0) && room.getScores() != null)
		room.stopGame();
	balanceTeams();
	checkStart();
};

room.onPlayerAdminChange = function(changedPlayer, byPlayer) {
	if (!byPlayer) return;
	if (byPlayer.id !== changedPlayer.id && superAdmins.includes(changedPlayer.id)) {
		room.kickPlayer(byPlayer.id, "Você não pode remover um Super Admin.", false);
		room.setPlayerAdmin(changedPlayer.id, true);
	} else if (!changedPlayer.admin) {
		let idx = superAdmins.indexOf(changedPlayer.id);
		if (idx > -1) superAdmins.splice(idx, 1);
	}
};

room.onPlayerKicked = function(kicked, reason, ban, byPlayer) {
	if (superAdmins.includes(kicked.id) && byPlayer) {
		room.kickPlayer(byPlayer.id, "Não pode kickar/banir um Super Admin.", false);
		room.clearBans();
	}
};

room.onGameStart = function(byPlayer) {
	if (map !== "RSR") return;
	room.setDiscProperties(0, { invMass: 1.05 });
	if (!byPlayer) {
		game = new Game();
		announce("Jogo modificado para " + gameTime + " minutos");
	} else {
		gameTime = room.getScores()?.timeLimit ? room.getScores().timeLimit / 60 : 5;
		room.stopGame();
		room.setTimeLimit(0);
		room.startGame();
	}
};

room.onGameStop = function(byPlayer) {
	if (map === "RSR" && byPlayer) room.setTimeLimit(gameTime);
};

room.onTeamVictory = function(scores) {
	var winner = scores.red > scores.blue ? 1 : 2;
	var loser  = winner === 1 ? 2 : 1;
	statsAddResult(null, winner);
	eloAddResult(winner);
	room.getPlayerList().forEach(p => { if (p.team === loser) room.setPlayerTeam(p.id, 0); });
	setTimeout(() => { balanceTeams(); quickRestart(); }, 500);
};

room.onTeamGoal = function(team) {
	if (map !== "RSR") return;
	game.rsActive = false;
	var goalTime = secondsToMinutes(Math.floor(room.getScores().time));
	var scorer, assister = "", goalType;
	var lk  = { id: game.lastKickerId,       name: game.lastKickerName,       team: game.lastKickerTeam };
	var slk = { id: game.secondLastKickerId,  name: game.secondLastKickerName, team: game.secondLastKickerTeam };

	if (lk.team === team) {
		goalType = "GOL!";
		scorer = "⚽" + lk.name;
		avatarCelebration(lk.id, "⚽");
		statsAddGoal(lk.id);
		eloChange(lk.id, ELO_GOAL);
		if (slk.team === team && slk.id !== lk.id) {
			assister = " (Assistencia: " + slk.name + ")";
			avatarCelebration(slk.id, "🅰️");
			statsAddAssist(slk.id);
			eloChange(slk.id, ELO_ASSIST);
		}
	} else {
		goalType = "GOL CONTRA!";
		scorer = "🐸" + lk.name;
		avatarCelebration(lk.id, "🐸");
		statsAddGC(lk.id);
		eloChange(lk.id, ELO_GC);
		if (slk.team === team) {
			assister = " (Assistencia: " + slk.name + ")";
			avatarCelebration(slk.id, "🅰️");
			statsAddAssist(slk.id);
			eloChange(slk.id, ELO_ASSIST);
		}
	}

	if (team === 1) game.redScore++; else game.blueScore++;
	announce(goalType + " 🟥 " + game.redScore + " - " + game.blueScore + " 🟦 🕒" + goalTime + " " + scorer + assister);
	game.lastKickerTeam = undefined;
	game.secondLastKickerTeam = undefined;
};

room.onPositionsReset = function() {
	if (map !== "RSR") return;
	// Só pausa se o lastPlay foi anunciado E o jogo ainda está ativo (não foi gol)
	if (game.lastPlayAnnounced && room.getScores() != null) {
		var scores = room.getScores();
		// Não pausa se foi um gol que resetou as posições
		if (scores.red === game.redScore && scores.blue === game.blueScore) {
			room.pauseGame(true);
			game.lastPlayAnnounced = false;
			announce("Fim");
		} else {
			game.lastPlayAnnounced = false;
		}
	}
};

// ─── CHAT ─────────────────────────────────────────────────────────────────────
room.onPlayerChat = function(player, message) {
	console.log(player.name + ": " + message);

	// Team chat: t [msg]
	if (message.startsWith("t ")) {
		var teamMsg = message.substring(2).trim();
		var prefix = getPrefix(player.id);
		var color  = getChatColor(player.id);
		var label  = ["[Spec]", "[🟥]", "[🟦]"][player.team];
		room.getPlayerList()
			.filter(p => p.team === player.team)
			.forEach(p => room.sendAnnouncement(label + " " + prefix + " " + player.name + ": " + teamMsg, p.id, color, "normal", 1));
		return false;
	}

	// PM: @@nome mensagem
	if (message.startsWith("@@")) {
		var parts = message.substring(2).trim().match(/^(\S+)\s(.*)/);
		if (parts) {
			var targetName = parts[1].replace(/_/g, ' ');
			var pmMsg = parts[2];
			var target = room.getPlayerList().find(p => p.name === targetName || p.name === parts[1]);
			if (target) {
				whisper("[PM > " + target.name + "] " + player.name + ": " + pmMsg, player.id, 0xff20ff, "normal", 1);
				whisper("[DM] " + player.name + ": " + pmMsg, target.id, 0xff20ff, "normal", 1);
			} else {
				whisper("Usuário '" + targetName + "' não encontrado.", player.id, 0xff20ff);
			}
		}
		return false;
	}

	// Mensagens normais — mostra prefixo + cargo
	if (!message.startsWith("!")) {
		var prefix = getPrefix(player.id);
		var color  = getChatColor(player.id);
		room.sendAnnouncement(prefix + " " + player.name + ": " + message, null, color, "normal", 0);
		return false;
	}

	var args = message.substring(1).split(" ");
	var cmd  = args[0];

	if (cmd === "admin" && args.length === 2 && args[1] === superAdminCode) {
		room.setPlayerAdmin(player.id, true);
		if (!superAdmins.includes(player.id)) superAdmins.push(player.id);
		announce(player.name + " ganhou Super Admin");
	}
	else if (cmd === "clearbans" && player.admin) {
		room.clearBans();
		announce("Bans limpos por " + player.name);
	}
	else if (cmd === "swap" && player.admin) {
		room.getPlayerList().filter(p => p.id !== 0).forEach(p => {
			if (p.team === 1) room.setPlayerTeam(p.id, 2);
			else if (p.team === 2) room.setPlayerTeam(p.id, 1);
		});
		announce("🔄 Times foram trocados");
	}
	else if (cmd === "setpassword" && player.admin) {
		if (superAdmins.includes(player.id)) { room.setPassword(args[1]); announce("Senha modificada por: " + player.name); }
		else whisper("Apenas Super Admins podem mudar a senha.", player.id);
	}
	else if (cmd === "clearpassword" && player.admin) {
		if (superAdmins.includes(player.id)) { room.setPassword(null); announce("Senha limpa por: " + player.name); }
		else whisper("Apenas Super Admins podem limpar a senha.", player.id);
	}
	else if (cmd === "rr" && player.admin) {
		room.stopGame(); room.startGame();
	}
	else if (cmd === "bb") {
		room.kickPlayer(player.id, "Entre no nosso discord: https://discord.gg/vdjDcUfPNZ", false);
	}
	else if ((cmd === "powershot" || cmd === "ps") && player.admin) {
		powerShotMode = !powerShotMode;
		announce("POWERSHOT MODE " + (powerShotMode ? "ATIVADO" : "DESATIVADO") + " POR " + player.name, null, powerShotMode ? 0x00FF00 : 0xFF0000);
	}
	else if (cmd === "super") {
		var names = superAdmins.map(id => room.getPlayer(id)?.name).filter(Boolean).join(", ");
		whisper(names ? "Super Admins: " + names : "Sem super admins presentes", player.id);
	}
	else if (cmd === "help") {
		whisper("Comandos: !rr !bb !swap !setpassword !clearpassword !super !clearbans !ps !registrar !login !stats !cargo | t [msg] | @@nome msg", player.id, null, "small");
	}
	else if (cmd === "registrar") {
		if (!args[1]) { whisper("Uso: !registrar {senha}", player.id, 0xFF8800); return false; }
		var db = statsLoad();
		if (db[player.name]) { whisper("Nome '" + player.name + "' já está registrado. Faça !login {senha}.", player.id, 0xFF4444); return false; }
		statsSet(player.name, statsNewPlayer(player.name, args[1]));
		loggedIn[player.id] = player.name;
		if (loginTimers[player.id]) { clearTimeout(loginTimers[player.id]); delete loginTimers[player.id]; }
		whisper("✅ Conta criada! Bem-vindo, " + player.name + "! Stats e elo contam apenas em partidas 5v5.", player.id, 0x00FF88, "bold");
	}
	else if (cmd === "login") {
		if (!args[1]) { whisper("Uso: !login {senha}", player.id, 0xFF8800); return false; }
		var s = statsGet(player.name);
		if (!s) { whisper("Nenhuma conta com o nome '" + player.name + "'. Use !registrar {senha}.", player.id, 0xFF4444); return false; }
		if (s.senha !== args[1]) { whisper("❌ Senha incorreta.", player.id, 0xFF4444); return false; }
		loggedIn[player.id] = player.name;
		if (loginTimers[player.id]) { clearTimeout(loginTimers[player.id]); delete loginTimers[player.id]; }
		var cargo = getCargo(player.name);
		var elo   = s.elo || 0;
		whisper("✅ Login feito! Cargo: " + CARGO_EMOJI[cargo] + " | Rank: " + getRankEmoji(elo) + " (" + elo + " elo)", player.id, 0x00FF88, "bold");
		// Auto-admin para o dono
		if (player.name === OWNER_NAME) {
			room.setPlayerAdmin(player.id, true);
			if (!superAdmins.includes(player.id)) superAdmins.push(player.id);
			whisper("👑 Admin ativado automaticamente.", player.id, 0xFFD700, "bold");
		}
	}
	else if (cmd === "stats") {
		// Bloqueia não-registrados
		if (!getLoggedUsername(player.id)) { whisper("❌ Você precisa estar logado para ver stats.", player.id, 0xFF4444); return false; }
		var targetName = args[1] ? args.slice(1).join(" ") : getLoggedUsername(player.id);
		var s = statsGet(targetName);
		if (!s) { whisper("Conta '" + targetName + "' não encontrada.", player.id, 0xFF8800); return false; }
		var elo   = s.elo || 0;
		var ratio = s.derrotas === 0 ? (s.vitorias > 0 ? "∞" : "-") : (s.vitorias / s.derrotas).toFixed(2);
		var cargo = getCargo(targetName);
		whisper("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", player.id, 0xFFD700, "bold");
		whisper("📊 " + targetName + "  " + CARGO_EMOJI[cargo] + "  " + getRankEmoji(elo) + " (" + elo + " elo)", player.id, 0xFFD700, "bold");
		whisper("⚽ Gols: " + s.gols + "  🅰️ Assists: " + s.assistencias + "  🐸 GC: " + s.gc, player.id, 0xFFFFFF);
		whisper("🏆 Vitórias: " + s.vitorias + "  💀 Derrotas: " + s.derrotas + "  📈 V/D: " + ratio, player.id, 0xFFFFFF);
		whisper("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", player.id, 0xFFD700, "bold");
	}
	else if (cmd === "cargo") {
		// Apenas o dono pode usar
		var senderUsername = getLoggedUsername(player.id);
		if (senderUsername !== OWNER_NAME) { whisper("❌ Apenas o dono pode usar !cargo.", player.id, 0xFF4444); return false; }
		if (args.length < 3) { whisper("Uso: !cargo {nome} {cargo}  | cargos: vip, mod, admin, gerente, dono", player.id, 0xFF8800); return false; }
		var targetUser = args[1];
		var novoCargo  = args[2].toLowerCase();
		if (!CARGO_LIST.includes(novoCargo)) { whisper("Cargo inválido. Use: vip, mod, admin, gerente, dono, player", player.id, 0xFF8800); return false; }
		if (!statsGet(targetUser)) { whisper("Conta '" + targetUser + "' não encontrada.", player.id, 0xFF4444); return false; }
		setCargo(targetUser, novoCargo);
		announce("👑 " + targetUser + " recebeu o cargo " + CARGO_EMOJI[novoCargo] + " " + novoCargo + " por " + senderUsername, null, 0xFFD700);
		// Avisa o jogador se estiver online
		var onlineTarget = room.getPlayerList().find(p => getLoggedUsername(p.id) === targetUser);
		if (onlineTarget) whisper("Você recebeu o cargo " + CARGO_EMOJI[novoCargo] + " " + novoCargo + "!", onlineTarget.id, 0xFFD700, "bold");
	}
	else if (cmd === "rank") {
		// Mostra tabela de ranks
		if (!getLoggedUsername(player.id)) { whisper("❌ Faça login para ver seu rank.", player.id, 0xFF4444); return false; }
		whisper("━━━ TABELA DE RANKS ━━━", player.id, 0xFFD700, "bold");
		RANKS.forEach(r => {
			var max = r.max === Infinity ? "+" + r.min : r.min + " - " + r.max;
			whisper(r.emoji + "  " + max + " elo", player.id, 0xFFFFFF, "small");
		});
	}
	return false;
};

// ─── GAME TICK ────────────────────────────────────────────────────────────────
room.onGameTick = function() {
	if (map !== "RSR") return;
	game.time = Math.floor(room.getScores().time);
	game.ballRadius = room.getDiscProperties(0).radius;
	handleBallTouch();
	realSoccerRef();
};

// ─── POWERSHOT + TOQUE NA BOLA ────────────────────────────────────────────────
function handleBallTouch() {
	var ballPos = room.getBallPosition();
	var triggerDist = game.ballRadius + 15 + 0.01;

	room.getPlayerList().forEach(player => {
		if (!player.position) return;
		var dist = pointDistance(player.position, ballPos);

		if (dist < triggerDist) {
			game.rsTouchTeam = player.team;
			game.throwinKicked = false;

			// Powershot
			if (powerShotMode && !game.rsCorner && !game.rsGoalKick && game.outStatus !== "blueThrow" && game.outStatus !== "redThrow") {
				if (game.powershotID !== player.id) {
					game.powershotID = player.id;
					game.powershotTrigger = false;
					game.powershotCounter = 0;
				} else {
					game.powershotCounter++;
					if (game.powershotCounter > 100 && !game.powershotTrigger && Math.round(room.getDiscProperties(0).invMass) !== 2) {
						room.setDiscProperties(0, { invMass: 2 });
						room.sendAnnouncement("POWERSHOT ATIVADO!", game.powershotID, 0x33dd33, "bold", 1);
						game.powershotTrigger = true;
					}
				}
			}

			if (!game.rsCorner && room.getDiscProperties(0).xgravity !== 0) {
				room.setDiscProperties(0, { xgravity: 0, ygravity: 0 });
				game.rsSwingTimer = 10000;
			}
		}

		// Cancela powershot se jogador se afastou
		if (powerShotMode && dist > triggerDist + 3 && player.id === game.powershotID && game.powershotTrigger) {
			game.powershotTrigger = false;
			game.powershotCounter = 0;
			game.powershotID = 0;
			if (parseFloat(room.getDiscProperties(0).invMass.toFixed(2)) !== 1.05) {
				room.setDiscProperties(0, { invMass: 1.05 });
				room.sendAnnouncement("POWERSHOT CANCELADO!", player.id, 0xdd3333, "bold", 2);
			}
		}
	});
}

// ─── ARBITRAGEM REAL SOCCER ───────────────────────────────────────────────────
room.onPlayerBallKick = function(player) {
	if (map !== "RSR") return;
	game.rsTouchTeam = player.team;
	game.updateLastKicker(player.id, player.name, player.team);

	if (powerShotMode) {
		if (game.powershotCounter > 100) {
			room.setDiscProperties(0, { xgravity: -room.getPlayerDiscProperties(player.id).yspeed / 30, ygravity: -room.getPlayerDiscProperties(player.id).yspeed / 30 });
			game.rsSwingTimer = 50;
			room.sendAnnouncement("CHUTÃO!", player.id, 0x33dddd, "bold", 1);
		}
		game.powershotCounter = 0; game.powershotID = 0; game.powershotTrigger = false;
		if (parseFloat(room.getDiscProperties(0).invMass.toFixed(2)) !== 1.05)
			room.setDiscProperties(0, { invMass: 1.05 });
	}

	if (game.rsReady) {
		room.getPlayerList().filter(p => p.team !== 0).forEach(p => {
			if (room.getPlayerDiscProperties(p.id).invMass.toFixed(1) !== "0.3")
				room.setPlayerDiscProperties(p.id, { invMass: 0.3 });
		});
	}

	// Ativa jogo após escanteio/tiro de meta
	if (!game.rsActive && game.rsReady && (game.rsCorner || game.rsGoalKick)) {
		game.boosterState = true;
		game.rsActive = true; game.rsReady = false;
		room.setDiscProperties(1, { x: 2000, y: 2000 });
		room.setDiscProperties(2, { x: 2000, y: 2000 });
		room.setDiscProperties(0, { color: "0xffffff" });
		game.rsTimer = 1000000; game.warningCount++;
		if (game.rsCorner)   room.setDiscProperties(0, { xgravity: room.getPlayerDiscProperties(player.id).xspeed / 16 * -1, ygravity: room.getPlayerDiscProperties(player.id).yspeed / 16 * -1 });
		if (game.rsGoalKick) room.setDiscProperties(0, { xgravity: 0, ygravity: room.getPlayerDiscProperties(player.id).yspeed / 20 * -1 });
		game.rsCorner = false; game.rsGoalKick = false; game.outStatus = "";
	}

	// Ativa jogo após lateral
	if (!game.rsActive && (game.outStatus === "redThrow" || game.outStatus === "blueThrow")) {
		game.outStatus = ""; game.rsActive = true; game.rsReady = false;
		room.setDiscProperties(0, { color: "0xffffff" });
		game.rsTimer = 1000000; game.warningCount++;
	}
};

room.onPlayerTeamChange = function(changedPlayer, byPlayer) {
	if (map === "RSR" && room.getScores() && !game.rsActive) {
		room.getPlayerList().forEach(p => {
			if (p.position && (game.rsGoalKick || game.rsCorner))
				room.setPlayerDiscProperties(p.id, { invMass: 9999999 });
		});
	}
	balanceTeams();
	checkStart();
};

function realSoccerRef() {
	blockThrowIn();
	blockGoalKick();
	removeBlock();

	// Acréscimos
	if (game.time === gameTime * 60 && !game.extraTimeAnnounced) {
		var extra = Math.ceil(game.extraTimeCount / 60);
		game.extraTimeEnd = gameTime * 60 + extra;
		announce("Acréscimos: " + extra + " segundo(s)", null, null, null, 1);
		game.extraTimeAnnounced = true;
	}

	if (game.time === game.extraTimeEnd && game.extraTimeAnnounced && !game.lastPlayAnnounced) {
		announce("Last play", null, null, null, 1);
		game.lastPlayAnnounced = true;
	}

	if (game.rsCorner || game.rsGoalKick) game.extraTimeCount++;

	// Timer do árbitro
	if (game.rsTimer < 99999 && !game.paused && !game.rsActive && game.rsReady) game.rsTimer++;

	// Swing (bola com curva)
	if (game.rsSwingTimer < 150 && !game.rsCorner && !game.rsGoalKick) {
		game.rsSwingTimer++;
		if (game.rsSwingTimer > 5)
			room.setDiscProperties(0, { xgravity: room.getDiscProperties(0).xgravity * 0.97, ygravity: room.getDiscProperties(0).ygravity * 0.97 });
		if (game.rsSwingTimer === 150)
			room.setDiscProperties(0, { xgravity: 0, ygravity: 0 });
	}

	// Booster
	if (game.boosterState && ++game.boosterCount > 30) {
		game.boosterState = false; game.boosterCount = 0;
		room.setDiscProperties(0, { cMask: 63 });
	}

	// Resetar posição (kick-off)
	var bp = room.getBallPosition();
	if (bp.x === 0 && bp.y === 0) { game.rsActive = true; game.outStatus = ""; }

	if (!game.rsActive) {
		// Timers de lateral
		if (game.outStatus === "redThrow" || game.outStatus === "blueThrow") {
			var isRed = game.outStatus === "redThrow";
			var nextTeam = isRed ? "blueThrow" : "redThrow";
			var warnColor = isRed ? "0xff3f34" : "0x0fbcf9";
			if (game.rsTimer === throwTimeOut - 120) ballWarning(warnColor, ++game.warningCount);
			if (game.rsTimer === throwTimeOut && !game.bringThrowBack) {
				game.outStatus = nextTeam; game.rsTimer = 0;
				room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
				sleep(100).then(() => {
					room.setDiscProperties(0, { color: isRed ? "0x0fbcf9" : "0xff3f34", xspeed: 0, yspeed: 0, x: game.ballOutPositionX, y: game.throwInPosY });
				});
			}
		}
		// Timer tiro de meta
		else if (game.outStatus === "blueGK" || game.outStatus === "redGK") {
			var gkColor = game.outStatus === "blueGK" ? "0x0fbcf9" : "0xff3f34";
			if (game.rsTimer === gkTimeOut - 120) ballWarning(gkColor, ++game.warningCount);
			if (game.rsTimer === gkTimeOut) {
				game.outStatus = ""; room.setDiscProperties(0, { color: "0xffffff" }); game.rsTimer = 1000000;
			}
		}
		// Timer escanteio
		else if (game.outStatus === "blueCK" || game.outStatus === "redCK") {
			var ckColor = game.outStatus === "blueCK" ? "0x0fbcf9" : "0xff3f34";
			if (game.rsTimer === ckTimeOut - 120) ballWarning(ckColor, ++game.warningCount);
			if (game.rsTimer === ckTimeOut) {
				game.outStatus = "";
				room.setDiscProperties(1, { x: 0, y: 2000, radius: 0 });
				room.setDiscProperties(2, { x: 0, y: 2000, radius: 0 });
				room.setDiscProperties(0, { color: "0xffffff" }); game.rsTimer = 1000000;
			}
		}
		return;
	}

	// ─── Bola saiu pelo fundo (lateral) ───
	if (bp.y > 611.45 || bp.y < -611.45) {
		game.rsActive = false;
		room.setDiscProperties(0, { xgravity: 0, ygravity: 0 });
		game.ballOutPositionX = Math.max(-1130, Math.min(1130, Math.round(bp.x * 10) / 10));
		game.throwInPosY = bp.y > 0 ? 610 : -610;
		var throwTeam = game.rsTouchTeam === 1 ? "blueThrow" : "redThrow";
		var throwColor = throwTeam === "blueThrow" ? "0x0fbcf9" : "0xff3f34";
		var throwLabel = throwTeam === "blueThrow" ? "Lateral 🔵" : "Lateral 🔴";
		room.setDiscProperties(3, { x: game.ballOutPositionX, y: game.throwInPosY, radius: 18 });
		sleep(100).then(() => {
			game.outStatus = throwTeam; game.throwinKicked = false;
			game.rsTimer = 0; game.rsReady = true;
			room.setDiscProperties(0, { xspeed: 0, yspeed: 0, x: game.ballOutPositionX, y: game.throwInPosY, xgravity: 0, ygravity: 0, color: throwColor });
			announce(throwLabel);
			room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
		});
	}

	// ─── Bola saiu pelo lado direito (azul défende) ───
	if (bp.x > 1161.45 && (bp.y > 124 || bp.y < -124)) {
		game.rsActive = false;
		room.setDiscProperties(0, { xgravity: 0, ygravity: 0 });
		room.getPlayerList().forEach(p => room.setPlayerDiscProperties(p.id, { invMass: 100000 }));

		if (game.rsTouchTeam === 1) { // tiro de meta azul
			room.setDiscProperties(3, { x: 1060, y: 0, radius: 18 });
			sleep(100).then(() => {
				game.outStatus = "blueGK"; game.rsTimer = 0; game.rsReady = true;
				game.rsGoalKick = true; game.rsSwingTimer = 0; game.boosterCount = 0; game.boosterState = false;
				announce("Tiro de meta 🔵");
				room.setDiscProperties(0, { xspeed: 0, yspeed: 0, x: 1060, y: 0, color: "0x0fbcf9", cMask: 268435519, xgravity: 0, ygravity: 0 });
				sleep(3000).then(() => room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 }));
			});
		} else { // escanteio vermelho
			announce("Escanteio 🔴"); game.rsSwingTimer = 0;
			var cy = bp.y < -124 ? -590 : 590;
			room.setDiscProperties(3, { x: 1140, y: cy, radius: 18 });
			sleep(100).then(() => {
				game.rsCorner = true; game.outStatus = "redCK"; game.rsTimer = 0; game.rsReady = true;
				game.boosterCount = 0; game.boosterState = false;
				room.setDiscProperties(0, { x: 1140, y: cy, xspeed: 0, yspeed: 0, color: "0xff3f34", cMask: 268435519, xgravity: 0, ygravity: 0 });
				room.setDiscProperties(2, { x: 1150, y: (cy < 0 ? -670 : 670), radius: 420 });
				room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
			});
		}
	}

	// ─── Bola saiu pelo lado esquerdo (vermelho défende) ───
	if (bp.x < -1161.45 && (bp.y > 124 || bp.y < -124)) {
		game.rsActive = false;
		room.setDiscProperties(0, { xgravity: 0, ygravity: 0 });
		room.getPlayerList().forEach(p => room.setPlayerDiscProperties(p.id, { invMass: 100000 }));

		if (game.rsTouchTeam === 1) { // escanteio azul
			announce("Escanteio 🔵"); game.rsSwingTimer = 0;
			var cy = bp.y < -124 ? -590 : 590;
			room.setDiscProperties(3, { x: -1140, y: cy, radius: 18 });
			sleep(100).then(() => {
				game.rsCorner = true; game.outStatus = "blueCK"; game.rsTimer = 0; game.rsReady = true;
				game.boosterCount = 0; game.boosterState = false;
				room.setDiscProperties(0, { x: -1140, y: cy, xspeed: 0, yspeed: 0, color: "0x0fbcf9", cMask: 268435519, xgravity: 0, ygravity: 0 });
				room.setDiscProperties(1, { x: -1150, y: (cy < 0 ? -670 : 670), radius: 420 });
				room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 });
			});
		} else { // tiro de meta vermelho
			room.setDiscProperties(3, { x: -1060, y: 0, radius: 18 });
			sleep(100).then(() => {
				game.outStatus = "redGK"; game.rsTimer = 0; game.rsReady = true;
				game.rsGoalKick = true; game.rsSwingTimer = 0; game.boosterCount = 0; game.boosterState = false;
				announce("Tiro de meta 🔴");
				room.setDiscProperties(0, { xspeed: 0, yspeed: 0, x: -1060, y: 0, color: "0xff3f34", cMask: 268435519, xgravity: 0, ygravity: 0 });
				sleep(3000).then(() => room.setDiscProperties(3, { x: 0, y: 2000, radius: 0 }));
			});
		}
	}
}

// ─── BLOQUEIOS DE LATERAL / TIRO DE META ─────────────────────────────────────
function blockThrowIn() {
	if (game.outStatus !== "redThrow" && game.outStatus !== "blueThrow") return;
	var players = room.getPlayerList().filter(p => p.team !== 0);
	var isRedThrow = game.outStatus === "redThrow";
	var blockedTeam = isRedThrow ? 2 : 1;
	var freeLine = room.getBallPosition().y > 0;  // true = fundo, false = topo

	// disc indices para linhas de lateral [topRed, topBlue, botRed, botBlue]
	var lineDiscs = [17, 19, 21, 23];
	var showDisc  = freeLine ? (isRedThrow ? 21 : 23) : (isRedThrow ? 17 : 19);

	lineDiscs.forEach(d => room.setDiscProperties(d, { x: d === showDisc ? 1149 : -1149 }));

	players.forEach(p => {
		if (room.getPlayerDiscProperties(p.id).invMass !== 9999999)
			room.setPlayerDiscProperties(p.id, { invMass: 9999999 });
		if (p.team === blockedTeam) {
			var py = room.getPlayerDiscProperties(p.id).y;
			var onSide = freeLine ? py > 0 : py < 0;
			if (onSide) {
				if (room.getPlayerDiscProperties(p.id).cGroup !== 536870918)
					room.setPlayerDiscProperties(p.id, { cGroup: 536870918 });
				if (freeLine && p.position.y > 460)  room.setPlayerDiscProperties(p.id, { y: 445 });
				if (!freeLine && p.position.y < -460) room.setPlayerDiscProperties(p.id, { y: -445 });
			}
		} else {
			if (room.getPlayerDiscProperties(p.id).cGroup !== 2)
				room.setPlayerDiscProperties(p.id, { cGroup: 2 });
		}
	});
}

function blockGoalKick() {
	if (game.outStatus !== "redGK" && game.outStatus !== "blueGK") return;
	var isBlueGK = game.outStatus === "blueGK";
	var blockedTeam = isBlueGK ? 1 : 2;
	var side = isBlueGK ? 1 : -1; // +1 = direita, -1 = esquerda

	room.getPlayerList().filter(p => p.team !== 0).forEach(p => {
		if (p.team === blockedTeam && room.getPlayerDiscProperties(p.id).x * side > 0) {
			if (room.getPlayerDiscProperties(p.id).cGroup !== 268435462)
				room.setPlayerDiscProperties(p.id, { cGroup: 268435462 });
			if (Math.abs(p.position.x) > 840 && p.position.y > -320 && p.position.y < 320)
				room.setPlayerDiscProperties(p.id, { x: side * 825 });
		} else if (p.team !== blockedTeam && room.getPlayerDiscProperties(p.id).cGroup !== 2) {
			room.setPlayerDiscProperties(p.id, { cGroup: 2 });
		}
	});
}

function removeBlock() {
	if (game.outStatus !== "") return;
	room.getPlayerList().filter(p => p.team !== 0).forEach(p => {
		var expected = p.team === 1 ? 2 : 4;
		if (room.getPlayerDiscProperties(p.id).cGroup !== expected)
			room.setPlayerDiscProperties(p.id, { cGroup: expected });
	});
	[17, 19, 21, 23].forEach(d => { if (room.getDiscProperties(d).x !== -1149) room.setDiscProperties(d, { x: -1149 }); });
}

}).catch(err => {
  console.error("[FATAL] Falha ao inicializar haxball.js:", err);
  process.exit(1);
});

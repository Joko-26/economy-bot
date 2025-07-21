import fs from "fs";
import path from "path";
import { State, defaultState } from "./state";


const stateFile = path.resolve(__dirname, "States.json");

if (!fs.existsSync(stateFile)) {
    fs.writeFileSync(stateFile, JSON.stringify({}, null, 2));
}

let stateData: Record<string, State> = loadStates();

export function loadStates(): Record<string, State> {
    const raw = fs.readFileSync(stateFile, "utf-8");
    return JSON.parse(raw);
}

function saveStates() {
    fs.writeFileSync(stateFile, JSON.stringify(stateData, null, 2));
}

export function deleteState(guildId: string) {
    delete stateData[guildId];
    saveStates();
}

export function getGuildState(guildId: string): State {
    if (!stateData[guildId]) {
        stateData[guildId] = structuredClone(defaultState);
        saveStates();
    }
    return stateData[guildId];
}

// Speichere nur den State einer Guild (optional sinnvoll, wenn du später Optimierungen machst)
export function saveGuildState(guildId: string) {
    if (!stateData[guildId]) return;
    saveStates();
}
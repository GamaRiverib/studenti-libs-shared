import { State } from "./state";

export * from "./state";

export function getAllStatesByCountry(countryIso2: string): State[] {
  const states: State[] = require(`${countryIso2}/states.json`);
  if (states) {
    return states;
  }
  return [];
}

export function getAllStatesNamesByCountry(countryIso2: string): string[] {
  const states: State[] = require(`${countryIso2}/states.json`);
  if (states) {
    return states.map((state) => {
      return state.name;
    });
  }
  return [];
}

export function getAllStatesAbbrvByCountry(countryIso2: string): string[] {
  const states: State[] = require(`${countryIso2}/states.json`);
  if (states) {
    return states.map((state) => {
      return state.abbrv;
    });
  }
  return [];
}

export function getAllStatesIso2ByCountry(countryIso2: string): string[] {
  const states: State[] = require(`${countryIso2}/states.json`);
  if (states) {
    return states.map((state) => {
      return state.iso2;
    });
  }
  return [];
}

export function getStateByCountry(countryIso2: string, state: number|string): State {
  const states: State[] = require(`${countryIso2}/states.json`);
  if (!states) {
    throw new Error('Country states not found');
  }
  let index = -1;
  if (typeof state === "number") {
    const code = state as number;
    index = states.findIndex((state) => {
      return state.code === code;
    });
  } else if (typeof state === "string") {
    const abbrv = state.toString().trim();
    index = states.findIndex((state) => {
      return (state.abbrv === abbrv || state.iso2 === abbrv);
    });
  }
  if (index < 0) {
    throw new Error('State not found');
  }
  return states[index];
}

export function getStatesByCountry(countryIso2: string, states: (number|string)[]): State[] {
  const list = [];
  for (const stateCodeOrAbbrv of states) {
    try {
      const state = getStateByCountry(countryIso2, stateCodeOrAbbrv);
      list.push(state);
    } catch (reason) {
      list.push(undefined);
    }
  }
  return list;
}

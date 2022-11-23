export * from './countries';

import { Country, CountryDto } from './countries';
import * as countries from './countries.json';

export function getAllCountries(): Country[] {
  return countries;
}

export function getAllCountriesDto(): CountryDto[] {
  return countries.map((country) => {
    const dto = new CountryDto();
    dto.code = country.code;
    dto.name = country.name;
    return dto;
  });
}

export function getAllCountriesNames(): string[] {
  return countries.map((country) => {
    return country.name;
  });
}

export function getAllCountriesIso2(): string[] {
  return countries.map((country) => {
    return country.iso2;
  });
}

export function getAllCountriesIso3(): string[] {
  return countries.map((country) => {
    return country.iso3;
  });
}

export function getCountry(nameOrCode: string): Country {
  if (nameOrCode.length === 2) {
    const index = countries.findIndex((country) => {
      return country.iso2 === nameOrCode;
    });
    if (index < 0) {
      throw new Error('Country not found');
    }
    return countries[index];
  } else if (nameOrCode.length === 3) {
    const index = countries.findIndex((country) => {
      return country.iso3 === nameOrCode || country.code === nameOrCode;
    });
    if (index < 0) {
      throw new Error('Country not found');
    }
    return countries[index];
  } else {
    const nameLowerCase = nameOrCode.trim().toLowerCase();
    const index = countries.findIndex((country) => {
      const countryName = country.name.trim().toLowerCase();
      return countryName === nameLowerCase;
    });
    if (index < 0) {
      throw new Error('Country not found');
    }
    return countries[index];
  }
}

export function getCountries(namesOrCodes: string[]): Country[] {
  const list = [];
  for (const nameOrCode of namesOrCodes) {
    try {
      const country = getCountry(nameOrCode);
      list.push(country);
    } catch (reason) {
      list.push(undefined);
    }
  }
  return list;
}

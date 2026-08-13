export interface DepartmentData {
  name: string;
  municipalities: {
    name: string;
    neighborhoods: string[];
    lat: number;
    lng: number;
  }[];
}

export const COLOMBIA_LOCATIONS: DepartmentData[] = [
  {
    name: 'Valle del Cauca',
    municipalities: [
      {
        name: 'Cali',
        neighborhoods: ['Siloé', 'San Fernando', 'Granada', 'El Peñón', 'Ciudad Jardín', 'Valle del Lili', 'Terrón Colorado', 'Aguablanca', 'Tequendama'],
        lat: 3.4516,
        lng: -76.5320
      },
      {
        name: 'Palmira',
        neighborhoods: ['Centro', 'Zamorano', 'Las Mercedes', 'La Italia'],
        lat: 3.5394,
        lng: -76.3036
      },
      {
        name: 'Jamundí',
        neighborhoods: ['Alfaguara', 'El Castillo', 'Bonanza'],
        lat: 3.2606,
        lng: -76.5403
      }
    ]
  },
  {
    name: 'Risaralda',
    municipalities: [
      {
        name: 'Pereira',
        neighborhoods: ['Cuba', 'Alamos', 'Pinares', 'Circunvalar', 'Cerritos', 'Dosquebradas', 'Villasantana'],
        lat: 4.8133,
        lng: -75.6961
      },
      {
        name: 'Dosquebradas',
        neighborhoods: ['Santa Isabel', 'La Pradera', 'Valher'],
        lat: 4.8389,
        lng: -75.6728
      }
    ]
  },
  {
    name: 'Caldas',
    municipalities: [
      {
        name: 'Manizales',
        neighborhoods: ['El Cable', 'Palermo', 'Chipre', 'Alta Suiza', 'La Enea', 'Milán', 'Fatima', 'Sancancio'],
        lat: 5.0689,
        lng: -75.5174
      },
      {
        name: 'Villamaría',
        neighborhoods: ['Centro', 'La Florida'],
        lat: 5.0456,
        lng: -75.5161
      }
    ]
  },
  {
    name: 'Chocó',
    municipalities: [
      {
        name: 'Quibdó',
        neighborhoods: ['Zona Norte', 'El Silencio', 'Reposo', 'Huapango', 'Niño Jesús', 'Pandeyuca', 'Kennedy'],
        lat: 5.6947,
        lng: -76.6611
      },
      {
        name: 'Istmina',
        neighborhoods: ['Centro', 'San Juan'],
        lat: 5.1611,
        lng: -76.6853
      }
    ]
  },
  {
    name: 'Bogotá D.C.',
    municipalities: [
      {
        name: 'Bogotá',
        neighborhoods: ['Chapinero', 'Usaquén', 'Suba', 'Teusaquillo', 'Cedritos', 'Kennedy', 'Engativá', 'Bosa'],
        lat: 4.7110,
        lng: -74.0721
      }
    ]
  },
  {
    name: 'Antioquia',
    municipalities: [
      {
        name: 'Medellín',
        neighborhoods: ['El Poblado', 'Laureles', 'Belén', 'Robledo', 'Envigado', 'Sabaneta', 'Castropol'],
        lat: 6.2442,
        lng: -75.5812
      }
    ]
  }
];

export function getDepartmentNames(): string[] {
  return COLOMBIA_LOCATIONS.map(d => d.name);
}

export function getMunicipalitiesByDepartment(departmentName: string) {
  const dept = COLOMBIA_LOCATIONS.find(d => d.name === departmentName);
  return dept ? dept.municipalities : [];
}

export function getNeighborhoods(departmentName: string, municipalityName: string): string[] {
  const dept = COLOMBIA_LOCATIONS.find(d => d.name === departmentName);
  if (!dept) return [];
  const mun = dept.municipalities.find(m => m.name === municipalityName);
  return mun ? mun.neighborhoods : [];
}

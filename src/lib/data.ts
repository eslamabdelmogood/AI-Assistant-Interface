export type Sensor = {
  name: 'Temperature' | 'Pressure' | 'Vibration';
  value: number;
  unit: '°C' | 'PSI' | 'G';
  history: { time: string; value: number }[];
};

export type MaintenanceEvent = {
  id: string;
  date: string;
  description: string;
  status: 'Completed' | 'Scheduled' | 'In Progress';
};

export type Equipment = {
  id: string;
  name: string;
  type: string;
  status: 'Operational' | 'Warning' | 'Offline';
  sensors: Sensor[];
  maintenanceLog: MaintenanceEvent[];
};

// Function to generate pseudo-random historical data
const generateHistory = (base: number, range: number, points: number = 12) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `${points - i}h ago`,
    value: parseFloat((base + (Math.random() - 0.5) * range).toFixed(2)),
  }));
};

export const DUMMY_EQUIPMENT: Equipment[] = [
  {
    id: 'cnc-001',
    name: 'CNC Mill 3-Axis',
    type: 'Machining',
    status: 'Operational',
    sensors: [
      {
        name: 'Temperature',
        value: 75,
        unit: '°C',
        history: generateHistory(75, 5),
      },
      {
        name: 'Pressure',
        value: 120,
        unit: 'PSI',
        history: generateHistory(120, 10),
      },
      {
        name: 'Vibration',
        value: 0.5,
        unit: 'G',
        history: generateHistory(0.5, 0.2),
      },
    ],
    maintenanceLog: [
      {
        id: 'maint-01',
        date: '2024-07-15',
        description: 'Scheduled lubrication and inspection',
        status: 'Completed',
      },
      {
        id: 'maint-02',
        date: '2024-06-20',
        description: 'Replaced spindle motor bearing',
        status: 'Completed',
      },
       {
        id: 'maint-03',
        date: '2024-05-10',
        description: 'Coolant system flush',
        status: 'Completed',
      },
    ],
  },
  {
    id: 'conv-002',
    name: 'Main Conveyor Belt',
    type: 'Material Handling',
    status: 'Warning',
    sensors: [
      {
        name: 'Temperature',
        value: 92,
        unit: '°C',
        history: generateHistory(90, 8),
      },
      {
        name: 'Pressure',
        value: 85,
        unit: 'PSI',
        history: generateHistory(85, 5),
      },
      {
        name: 'Vibration',
        value: 1.8,
        unit: 'G',
        history: generateHistory(1.8, 0.5),
      },
    ],
    maintenanceLog: [
      {
        id: 'maint-04',
        date: '2024-07-22',
        description: 'Vibration analysis scheduled',
        status: 'Scheduled',
      },
      {
        id: 'maint-05',
        date: '2024-07-01',
        description: 'Belt tension adjustment',
        status: 'Completed',
      },
    ],
  },
  {
    id: 'pump-003',
    name: 'Coolant Pump',
    type: 'Fluid System',
    status: 'Offline',
    sensors: [
      {
        name: 'Temperature',
        value: 25,
        unit: '°C',
        history: generateHistory(25, 2),
      },
      {
        name: 'Pressure',
        value: 0,
        unit: 'PSI',
        history: generateHistory(0, 0),
      },
      {
        name: 'Vibration',
        value: 0,
        unit: 'G',
        history: generateHistory(0, 0),
      },
    ],
    maintenanceLog: [
       {
        id: 'maint-06',
        date: '2024-07-25',
        description: 'Awaiting replacement part',
        status: 'In Progress',
      },
      {
        id: 'maint-07',
        date: '2024-07-24',
        description: 'Motor failure diagnosis',
        status: 'Completed',
      },
    ],
  },
];

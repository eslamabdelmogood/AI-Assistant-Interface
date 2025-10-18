export type Sensor = {
  name: string;
  value: number;
  unit: string;
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

const generateHistory = (base: number, deviation: number, points: number) => {
    return Array.from({ length: points }, (_, i) => ({
      time: `${points - i}h ago`,
      value: parseFloat((base + (Math.random() - 0.5) * deviation).toFixed(2)),
    }));
  };

export const equipments: Equipment[] = [
  {
    id: 'cnc-001',
    name: 'CNC Machine-001',
    type: '5-Axis Mill',
    status: 'Operational',
    sensors: [
      { name: 'Temperature', value: 75, unit: '°C', history: generateHistory(70, 10, 12) },
      { name: 'Pressure', value: 150, unit: 'PSI', history: generateHistory(150, 5, 12) },
      { name: 'Vibration', value: 0.2, unit: 'G', history: generateHistory(0.2, 0.1, 12) },
    ],
    maintenanceLog: [
      { id: 'maint-1', date: '2024-06-15', description: 'Annual inspection', status: 'Completed' },
      { id: 'maint-2', date: '2024-03-20', description: 'Coolant flush', status: 'Completed' },
      { id: 'maint-3', date: '2024-07-28', description: 'Software update', status: 'Scheduled' },
    ],
  },
  {
    id: 'pump-002',
    name: 'Pump-002',
    type: 'Centrifugal Pump',
    status: 'Warning',
    sensors: [
      { name: 'Temperature', value: 95, unit: '°C', history: generateHistory(90, 15, 12) },
      { name: 'Pressure', value: 120, unit: 'PSI', history: generateHistory(125, 10, 12) },
      { name: 'Vibration', value: 0.8, unit: 'G', history: generateHistory(0.7, 0.2, 12) },
    ],
    maintenanceLog: [
      { id: 'maint-4', date: '2024-05-10', description: 'Bearing lubrication', status: 'Completed' },
      { id: 'maint-5', date: '2024-07-25', description: 'Investigate high vibration', status: 'In Progress' },
    ],
  },
  {
    id: 'compressor-003',
    name: 'Compressor-003',
    type: 'Air Compressor',
    status: 'Offline',
    sensors: [
      { name: 'Temperature', value: 25, unit: '°C', history: generateHistory(25, 2, 12) },
      { name: 'Pressure', value: 0, unit: 'PSI', history: generateHistory(5, 5, 12).map(h => ({...h, value: Math.max(0, h.value)})) },
      { name: 'Vibration', value: 0, unit: 'G', history: generateHistory(0.1, 0.1, 12).map(h => ({...h, value: Math.max(0, h.value)})) },
    ],
    maintenanceLog: [
      { id: 'maint-6', date: '2024-07-20', description: 'Motor failure diagnosis', status: 'In Progress' },
      { id: 'maint-7', date: '2024-07-21', description: 'Awaiting spare motor', status: 'Scheduled' },
    ],
  },
];

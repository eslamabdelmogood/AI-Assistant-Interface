'use client';
import { type Sensor } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

type SensorDataChartProps = {
  sensors: Sensor[];
};

const chartConfig: ChartConfig = {
  temperature: {
    label: 'Temperature (°C)',
    color: 'hsl(var(--chart-2))',
  },
  pressure: {
    label: 'Pressure (PSI)',
    color: 'hsl(var(--chart-4))',
  },
  vibration: {
    label: 'Vibration (G)',
    color: 'hsl(var(--chart-5))',
  },
};

export default function SensorDataChart({ sensors }: SensorDataChartProps) {
  // Combine data for charting
  const chartData = sensors[0].history.map((_, i) => {
    const dataPoint: { time: string, [key: string]: any } = { time: i + "h ago" };
    sensors.forEach(sensor => {
      dataPoint[sensor.name.toLowerCase()] = sensor.history[i].value;
    });
    return dataPoint;
  }).reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Sensor Data</CardTitle>
        <CardDescription>Showing data for the last 12 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Legend />
            {sensors.map(sensor => (
              <Line
                key={sensor.name}
                dataKey={sensor.name.toLowerCase()}
                type="monotone"
                stroke={`var(--color-${sensor.name.toLowerCase()})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

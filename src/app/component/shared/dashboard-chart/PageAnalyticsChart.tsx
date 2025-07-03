"use client";
import { useState } from "react";
import {
    BarChart,
    PieChart,
    Pie,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
} from "recharts";
import {
    Box,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Stack,
    Chip,
    useTheme,
} from "@mui/material";

interface AnalyticsChartProps {
    uniqueViewers: number;
    numberOfSubmissions: number;
}

const PageAnalyticsChart = ({
    uniqueViewers,
    numberOfSubmissions,
}: AnalyticsChartProps) => {
    const [chartType, setChartType] = useState<"bar" | "pie" | "radial">("bar");
    const theme = useTheme();

    const data = [
        { name: "Viewers", value: uniqueViewers },
        { name: "Submissions", value: numberOfSubmissions },
    ];

    const COLORS = [
        theme.palette.secondary.main, // Viewers
        theme.palette.primary.main,   // Submissions
    ];

    const handleChartChange = (
        _event: React.MouseEvent<HTMLElement>,
        newChartType: "bar" | "pie" | "radial" | null
    ) => {
        if (newChartType !== null) setChartType(newChartType);
    };

    return (
        <Box mt={4}>
            <Typography variant="h6" fontWeight="bold" color="secondary" mb={2}>
                Form Analytics
            </Typography>

            <ToggleButtonGroup
                color="secondary"
                value={chartType}
                exclusive
                onChange={handleChartChange}
                sx={{ mb: 3 }}
            >
                <ToggleButton value="bar">Bar Chart</ToggleButton>
                <ToggleButton value="pie">Pie Chart</ToggleButton>
                <ToggleButton value="radial">Radial Bar Chart</ToggleButton>
            </ToggleButtonGroup>

            <Box width="100%" height={300} display="flex">
                <ResponsiveContainer>
                    {chartType === "bar" ? (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value">
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`bar-cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    ) : chartType === "pie" ? (
                        <PieChart>
                            <Tooltip />
                            <Legend />
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`pie-cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    ) : (
                        <RadialBarChart
                            innerRadius="30%"
                            outerRadius="90%"
                            data={data}
                            startAngle={180}
                            endAngle={0}
                        >
                            <RadialBar
                                label={{ fill: "#666", position: "insideStart" }}
                                background
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`radial-cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </RadialBar>
                            <Tooltip />
                            <Legend />
                        </RadialBarChart>
                    )}
                </ResponsiveContainer>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
                <Chip
                    label={`Viewers: ${uniqueViewers}`}
                    sx={{ backgroundColor: COLORS[0], color: "#fff" }}
                />
                <Chip
                    label={`Submissions: ${numberOfSubmissions}`}
                    sx={{ backgroundColor: COLORS[1], color: "#fff" }}
                />
            </Stack>
        </Box>
    );
};

export default PageAnalyticsChart;

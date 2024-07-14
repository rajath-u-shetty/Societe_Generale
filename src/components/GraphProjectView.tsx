"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { SOP } from "@prisma/client"
import { BarChart2 } from "lucide-react"

const chartConfig = {
  aiScore: {
    label: "Average AI Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function GraphProjectView({ allSOPs }: { allSOPs: SOP[] }) {
  const chartData = React.useMemo(() => {
    if (!allSOPs || allSOPs.length === 0) return []

    return allSOPs.map(sop => ({
      name: sop.name,
      aiScore: sop.AiScore,
    }))
  }, [allSOPs])

  const averageAiScore = React.useMemo(
    () => chartData.length > 0
      ? chartData.reduce((acc, curr) => acc + curr.aiScore!, 0) / chartData.length
      : 0,
    [chartData]
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="md:font-semibold text-sm md:block hidden"
          variant="default"
          size="sm"
        >
          <BarChart2 className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[900px] min-h-fit overflow-auto">
        <Card>
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>Interactive Graph</CardTitle> 
              <CardDescription>
                Showing average Score for all SOPs in the project based on the regulations.
              </CardDescription>
            </div>
            <div className="flex">
              <button
                data-active
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig.aiScore.label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {averageAiScore.toLocaleString()}
                </span>
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="aiScore"
                      labelFormatter={(value) => value}
                    />
                  }
                />
                <Bar dataKey="aiScore" fill={`var(--color-aiScore)`} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
